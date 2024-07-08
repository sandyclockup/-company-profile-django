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
from django.forms.models import model_to_dict
from contents.models import Article as ArticleModel
from contents.models import ArticleComment as ArticleCommentModel
from django.db import connection
from django.db.models import F

class CommentTree:
    
    def BuildTree(elements, parent_id):
        result = []
        for element in elements:
            if element["parent_id"] == parent_id:
                children = CommentTree.BuildTree(elements, element["id"])
                if len(children) > 0:
                    element["children"] = children
                else:
                    element["children"] = []
                result.append(element)
        return result

class Article(View):
    
    @api_view(['GET'])
    def list(request):
        
        page = int(request.query_params.get('page', 1))
        limit = 3 * page

        results = []
        query = """
            SELECT
                a.id,
                a.title,
                a.created_at,
                a.slug,
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
            ORDER BY a.id DESC
        """

        with connection.cursor() as cursor:
            cursor.execute(query)
            desc = cursor.description
            results = [
                dict(zip([col[0] for col in desc], row)) 
                for row in cursor.fetchall() 
            ] 

        total_stories = ArticleModel.objects.filter(status=1).count()

        data = {
            'continue': limit <= total_stories,
            'page': page,
            'new_article': results[0],
            'new_articles': [results[1], results[2], results[3]],
            'stories': results[:limit]
        }

        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': data
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def detail(request, slug):
        
        results = []
        query = """
            SELECT
                a.*,
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
                slug = '[SLUG]'
            ORDER BY a.id DESC
        """

        query = query.replace("[SLUG]", slug)
        with connection.cursor() as cursor:
            cursor.execute(query)
            desc = cursor.description
            results = [
                dict(zip([col[0] for col in desc], row)) 
                for row in cursor.fetchall() 
            ] 

        if []==results:
           return Response({ 'status': False, 'message': "We can't find a record with slug "+slug+" .!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': results[0]
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def comment_list(request, id):
        comments = ArticleCommentModel.objects.annotate(first_name=F('user__first_name'), last_name=F('user__last_name')).filter(article_id=id).order_by("-id").values()
        return Response({ 
            'status': True, 
            'message': 'ok', 
            'comments': CommentTree.BuildTree(comments, None)
        }, status=status.HTTP_200_OK)
        
    @api_view(['POST'])
    @permission_classes([IsAuthenticated])
    def comment_create(request, id):
        
        if "comment" not in request.data:
            return Response({ 'status': False, 'message': "The field 'comment' can not be empty!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        article = ArticleModel.objects.filter(pk=id).first()
        article_comment = ArticleCommentModel.objects.create(
            user = user,
            article= article,
            comment = request.data["comment"],
            status = 1
        )

        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': model_to_dict(article_comment)
        }, status=status.HTTP_200_OK)
    