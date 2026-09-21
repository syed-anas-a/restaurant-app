from rest_framework import serializers
from .models import Cart, CartItem
from menu.serializers import MenuSerializer

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        fields = '__all__'

class CartItemSerializer(serializers.ModelSerializer):

    menu_item = MenuSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = '__all__'