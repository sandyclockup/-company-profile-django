"""
 * This file is part of the Sandy Andryanto Company Profile Website.
 *
 * @author     Sandy Andryanto <sandy.andryanto.dev@gmail.com>
 * @copyright  2024
 *
 * For the full copyright and license information,
 * please view the LICENSE.md file that was distributed
 * with this source code.
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from contents.models import UserDetail
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password 
from django.views import View
import uuid

class Auth(View):
    
    @api_view(['POST'])
    def register(request):
        
        if "username" not in request.data:
            return Response({ 'status': False, 'message': "The field 'username' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "email" not in request.data:
            return Response({ 'status': False, 'message': "The field 'email' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "password" not in request.data:
            return Response({ 'status': False, 'message': "The field 'password' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "password_confirm" not in request.data:
            return Response({ 'status': False, 'message': "The field 'password_confirm' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        username = request.data["username"]
        email = request.data["email"]
        password = request.data["password"]
        password_confirm = request.data["password_confirm"]

        if len(password) < 8:
            return Response({ 'status': False, 'message': "The password must be at least 8 characters.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if password != password_confirm:
            return Response({ 'status': False, 'message': "The password confirmation does not match.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)


        if User.objects.filter(username=username).exists():
            return Response({ 'status': False, 'message': "The username has already been taken.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(email=email).exists():
            return Response({ 'status': False, 'message': "The email address has already been taken.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        
        user = User.objects.create_user(
            username = username,
            email = email,
            password = password,
            is_superuser = False,       
            is_staff = True,
            is_active = True
        )
        user.save()
        
        token = str(uuid.uuid4())
        user_detail = UserDetail.objects.create(
            user = user,
            confirm_token = token
        )
        user_detail.save()
        
        return Response({ 
            'status': True, 
            'message': 'You need to confirm your account. We have sent you an activation code, please check your email.!', 
            'data': { 'token': token } 
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def confirm(request, token):
        
        user_token = UserDetail.objects.filter(confirm_token=token).first()

        if user_token == None:
            return Response({ 'status': False, 'message': "We can't find a user with that  token is invalid.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)


        user = user_token.user
        user.is_active = True
        user.save()

        return Response({ 
            'status': True, 
            'message': 'Your e-mail is verified. You can now login.', 
            'data': None
        }, status=status.HTTP_200_OK)
        
        
        
    @api_view(['POST'])
    def forgot_password(request):
        
        if "email" not in request.data:
            return Response({ 'status': False, 'message': "The field 'email' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)


        email = request.data["email"]
        user = User.objects.filter(email=email).first()

        if user == None:
            return Response({ 'status': False, 'message': "We can't find a user with that e-mail address.", 'data': None }, status=status.HTTP_400_BAD_REQUEST)


        token = str(uuid.uuid4())
        user_detail = UserDetail.objects.filter(user=user).first()
        user_detail.reset_token = token
        user_detail.save()
        
        return Response({ 
            'status': True, 
            'message': 'We have e-mailed your password reset link!', 
            'data': {
                'token': token
            }
        }, status=status.HTTP_200_OK)
        
    @api_view(['POST'])
    def reset_password(request, token):
        
        if "email" not in request.data:
            return Response({ 'status': False, 'message': "The field 'email' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "password" not in request.data:
            return Response({ 'status': False, 'message': "The field 'password' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "password_confirm" not in request.data:
            return Response({ 'status': False, 'message': "The field 'password_confirm' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        email = request.data["email"]
        password = request.data["password"]
        password_confirm = request.data["password_confirm"]

        if len(password) < 8:
            return Response({ 'status': False, 'message': "The password must be at least 8 characters.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if password != password_confirm:
            return Response({ 'status': False, 'message': "The password confirmation does not match.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.filter(email=email).first()
        
        if user == None:
            return Response({ 'status': False, 'message': "We can't find a user with that e-mail address.", 'data': None }, status=status.HTTP_400_BAD_REQUEST)
        
        user_detail = UserDetail.objects.filter(user=user).first()  

        if user_detail == None:
            return Response({ 'status': False, 'message': "We can't find a user with that e-mail address or password reset token is invalid.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        user.password = make_password(password)
        user.save()
               
        user_detail.reset_token = None
        user_detail.save()
        
        return Response({ 
            'status': True, 
            'message': 'Your password has been reset!', 
            'data': None
        }, status=status.HTTP_200_OK)