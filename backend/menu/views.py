from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .serializers import MenuSerializer
from .models import Menu
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from users.permissions import IsManager, IsDeliveryCrew

# Create your views here.
class MenuListCreateView(APIView):
    def get(self, request):
        permission_classes = [AllowAny]
        queryset = Menu.objects.all()
        serializer = MenuSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        permission_classes = [IsManager] 
        serializer = MenuSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class MenuDetailView(APIView):
    def get(self, request, pk):
        permission_classes = [AllowAny]
        item = get_object_or_404(Menu, pk=pk)
        serializer = MenuSerializer(item)
        return Response(serializer.data, status=status.HTTP_200_OK) 

    def put(self, request, pk):
        permission_classes = [IsManager]
        item = get_object_or_404(Menu, pk=pk)
        serializer = MenuSerializer(data=item)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.data, status=status.HTTP_201_OK)

    def delete(self, request, pk):
        permission_classes = [IsManager]
        item = get_object_or_404(Menu, pk=pk)
        item.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

