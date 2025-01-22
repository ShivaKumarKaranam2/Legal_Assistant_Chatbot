from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

# Simple view for the root URL
def home_view(request):
    return HttpResponse("""
    <h1>Welcome to the Legal Assistant API</h1>
    <p>Available Endpoints:</p>
    <ul>
        <li>/api/token/ - Token generation</li>
        <li>/api/token/refresh/ - Token refresh</li>
        <li>/api/chat/ - Chat API root</li>
    </ul>
    """)

urlpatterns = [
    path('', home_view, name='home'),
    path('admin/', admin.site.urls),
    
    # JWT Token endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Chat app URLs
    path('api/chat/', include('chat.urls')),
]