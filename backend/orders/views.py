from django.shortcuts import render
from rest_framework.views import APIView
from .models import Order, OrderItem
from django.shortcuts import get_object_or_404
from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework.response import Response
from rest_framework import status
from cart.models import Cart, CartItem
from users.permissions import IsManager, IsOwner, IsDeliveryCrew, IsCustomer
from rest_framework.permissions import IsAuthenticated
from .utils import get_available_crew
from django.db import transaction

# Create your views here.
class OrderView(APIView):

    def get(self, request):
        if request.user.group == "MANAGER":
            order = Order.objects.all()
        else:
            order = Order.objects.filter(user=request.user)
        serializer = OrderSerializer(order, many=True)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    
    def post(self, request):
        with transaction.atomic():
            cart = get_object_or_404(Cart, user=request.user)
            cart_items = CartItem.objects.filter(cart=cart)

            if not cart_items:
                return Response({"error":"cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
            
            order = Order.objects.create(
                user=request.user,
                order_value = cart.cart_value
            )
            OrderItem.objects.bulk_create([
                OrderItem(
                    order=order,
                    menu_item=item.menu_item,
                    quantity=item.quantity,
                    price=item.price
                )
                for item in cart_items
            ])
            cart.delete()

        return Response({"message":"order created"}, status=status.HTTP_201_CREATED)

class OrderDetailView(APIView):

    permission_classes = [IsAuthenticated, IsOwner]

    def get(self, request, order_id):

        order = get_object_or_404(Order, id=order_id)
        if not request.user.group == "MANAGER":
            self.check_object_permissions(request, order.user)

        serializer = OrderSerializer(order)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, order_id):

        new_status = request.data.get("status")
        order = get_object_or_404(Order, id=order_id)

        if request.user.group == "DELIVERY CREW":
            if request.user != order.delivery_crew:
                return Response({"error":"Not your order"}, status=status.HTTP_403_FORBIDDEN)
            if new_status != "DELIVERED":
                return Response({"error":"You can only mark order as delivered"}, status=status.HTTP_403_FORBIDDEN)
            
            order.status = "DELIVERED"
            order.save()

            return Response({"message":"Order marked as delivered"}, status=status.HTTP_200_OK)
    
        if request.user.group == "MANAGER":
            if new_status not in [Order.Status.choices]:
                return Response({"error":"Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
            if new_status.lower() == "out for delivery":
                crew = get_available_crew()
                if not crew:
                    return Response({"error":"No available crew"}, status=status.HTTP_400_BAD_REQUEST)
                order.delivery_crew = crew

        order.status = new_status
        order.save()

        return Response({"message":f"status updated as {new_status} for order id: {order_id}"}, status=status.HTTP_200_OK)

    




        

