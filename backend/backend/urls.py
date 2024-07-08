from django.urls import path, include
from rest_framework.authtoken.views import obtain_auth_token  # <-- Here

urlpatterns = [
   path('auth/login', obtain_auth_token, name='auth_login'),
   path('', include('contents.urls'))
]
