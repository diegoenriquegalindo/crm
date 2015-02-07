from django.shortcuts import render_to_response
from django.contrib import auth
from django.http import HttpResponseRedirect
from django.core.context_processors import csrf
from django.contrib.auth.models import User
from django.contrib.auth.models import Group
from rest_framework import viewsets
from home.serializers import UserSerializer, GroupSerializer

def get_loggedin_context(request):
    c = {}
    c.update(csrf(request))
    c["logged_in"] = request.user.is_authenticated()
    c["customer_list"] = []
    if c["logged_in"]:
        user_obj = User.objects.get(username=str(request.user.username))
        c["username"] = user_obj.username
        c["customer_list"] = user_obj.employee.customers.all()
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

class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
