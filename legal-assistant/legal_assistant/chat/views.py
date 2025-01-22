from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view
from rest_framework.reverse import reverse

from .models import ChatSession, ChatMessage
from utils.ai_assistant import LegalAIAssistant
from .serializers import ChatSessionSerializer, ChatMessageSerializer
from rest_framework import generics
from .serializers import UserSerializer
from django.contrib.auth.models import User

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

@api_view(['GET'])
def api_root(request, format=None):
    """
    API Root endpoint providing navigation to available chat API endpoints
    """
    return Response({
        'registration': reverse('user_registration', request=request, format=format),
        'login': reverse('user_login', request=request, format=format),
        'legal_query': reverse('legal_query', request=request, format=format),
        'chat_history': reverse('chat_history', request=request, format=format),
        'legal_categories': reverse('legal_categories', request=request, format=format),
    })

class ChatAPIRootView(APIView):
    permission_classes = []

    def get(self, request):
        """
        Provides an overview of available chat API endpoints
        """
        return Response({
            'message': 'Welcome to the Legal Assistant Chat API',
            'endpoints': {
                'registration': '/api/chat/register/',
                'login': '/api/token/',
                'legal_query': '/api/chat/legal-query/',
                'chat_history': '/api/chat/history/{session_id}/',
                'legal_categories': '/api/chat/categories/',
            }
        }, status=status.HTTP_200_OK)

class UserRegistrationView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response(
                {"error": "Please provide username, email, and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if User.objects.filter(username=username).exists():
                return Response(
                    {"error": "Username already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            user = User.objects.create_user(
                username=username, 
                email=email, 
                password=password
            )

            refresh = RefreshToken.for_user(user)

            return Response({
                'user_id': user.id,
                'username': user.username,
                'email': user.email,

                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UserLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response(
                {"error": "Please provide username and password"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'user_id': user.id,
                'username': user.username,
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        else:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

class LegalQueryView(APIView):
    permission_classes = [IsAuthenticated]

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.legal_assistant = LegalAIAssistant()

    def post(self, request):
        query = request.data.get('query', '')
        
        if not query:
            return Response(
                {"error": "No query provided"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create a new chat session
            session = ChatSession.objects.create(user=request.user)
            
            # Save user's query as a message
            user_message = ChatMessage.objects.create(
                session=session, 
                message=query, 
                sender_type='user'
            )
            
            # Generate AI legal response
            legal_analysis = self.legal_assistant.generate_legal_response(query)
            
            # Save AI's response as a message
            ai_message = ChatMessage.objects.create(
                session=session, 
                message=legal_analysis.get('response', 'No response generated'), 
                sender_type='ai'
            )
            
            # Prepare response data
            response_data = {
                'session_id': session.id,
                'query': query,
                'response': legal_analysis.get('response', 'No response generated'),
                'key_points': legal_analysis.get('key_points', []),
                'error': legal_analysis.get('error')
            }
            
            # Return successful response
            return Response(response_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            # Log the error for server-side tracking
            print(f"Legal Query Error: {str(e)}")
            
            return Response(
                {
                    "error": "An unexpected error occurred while processing your legal query.", 
                    "details": str(e)
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_id=None):
        try:
            # If no session_id, return all user's chat sessions
            if not session_id:
                sessions = ChatSession.objects.filter(user=request.user)
                serializer = ChatSessionSerializer(sessions, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            # If session_id provided, return specific session details
            try:
                session = ChatSession.objects.get(id=session_id, user=request.user)
            except ChatSession.DoesNotExist:
                return Response(
                    {"error": "Chat session not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Serialize and return session messages
            serializer = ChatSessionSerializer(session)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {
                    "error": "An error occurred while retrieving chat history.", 
                    "details": str(e)
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class LegalCategoriesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            legal_assistant = LegalAIAssistant()
            categories = legal_assistant.get_legal_categories()
            
            return Response({
                "legal_categories": categories
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response(
                {
                    "error": "An error occurred while retrieving legal categories.", 
                    "details": str(e)
                }, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )