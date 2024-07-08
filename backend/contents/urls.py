from django.urls import path

from . import view_page
from . import view_auth
from . import view_account
from . import view_portfolio
from . import view_article

urlpatterns = [
    # Pages
    path('page/ping', view_page.Page.ping),
    path('page/home', view_page.Page.home),
    path('page/about', view_page.Page.about),
    path('page/service', view_page.Page.service),
    path('page/faq', view_page.Page.faq),
    path('page/contact', view_page.Page.contact),
    path('page/message', view_page.Page.message),
    path('page/subscribe', view_page.Page.subscribe),
    path('page/download/<str:path>', view_page.Page.download),
    # Portfolio
    path('portfolio/list', view_portfolio.Portfolio.list),
    path('portfolio/detail/<str:id>', view_portfolio.Portfolio.detail),
    # Article
    path('article/list', view_article.Article.list),
    path('article/detail/<str:slug>', view_article.Article.detail),
    path('article/comment/list/<str:id>', view_article.Article.comment_list),
    path('article/comment/create/<str:id>', view_article.Article.comment_create),
    # Auth
    path('auth/register', view_auth.Auth.register),
    path('auth/confirm/<str:token>', view_auth.Auth.confirm),
    path('auth/email/forgot', view_auth.Auth.forgot_password),
    path('auth/email/reset/<str:token>', view_auth.Auth.reset_password),
    # Account
    path('account/profile/detail', view_account.Account.profile_detail),
    path('account/profile/update', view_account.Account.profile_update),
    path('account/password', view_account.Account.password_update),
    path('account/upload', view_account.Account.upload)
]