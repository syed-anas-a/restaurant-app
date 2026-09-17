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
        cart = get_object_or_404(Cart, user=request.user)
        order = Order.objects.create(
            user=request.user,
            cart = cart,
            order_value = cart.cart_value
        )
        order.save()
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
    




        

