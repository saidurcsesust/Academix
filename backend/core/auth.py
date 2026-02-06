import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication
from rest_framework.exceptions import AuthenticationFailed

from students.models import Student


class JWTAuthentication(BaseAuthentication):
    def authenticate(self, request):
        header = request.headers.get('Authorization', '')
        if not header.startswith('Bearer '):
            return None

        token = header.split(' ', 1)[1].strip()
        if not token:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
        except jwt.ExpiredSignatureError as exc:
            raise AuthenticationFailed('Token expired') from exc
        except jwt.InvalidTokenError as exc:
            raise AuthenticationFailed('Invalid token') from exc

        student_id = payload.get('sub')
        if not student_id:
            raise AuthenticationFailed('Invalid token payload')

        try:
            student = Student.objects.get(id=student_id)
        except Student.DoesNotExist as exc:
            raise AuthenticationFailed('User not found') from exc

        return (student, token)
