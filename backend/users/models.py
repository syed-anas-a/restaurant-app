from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    class Group(models.TextChoices):
        ADMIN = "ADMIN", "Admin"
        MANAGER = "MANAGER", "Manager"
        DELIVERY_CREW = "DELIVERY CREW", "Delivery Crew"
        CUSTOMER = "CUSTOMER", "Customer"

    group = models.CharField(max_length=20, choices=Group.choices, default=Group.CUSTOMER)

    username = None
    email = models.CharField(max_length=200, unique=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
