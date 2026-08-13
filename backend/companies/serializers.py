from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Company
        fields = '__all__'
        read_only_fields = ('recruiter', 'created_at', 'updated_at')

    def get_job_count(self, obj):
        return obj.jobs.filter(status='PUBLISHED').count()
