from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView
)

urlpatterns = [
    path('register/', views.UserView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pairview'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh_view'),
    path('logout/', views.LogoutView.as_view()),
]