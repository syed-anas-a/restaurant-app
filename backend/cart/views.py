from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
from rest_framework.response import Response
from rest_framework import status
from menu.models import Menu
from django.db.models import Sum
from django.db import transaction 


# Create your views here.
class CartView(APIView):

    def get(self, request):
        cart = Cart.objects.filter(user=request.user).first()

        if not cart:
            return Response({"items":"[]", "cart_value":"0.0"}, status=status.HTTP_200_OK)
        cart_items = CartItem.objects.filter(cart=cart)
        serializer = CartItemSerializer(cart_items, many=True)

        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        menu_item_id = request.data.get("menu_item_id")
        quantity = request.data.get("quantity", 1)

        with transaction.atomic():

            menu_item = get_object_or_404(Menu, id=menu_item_id)

            cart, _ = Cart.objects.get_or_create(user=request.user)

            cart_item = (
                CartItem.objects
                .select_for_update()
                .filter(cart=cart, menu_item=menu_item)
                .first()
            )

            if cart_item:
                cart_item.quantity += quantity
                cart_item.price = menu_item.price * cart_item.quantity
                cart_item.save()
            else:
                cart_item = CartItem.objects.create(
                    cart=cart,
                    menu_item=menu_item,
                    quantity=quantity,
                    price=menu_item.price*quantity
                )

            total = CartItem.objects.filter(cart=cart).aggregate(total=Sum("price"))["total"] or 0
            cart.cart_value = total
            cart.save()

        return Response({"message": "Item added"}, status=status.HTTP_201_CREATED)

class CartDetailView(APIView):

    def put(self, request, item_id):
        quantity = request.data.get("quantity")

        with transaction.atomic():

            try:
                cart = (
                    Cart.objects
                    .select_for_update()
                    .get(user=request.user)
                )
            except Cart.DoesNotExist:
                return Response({"error":"Cart not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                cart_item = (
                    CartItem.objects
                    .select_for_update()
                    .get(user=request.user, id=item_id)
                )
            except CartItem.DoesNotExist:
                return Response({"error":"Item not found"}, status=status.HTTP_404_NOT_FOUND)

            cart_item.quantity = quantity
            cart_item.price = cart_item.menu_item.price * quantity
            cart_item.save()

            cart.cart_value = CartItem.objects.filter(cart=cart).aggregate(total=Sum("price"))["total"] or 0
            cart.save()

        return Response({"message":"quantity updated"}, status=status.HTTP_200_OK)

    def delete(self, request, item_id):
        with transaction.atomic():
            try:
                cart = (
                    Cart.objects
                    .select_for_update()
                    .get(user=request.user)
                )
            except Cart.DoesNotExist:
                return Response({"error":"Cart not found"}, status=status.HTTP_404_NOT_FOUND)

            try:
                cart_item = (
                    CartItem.objects
                    .select_for_update()
                    .get(user=request.user, id=item_id)
                )
            except CartItem.DoesNotExist:
                return Response({"error":"Cart not found"}, status=status.HTTP_404_NOT_FOUND)
    
            cart_item.delete()

            cart.cart_value = CartItem.objects.filter(cart=cart).aggregate(total=Sum("price"))["total"] or 0
            cart.save()

        return Response({"message": "item removed from cart"}, status=status.HTTP_200_OK)
        






