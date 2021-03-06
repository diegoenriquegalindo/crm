from django.conf.urls import patterns, include, url
# Uncomment the next two lines to enable the admin:
from django.contrib import admin
admin.autodiscover()
from home.views import home_view
from home.views import login_view, logout_view
from home.views import messages_view, settings_view
from rest_framework import routers
from home.views import CustomerViewSet, TaskViewSet

router = routers.DefaultRouter()
router.register(r'customers',CustomerViewSet)
router.register(r'tasks',TaskViewSet)

urlpatterns = patterns('',
        (r'^$',home_view),
        (r'^login/?',login_view),
        (r'^logout/?',logout_view),
        (r'^messages/$',messages_view),
        (r'^settings/$',settings_view),
        url(r'^', include(router.urls)),
        url(r'^api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    # Examples:
    # url(r'^$', 'crm.views.home', name='home'),
    # url(r'^crm/', include('crm.foo.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # url(r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    (r'^admin/', include(admin.site.urls)),
)
