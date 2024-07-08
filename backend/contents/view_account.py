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
from django.views import View
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated 
from django.contrib.auth.hashers import check_password, make_password
from contents.models import UserDetail
from django.contrib.auth.models import User
from django.db.models import F
from django.conf import settings
from os.path import exists
import os
import uuid

class Account(View):
    
    @api_view(['GET'])
    @permission_classes([IsAuthenticated])
    def profile_detail(request):
        data = UserDetail.objects.annotate(
            first_name=F('user__first_name'), 
            last_name=F('user__last_name'), 
            username=F('user__username'), 
            email=F('user__email')    
        ).filter(user=request.user.id).values().first()
        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': data
        }, status=status.HTTP_200_OK)
        
    @api_view(['POST'])
    @permission_classes([IsAuthenticated])
    def profile_update(request):
        
        user_id = request.user.id
        user = User.objects.filter(id=user_id).first()
        user_detail = UserDetail.objects.filter(user=request.user.id).first()

        if "username" not in request.data:
            return Response({ 'status': False, 'message': "The field 'username' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "email" not in request.data:
            return Response({ 'status': False, 'message': "The field 'email' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        user_by_username = User.objects.filter(username=request.data["username"]).first() 
        user_by_email = User.objects.filter(email=request.data["email"]).first() 

        if user_by_username != None:
            if int(user_by_username.id) != int(user_id):
                return Response({ 'status': False, 'message': "The username has already been taken.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if user_by_email != None:
            if int(user_by_email.id) != int(user_id):
                return Response({ 'status': False, 'message': "The email address has already been taken.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        
        user.username = request.data["username"]
        user.email = request.data["email"]

        if "first_name" in request.data:
            user.first_name = request.data["first_name"]

        if "last_name" in request.data:
            user.last_name = request.data["last_name"]

        user.save()
        
        user_detail.gender = request.data["gender"]
        user_detail.country = request.data["country"]
        user_detail.address = request.data["address"]
        user_detail.about_me = request.data["about_me"]
        user_detail.save()
        
        data = UserDetail.objects.annotate(
            first_name=F('user__first_name'), 
            last_name=F('user__last_name'), 
            username=F('user__username'), 
            email=F('user__email')    
        ).filter(user=request.user.id).values().first()
        
        return Response({ 
            'status': True, 
            'message': 'Yor profile has been changed !!', 
            'data': data
        }, status=status.HTTP_200_OK)
        
    @api_view(['POST'])
    @permission_classes([IsAuthenticated])
    def password_update(request):
        
        user_id = request.user.id
        user = User.objects.filter(id=user_id).first()

        if "current_password" not in request.data:
            return Response({ 'status': False, 'message': "The field 'current_password' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "password" not in request.data:
            return Response({ 'status': False, 'message': "The field 'password' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "password_confirm" not in request.data:
            return Response({ 'status': False, 'message': "The field 'password_confirm' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        current_password = request.data["current_password"]
        password = request.data["password"]
        password_confirm = request.data["password_confirm"]

        if len(password) < 8:
            return Response({ 'status': False, 'message': "The password must be at least 8 characters.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if password != password_confirm:
            return Response({ 'status': False, 'message': "The password confirmation does not match.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        matchcheck = check_password(current_password, user.password)
        if matchcheck == False:
            return Response({ 'status': False, 'message': "Incorrect current password please try again !!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)


        user.password = make_password(password)
        user.save()

        return Response({ 
            'status': True, 
            'message': 'Your password has been reset!', 
            'data': None
        }, status=status.HTTP_200_OK)
        
        
    @api_view(['POST'])
    @permission_classes([IsAuthenticated])
    def upload(request):
        
        user_detail = UserDetail.objects.filter(user=request.user.id).first()
        path_upload = settings.DJANGO_UPLOAD_PATH
        up_file = request.FILES['file']
        file_name = str(uuid.uuid4())+'-' + up_file.name
        destination = open(str(path_upload)+'/'+file_name, 'wb+')

        for chunk in up_file.chunks():
            destination.write(chunk)
        destination.close()  # File should be closed only after all chuns are added
        
        if user_detail.image != "":
            filePath = str(path_upload)+"/"+str(user_detail.image)
            file_exists = exists(filePath)
            if(file_exists):
                os.remove(filePath)
        
        if file_name != "":
            user_detail.image = file_name
            user_detail.save()

        return Response({ 
            'status': True, 
            'message': 'Your file has been uploded', 
            'data': file_name
        }, status=status.HTTP_200_OK)