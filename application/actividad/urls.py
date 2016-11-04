from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^$',views.index),
    url(r'^login/(?P<user>[0-9\-]{13})/(?P<passw>[a-z0-9]{30,35})',views.login),
    url(r'^logout',views.logout),
    url(r'^status',views.status)
]