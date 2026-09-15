from rest_framework.permissions import BasePermission

class IsManager(BasePermission):
    def has_permission(self, request, view):
            return request.user.group.filter(name='Manager').exists()

class IsDeliveryCrew(BasePermission):
    def has_permission(self, request, view):
            return request.user.group.filter(name='Delivery Crew').exists()

class IsCustomer(BasePermission):
      def has_permission(self, request, view):
            return request.user.group.filter(name='Customer').exists() 