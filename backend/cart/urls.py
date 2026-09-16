from django.urls import path
from .views import CartView, CartDetailView

urlpatterns = [
    path('', CartView.as_view()),
    path('items/<int:item_id>', CartDetailView.as_view()),
]