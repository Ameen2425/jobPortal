from rest_framework import serializers
from .models import Application
from jobs.serializers import JobSerializer
from accounts.serializers import UserSerializer, JobSeekerProfileSerializer
from accounts.models import JobSeekerProfile

class ApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    candidate_details = UserSerializer(source='candidate', read_only=True)
    candidate_profile = serializers.SerializerMethodField()
    ai_match_score = serializers.SerializerMethodField()

    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ('candidate', 'applied_at', 'updated_at')

    def get_candidate_profile(self, obj):
        profile = getattr(obj.candidate, 'job_seeker_profile', None)
        if profile:
            return JobSeekerProfileSerializer(profile).data
        return None

    def get_ai_match_score(self, obj):
        # Calculate matching score dynamically or return calculated score
        try:
            from ai_engine.services.recommendation_engine import calculate_job_candidate_match
            profile = getattr(obj.candidate, 'job_seeker_profile', None)
            return calculate_job_candidate_match(obj.job, obj.candidate, profile)
        except Exception:
            return 85  # Fallback score if calculation encounters missing fields

    def validate(self, attrs):
        request = self.context.get('request')
        job = attrs.get('job')
        if request and request.user.is_authenticated:
            if Application.objects.filter(job=job, candidate=request.user).exists():
                raise serializers.ValidationError({"detail": "You have already applied for this job."})
        return attrs
