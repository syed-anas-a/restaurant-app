from django.db import models
from users.models import User
from menu.models import Menu

# Create your models here.
class Order(models.Model):
    class Status(models.TextChoices):
        PLACED = "PLACED", "Placed"
        PREPARING = "PREPARING", "Preparing"
        OUT_FOR_DELIVERY = "OUT FOR DELIVERY", "Out for Delivery"
        DELIVERED = "DELIVERED", "Delivered"
        CANCELLED = "CANCELLED", "Cancelled"

    user = models.ForeignKey(User, on_delete=models.CASCADE)
    order_value = models.DecimalField(max_digits=8, decimal_places=2)
    delivery_crew = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='delivery_orders')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.PLACED)
    

class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(Menu, on_delete=models.PROTECT)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    



