from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer
from .permissions import IsCustomer, IsDeliveryCrew, IsManager, IsOwner
from .models import User
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

# Create your views here.
class UserView(APIView):

    permission_classes = [IsManager]

    def get(self, request):
        data = User.objects.all()
        serializer = UserSerializer(data=data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        print(refresh)

        return Response({
            "user": serializer.data,
            "access": str(refresh.access_token),
            "refresh": str(refresh)
        }, status=status.HTTP_201_CREATED)

class UserDetailView(APIView):

    permission_classes = [IsAuthenticated, IsOwner]

    def is_manager(self):
        return self.request.user.group == "MANAGER"

    def get(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if not self.is_manager():
            self.check_object_permissions(request, user)

        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if not self.is_manager():
            self.check_object_permissions(request, user)

        serializer = UserSerializer(user, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, user_id):
        user = get_object_or_404(User, id=user_id)
        if not self.is_manager():
            self.check_object_permissions(request, user)

        user.delete()
        return Response(status=status.HTTP_NO_CONTENT)



