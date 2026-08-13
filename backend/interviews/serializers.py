from rest_framework import serializers
from .models import Interview
from applications.serializers import ApplicationSerializer

class InterviewSerializer(serializers.ModelSerializer):
    application_details = ApplicationSerializer(source='application', read_only=True)

    class Meta:
        model = Interview
        fields = '__all__'
        read_only_fields = ('scheduled_by', 'created_at')
