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
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.forms.models import model_to_dict
from django.conf import settings
from django.http import HttpResponse
from os.path import exists
from faker import Faker
from django.db.models import F
from contents.models import *
from django.db import connection



class Page(View):
    
    @api_view(['GET'])
    def ping(request):
        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': None
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def home(request):
        
        results = []
        query = """
            SELECT
                a.id,
                a.title,
                a.slug,
                a.updated_at,
                a.description,
                u.first_name,
                u.last_name,
                ud.about_me,
                (
                SELECT 
                        GROUP_CONCAT(r.name SEPARATOR ',') AS r 
                        FROM `references` r
                        WHERE r.id IN (
                            SELECT reference_id
                            FROM articles_references
                            WHERE article_id = a.id
                        )
                ) as categories
            FROM
                articles a
            INNER JOIN auth_user u ON u.id = a.author_id
            INNER JOIN auth_user_details ud ON ud.user_id = u.id
            WHERE
                status = 1
            ORDER BY RAND()
            LIMIT 3
        """
        with connection.cursor() as cursor:
            cursor.execute(query)
            desc = cursor.description
            results = [
                dict(zip([col[0] for col in desc], row)) 
                for row in cursor.fetchall() 
            ] 
 
        
        fake = Faker()
        data = {
            'header': {
                'title':fake.paragraph(nb_sentences=2),
                'description':fake.paragraph(nb_sentences=10)
            },
            'sliders': Slider.objects.filter(status=1).order_by("sort").values(),
            'services': Service.objects.filter(status=1).order_by("?")[:4].values(),
            'testimonial': Testimonial.objects.annotate(customer_name=F('customer__name')).filter(status=1).order_by("?").values().first(),
            'articles':results
        }
        
        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': data
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def about(request):
        
        fake = Faker()
        data = {
            'header': {
                'title':fake.paragraph(nb_sentences=2),
                'description':fake.paragraph(nb_sentences=10)
            },
            'section1': {
                'title':fake.paragraph(nb_sentences=2),
                'description':fake.paragraph(nb_sentences=10)
            },
            'section2': {
                'title':fake.paragraph(nb_sentences=2),
                'description':fake.paragraph(nb_sentences=10)
            },
            'teams': Team.objects.filter(status=1).order_by("sort").values(),
        }

        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': data
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def service(request):
        
        fake = Faker()
        data = {
            'header': {
                'title':fake.paragraph(nb_sentences=2),
                'description':fake.paragraph(nb_sentences=10)
            },
            'services': Service.objects.filter(status=1).order_by("?").values(),
            'customers': Customer.objects.filter(status=1).order_by("?").values(),
            'testimonials': Testimonial.objects.filter(status=1).order_by("?").values()
        }

        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': data
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def faq(request):

        fake = Faker()
        data = {
            'faq1': Faq.objects.filter(status=1).filter(sort__lte=5).order_by("?").values(),
            'faq2': Faq.objects.filter(status=1).filter(sort__gt=5).order_by("?").values()
        } 

        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': data
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def contact(request):
        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': {
                'services': Service.objects.filter(status=1).order_by("?")[:4].values()
            }
        }, status=status.HTTP_200_OK)
        
    @api_view(['POST'])
    def message(request):
        
        if "name" not in request.data:
            return Response({ 'status': False, 'message': "The field 'name' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "email" not in request.data:
            return Response({ 'status': False, 'message': "The field 'email' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "subject" not in request.data:
            return Response({ 'status': False, 'message': "The field 'subject' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        if "message" not in request.data:
            return Response({ 'status': False, 'message': "The field 'message' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        contact = Contact.objects.create(
           name = request.data["name"],
           email = request.data["email"],
           subject = request.data["subject"],
           message = request.data["message"],
           status = 0
        )
        contact.save()

        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': model_to_dict(contact)
        }, status=status.HTTP_200_OK)
        
    @api_view(['POST'])
    def subscribe(request):
        
        if "email" not in request.data:
            return Response({ 'status': False, 'message': "The field 'email' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': None
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def download(request, path):

        path_upload = settings.DJANGO_UPLOAD_PATH
        file_path = str(path_upload)+"/"+str(path)

        file_exists = exists(file_path)
        if(file_exists == False):
            return Response({ 'status': False, 'message': "File not found in directory!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        image_data  = open(file_path, 'rb').read()
        return HttpResponse(image_data, content_type="image/png")