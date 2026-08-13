from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Company
from .serializers import CompanySerializer
from common.permissions import IsRecruiter

class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [IsRecruiter()]

    def perform_create(self, serializer):
        serializer.save(recruiter=self.request.user)

    @action(detail=False, methods=['get', 'post', 'put', 'patch'], permission_classes=[IsRecruiter])
    def my_company(self, request):
        company = Company.objects.filter(recruiter=request.user).first()
        if request.method == 'GET':
            if not company:
                return Response({'detail': 'No company found for this recruiter.'}, status=status.HTTP_404_NOT_FOUND)
            return Response(CompanySerializer(company).data)

        if not company:
            serializer = CompanySerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(recruiter=request.user)
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            serializer = CompanySerializer(company, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
