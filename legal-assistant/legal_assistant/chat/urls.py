from django.urls import path
from .views import (
    LegalQueryView, 
    ChatHistoryView, 
    LegalCategoriesView, 
    UserRegistrationView, 
    UserLoginView,
    api_root,
    ChatAPIRootView
)

urlpatterns = [
    # Root API endpoint
    path('', ChatAPIRootView.as_view(), name='chat_api_root'),
    path('root/', api_root, name='api_root'),

   # Authentication Endpoints
    path('register/', UserRegistrationView.as_view(), name='user_registration'),
    path('login/', UserLoginView.as_view(), name='user_login'),

# Existing Chat Endpoints
    path('legal-query/', LegalQueryView.as_view(), name='legal_query'),
    path('history/', ChatHistoryView.as_view(), name='chat_history'),
    path('history/<int:session_id>/', ChatHistoryView.as_view(), name='chat_session_detail'),
    path('categories/', LegalCategoriesView.as_view(), name='legal_categories'),
]