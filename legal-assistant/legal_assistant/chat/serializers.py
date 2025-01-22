# from rest_framework import serializers
# from django.contrib.auth.models import User
# from .models import ChatSession, ChatMessage

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['id', 'username', 'email']

# class ChatMessageSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = ChatMessage
#         fields = ['id', 'message', 'sender_type', 'created_at']

# class ChatSessionSerializer(serializers.ModelSerializer):
#     messages = ChatMessageSerializer(many=True, read_only=True)
#     user = UserSerializer(read_only=True)

#     class Meta:
#         model = ChatSession
#         fields = ['id', 'user', 'created_at', 'messages']

from rest_framework import serializers
from django.contrib.auth.models import User
from .models import ChatSession, ChatMessage

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # Ensure password is write-only

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']  # Include password in fields

    def create(self, validated_data):
        user = User(**validated_data)
        user.set_password(validated_data['password'])  # Hash the password
        user.save()
        return user

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'message', 'sender_type', 'created_at']

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = ChatSession
        fields = ['id', 'user', 'created_at', 'messages']
