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
from contents.models import Portfolio as PortfolioModel
from contents.models import PortfolioImage  as PortfolioImageModel
from django.db.models import F

class Portfolio(View):
    
    @api_view(['GET'])
    def list(request):
        portfolios = PortfolioModel.objects.annotate(category_name=F('reference__name'), customer_name=F('customer__name')).filter(status=1).order_by("sort").values()
        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': { 'portfolios': portfolios }
        }, status=status.HTTP_200_OK)
        
    @api_view(['GET'])
    def detail(request, id):
        
        portfolio = PortfolioModel.objects.annotate(category_name=F('reference__name'), customer_name=F('customer__name')).filter(pk=id).values().first()
        images = PortfolioImageModel.objects.filter(portfolio_id=id).order_by("id").values()

        if portfolio == None:
            return Response({ 'status': False, 'message': "We can't find a record with that id is invalid.!", 'data': None }, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({ 
            'status': True, 
            'message': 'ok', 
            'data': {
                'portfolio': portfolio,
                'images': images
            }
        }, status=status.HTTP_200_OK)
    