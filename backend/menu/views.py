from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import MenuItemSerializer
from .models import MenuItem
from rest_framework.response import Response
from rest_framework import status

# Create your views here.
class MenuListCreateView(APIView):
    def get(self, request):
        queryset = MenuItem.objects.all()
        serializer = MenuItemSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = MenuItemSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
