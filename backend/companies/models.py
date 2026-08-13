from django.db import models
from django.conf import settings

class Company(models.Model):
    recruiter = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='companies'
    )
    company_name = models.CharField(max_length=255)
    logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    description = models.TextField(blank=True, default='')
    website = models.URLField(max_length=300, blank=True, default='')
    industry = models.CharField(max_length=150, blank=True, default='Information Technology')
    company_size = models.CharField(max_length=50, blank=True, default='11-50 employees')
    location = models.CharField(max_length=150, blank=True, default='')
    founded_year = models.IntegerField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Companies"

    def __str__(self):
        return self.company_name
