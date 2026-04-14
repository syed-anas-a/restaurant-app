from django.urls import path
from . import views

urlpatterns = [
    path('', views.MenuListCreateView.as_view(), name='menu'),
]