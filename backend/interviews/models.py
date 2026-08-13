from django.db import models
from django.conf import settings
from applications.models import Application

class Interview(models.Model):
    class Status(models.TextChoices):
        SCHEDULED = 'SCHEDULED', 'Scheduled'
        COMPLETED = 'COMPLETED', 'Completed'
        CANCELLED = 'CANCELLED', 'Cancelled'
        RESCHEDULED = 'RESCHEDULED', 'Rescheduled'

    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='interviews')
    scheduled_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='scheduled_interviews')
    interview_date = models.DateField()
    interview_time = models.TimeField()
    meeting_link = models.CharField(max_length=500, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.SCHEDULED)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-interview_date', '-interview_time']

    def __str__(self):
        return f"Interview for {self.application.candidate.get_full_name()} on {self.interview_date}"
