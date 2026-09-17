from django.db import models
from users.models import User
from menu.models import Menu

# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    cart_value = models.DecimalField(max_digits=10, decimal_places=2, default=0.0) 

class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(Menu, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    quantity = models.PositiveIntegerField()

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['cart', 'menu_item'],
                name='unique_cart_menu_item'
            )
        ]
