from rest_framework import serializers
from .models import Questionlist

class QuestionlistSerializer(serializers.ModelSerializer):
    """Serializer to map the Model instance into JSON format."""

    class Meta:
        """Meta class to map serializer's fields with the model fields."""
        model = Questionlist
        fields = ('id', 'subject','predicate','object', 'date_created', 'date_modified')
        read_only_fields = ('date_created', 'date_modified')
        
