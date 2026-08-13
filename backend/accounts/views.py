from rest_framework import generics, status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from django.contrib.auth import get_user_model
from .models import JobSeekerProfile, Skill, Education, Experience, Certification
from .serializers import (
    UserSerializer, RegisterSerializer, JobSeekerProfileSerializer,
    SkillSerializer, EducationSerializer, ExperienceSerializer, CertificationSerializer
)

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'message': 'User registered successfully.'
        }, status=status.HTTP_201_CREATED)


class UserProfileView(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        user = request.user
        data = UserSerializer(user).data
        if user.role == User.Role.JOB_SEEKER:
            profile, _ = JobSeekerProfile.objects.get_or_create(user=user)
            profile.calculate_completion()
            data['profile'] = JobSeekerProfileSerializer(profile).data
        return Response(data)

    def put(self, request):
        return self.patch(request)

    def patch(self, request):
        user = request.user
        serializer = UserSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            if user.role == User.Role.JOB_SEEKER:
                profile, _ = JobSeekerProfile.objects.get_or_create(user=user)
                profile_data = request.data.get('profile', {})
                if isinstance(profile_data, dict) and profile_data:
                    p_serializer = JobSeekerProfileSerializer(profile, data=profile_data, partial=True)
                    if p_serializer.is_valid():
                        p_serializer.save()
                profile.calculate_completion()
            return Response(UserSerializer(user).data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class SkillViewSet(viewsets.ModelViewSet):
    serializer_class = SkillSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Skill.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        if hasattr(self.request.user, 'job_seeker_profile'):
            self.request.user.job_seeker_profile.calculate_completion()


class EducationViewSet(viewsets.ModelViewSet):
    serializer_class = EducationSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Education.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ExperienceViewSet(viewsets.ModelViewSet):
    serializer_class = ExperienceSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Experience.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class CertificationViewSet(viewsets.ModelViewSet):
    serializer_class = CertificationSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Certification.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ResumeUploadView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        if 'resume' not in request.FILES:
            return Response({'error': 'No resume file provided.'}, status=status.HTTP_400_BAD_REQUEST)

        file = request.FILES['resume']
        if not file.name.lower().endswith('.pdf'):
            return Response({'error': 'Only PDF resumes are supported.'}, status=status.HTTP_400_BAD_REQUEST)

        profile, _ = JobSeekerProfile.objects.get_or_create(user=request.user)
        profile.resume = file
        profile.save()
        profile.calculate_completion()

        return Response({
            'message': 'Resume uploaded successfully.',
            'profile': JobSeekerProfileSerializer(profile).data
        })


class ForgotPasswordView(APIView):
    permission_classes = (AllowAny,)

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.filter(email=email).first()
        if user:
            # Simulate password reset token email
            return Response({'message': f'Password reset link sent to {email}'})
        return Response({'message': 'If this email exists in our records, a reset link has been sent.'})
