from django.db import models
from users.models import User
from cart.models import Cart, CartItem

# Create your models here.
class Order(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_value = models.DecimalField(max_digits=8, decimal_places=2)
    cart = models.ForeignKey(Cart, on_delete=models.PROTECT)

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    cart_item = models.OneToOneField(CartItem, on_delete=models.PROTECT)
    



