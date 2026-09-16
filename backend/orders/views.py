from django.shortcuts import render
from rest_framework.views import APIView
from .models import Order, OrderItem
from django.shortcuts import get_object_or_404
from .serializers import OrderSerializer, OrderItemSerializer
from rest_framework.response import Response
from rest_framework import status
from cart.models import Cart, CartItem
from users.permissions import IsManager, IsOwner, IsDeliveryCrew, IsCustomer

# Create your views here.
class OrderView(APIView):
    permission_classes = [IsCustomer]

    def get(self, request):
        order = get_object_or_404(Order, user=request.user)
        serializer = OrderSerializer(data=order)
        return Response({"data": serializer.data}, status=status.HTTP_200_OK)

    def post(self, request):
        cart = get_object_or_404(Cart, user=request.user)
        order = Order.objects.create(
            user=request.user,
            cart = cart,
            order_value = cart.cart_value
        )
        order.save()
        cart.delete()
        return Response({"message":"order created"}, status=status.HTTP_201_CREATED)


        

