from django.shortcuts import render_to_response
from django.contrib import auth
from django.http import HttpResponseRedirect
from django.core.context_processors import csrf
from django.contrib.auth.models import User

def get_loggedin_context(request):
    c = {}
    c.update(csrf(request))
    c["logged_in"] = request.user.is_authenticated()
    c["customer_list"] = []
    if c["logged_in"]:
        user_obj = User.objects.get(username=str(request.user.username))
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
    return render_to_response("messages.html",c)

def settings_view(request):
    c = get_loggedin_context(request)
    return render_to_response("settings.html",c)
