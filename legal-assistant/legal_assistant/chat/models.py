from django.db import models
from django.contrib.auth.models import User

class ChatSession(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Chat Session for {self.user.username}"

class ChatMessage (models.Model):
    session = models.ForeignKey(ChatSession, related_name='messages', on_delete=models.CASCADE)
    message = models.TextField()
    sender_type = models.CharField(max_length=10, choices=[('user', 'User '), ('ai', 'AI')])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.sender_type.capitalize()} message in session {self.session.id}"