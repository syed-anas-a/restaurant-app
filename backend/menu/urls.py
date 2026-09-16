from django.urls import path
from .views import MenuView, MenuDetailView

urlpatterns = [
    path('', MenuView.as_view(), name='menu'),
    path('/items/<int:item_id>/', MenuDetailView.as_view()),
]