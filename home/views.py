from django.shortcuts import render_to_response
from django.contrib import auth
from django.http import HttpResponseRedirect
from django.core.context_processors import csrf
from django.core.paginator import Paginator
from django.db.models import Q
from rest_framework import viewsets, permissions
from rest_framework.response import Response
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
    lookup_url_kwarg = 'id'
    lookup_field = 'id'
    resource_name = False

    def list(self,request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        data = {'customer':serializer.data}
        if 'num_pages' in queryset.__dict__:
            data['meta'] = {'num_pages':queryset.num_pages}
        return Response(data)

    def retrieve(self,request,id=None):
        customer = self.get_object()
        serializer = self.serializer_class(customer)
        return Response(serializer.data)

    def get_queryset(self):
        queryset = Customer.objects.filter(owner=self.request.user)
        search = self.request.QUERY_PARAMS.get('search',None)
        if search is not None:
            queryset = queryset.filter(\
                    Q(id__contains=search) |\
                    Q(name__contains=search) |\
                    Q(contact__contains=search) |\
                    Q(position__contains=search) )
        page = self.request.QUERY_PARAMS.get('page', None)
        if page is not None:
            try: page = int(page)
            except ValueError: page = None
            if page == None: queryset = []
            else:
                paginator = Paginator(queryset,12)
                try:
                    queryset = paginator.page(page).object_list
                except:
                    queryset = Customer.objects.none()
                queryset.num_pages = paginator.num_pages
        return queryset

class TaskViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
