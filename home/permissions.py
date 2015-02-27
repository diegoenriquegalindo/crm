from rest_framework import permissions

class CustomerPermission(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_permission(self, request, view ):
        if request.method in permissions.SAFE_METHODS:
            return True
        return False

    def has_object_permission(self, request, view, obj):
        for owner in obj.owner.all():
            if owner == request.user: return True
        return False

class TaskPermission(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_permission(self, request, view ):
        if request.method in permissions.SAFE_METHODS or\
                request.method == 'POST':
            return True
        return False

    def has_object_permission(self, request, view, obj):
        for owner in obj.owner.all():
            if owner == request.user: return True
        return False
