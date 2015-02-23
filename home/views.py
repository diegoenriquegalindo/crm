from django.shortcuts import render_to_response
from django.contrib import auth
from django.http import HttpResponseRedirect
from django.core.context_processors import csrf
from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework.decorators import detail_route
from home.models import Customer, Task, Vendor
from home.serializers import CustomerSerializer, TaskSerializer
from home.permissions import CustomerPermission

def get_loggedin_context(request):
    c = {}
    c.update(csrf(request))
    c["logged_in"] = request.user.is_authenticated()
    c["customer_list"] = []
    if c["logged_in"]:
        user_obj = Vendor.objects.get(username=str(request.user.username))
        c["username"] = user_obj.username
    return c

def home_view(request):
    c = get_loggedin_context(request)
    return render_to_response("crm.html",c)

def login_view(request):
    username = request.POST.get('username', '')
    password = request.POST.get('password', '')
    user = auth.authenticate(username=username, password=password)
    if user is not None and user.is_active:
        # Correct password, and the user is marked "active"
        auth.login(request, user)
        # Redirect to a success page.
        return HttpResponseRedirect("/")
    else:
        # Show an error page
        return HttpResponseRedirect("/")

def logout_view(request):
    auth.logout(request)
    # Redirect to a success page.
    return HttpResponseRedirect("/")

def messages_view(request):
    c = get_loggedin_context(request)
    if c["logged_in"]:
        return render_to_response("messages.html",c)
    else:
        return render_to_response("no_access.html",c)

def settings_view(request):
    c = get_loggedin_context(request)
    if c["logged_in"]:
        return render_to_response("settings.html",c)
    else:
        return render_to_response("no_access.html",c)

class CustomerViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    permission_classes = (permissions.IsAuthenticated,CustomerPermission,)
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def list(self,request):
        queryset = Customer.objects.filter(owner=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    @detail_route()
    def show_customer(self,request,pk=None):
        customer = self.get_object()
        serializer = self.serializer_class(customer)
        return Response(serializer.data)

class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
