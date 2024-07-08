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

from django.db import models
from django.contrib.auth.models import User # new

# Create your models here.
class Slider(models.Model):

    class Meta:
        db_table = "sliders"

    image = models.CharField(max_length=255, null=True, db_index=True)
    title = models.CharField(max_length=191, null=False, db_index=True)
    description = models.TextField(null=True)
    link = models.TextField(null=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    sort = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.title
    
class Service(models.Model):

    class Meta:
        db_table = "services"

    icon = models.CharField(max_length=191, null=True, db_index=True)
    title = models.CharField(max_length=191, null=False, db_index=True)
    description = models.TextField(null=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    sort = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.title
    
class Customer(models.Model):

    class Meta:
        db_table = "customers"

    image = models.CharField(max_length=255, null=True, db_index=True)
    name = models.CharField(max_length=191, null=False, db_index=True)
    email = models.CharField(max_length=191, null=False, db_index=True)
    phone = models.CharField(max_length=191, null=False, db_index=True)
    address = models.TextField(null=False)
    status = models.SmallIntegerField(default=0, db_index=True)
    sort = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.name
    
class Reference(models.Model):

    class Meta:
        db_table = "references"

    slug = models.CharField(max_length=191, null=False, db_index=True)
    name = models.CharField(max_length=191, null=False, db_index=True)
    description = models.TextField(null=True)
    type = models.IntegerField(default=0, db_index=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.name
    
class Article(models.Model):

    class Meta:
        db_table = "articles"

    references = models.ManyToManyField(Reference)
    image = models.CharField(max_length=191, null=False, db_index=True)
    author = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    title = models.CharField(max_length=255, null=False, db_index=True)
    description = models.TextField(null=True)
    slug = models.CharField(max_length=255, null=False, db_index=True)
    content = models.TextField(null=False)
    status = models.SmallIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.title
    
class ArticleComment(models.Model):
    class Meta:
        db_table = "articles_comments"

    parent = models.ForeignKey("self", on_delete=models.DO_NOTHING, null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    article = models.ForeignKey(Article, on_delete=models.DO_NOTHING)
    comment = models.TextField(null=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)
    
class Faq(models.Model):
    class Meta:
        db_table = "faqs"

    question = models.CharField(max_length=191, null=False, db_index=True)
    answer = models.TextField(null=False)
    status = models.SmallIntegerField(default=0, db_index=True)
    sort = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.question
    
class Team(models.Model):

    class Meta:
        db_table = "teams"

    image = models.CharField(max_length=255, null=True, db_index=True)
    name = models.CharField(max_length=191, null=False, db_index=True)
    email = models.CharField(max_length=191, null=False, db_index=True)
    phone = models.CharField(max_length=191, null=False, db_index=True)
    position_name = models.CharField(max_length=191, null=False, db_index=True)
    twitter = models.CharField(max_length=255, null=True, db_index=True)
    facebook = models.CharField(max_length=255, null=True, db_index=True)
    instagram = models.CharField(max_length=255, null=True, db_index=True)
    linked_in = models.CharField(max_length=255, null=True, db_index=True)
    address = models.TextField(null=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    sort = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.name
    
class Testimonial(models.Model):

    class Meta:
        db_table = "testimonials"

    image = models.CharField(max_length=255, null=True, db_index=True)
    customer = models.ForeignKey(Customer, on_delete=models.DO_NOTHING)
    name = models.CharField(max_length=191, null=False, db_index=True)
    position = models.CharField(max_length=191, null=False, db_index=True)
    quote = models.TextField(null=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    sort = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.name
    
class Contact(models.Model):

    class Meta:
        db_table = "contacts"

    name = models.CharField(max_length=191, null=False, db_index=True)
    email = models.CharField(max_length=191, null=True, db_index=True)
    subject = models.CharField(max_length=191, null=True, db_index=True)
    message = models.TextField(null=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.name
    
class Portfolio(models.Model):

    class Meta:
        db_table = "portfolios"

    customer = models.ForeignKey(Customer, on_delete=models.DO_NOTHING)
    reference = models.ForeignKey(Reference, on_delete=models.DO_NOTHING)
    title = models.CharField(max_length=191, null=False, db_index=True)
    description = models.TextField(null=True)
    project_date = models.DateField(null=True, db_index=True)
    project_url = models.TextField(null=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    sort = models.IntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.title

class PortfolioImage(models.Model):

    class Meta:
        db_table = "portfolios_images"

    portfolio = models.ForeignKey(Portfolio, on_delete=models.DO_NOTHING)
    image = models.CharField(max_length=191, null=False, db_index=True)
    status = models.SmallIntegerField(default=0, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.image
    
class UserDetail(models.Model):

    class Meta:
        db_table = "auth_user_details"

    user = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    image = models.CharField(max_length=255, null=True, db_index=True)
    gender = models.CharField(max_length=2, null=True, db_index=True)
    country = models.CharField(max_length=191, null=True, db_index=True)
    address = models.TextField(null=True)
    about_me = models.TextField(null=True)
    reset_token = models.CharField(max_length=191, null=True, db_index=True)
    confirm_token = models.CharField(max_length=191, null=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, null=True, db_index=True)

    # renames the instances of the model
    # with their title name
    def __str__(self):
        return self.token
    

    
