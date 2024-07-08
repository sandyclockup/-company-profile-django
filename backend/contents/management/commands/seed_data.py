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

from django.core.management.base import BaseCommand
from django.utils import timezone
from contents.models import *
from django.contrib.auth.models import User
from faker import Faker
from slugify import slugify
import random
import uuid

class Command(BaseCommand):
    help = 'Seed Data'
    
    def handle(self, *args, **kwargs):
        time = timezone.now().strftime('%X')
        self.stdout.write("Begining seed data at .. %s" % time)
        self.create_user()
        self.create_reference()
        self.create_customer()
        self.create_faq()
        self.create_service()
        self.create_slider()
        self.create_team()
        self.create_testimonial()
        self.create_portfolio()
        self.create_article()
        self.stdout.write("Finising seed data at .. %s" % time)
        
    def create_user(self):
        total_rows = User.objects.count()
        if total_rows == 0:
            for i in range(10):
                
                gender_str = "M"
                gender = random.randint(1,2)
                fake = Faker()
                username = fake.user_name()
                email = fake.ascii_safe_email()
                password = "p4ssw0rd!"
                is_superuser = False
                first_name = fake.first_name_male()
                last_name = fake.last_name()

                if gender == 2:
                    gender_str = "F"
                    first_name = fake.first_name_female()
                    last_name = fake.last_name_female()

                is_staff = True
                is_active = True
                
                user = User.objects.create_user(
                    username = username,
                    email = email,
                    password = password,
                    is_superuser = is_superuser,
                    first_name = first_name,
                    last_name = last_name,
                    is_staff = is_staff,
                    is_active = is_active
                )
                user.save()
                
                userDetail = UserDetail.objects.create(
                    user = user,
                    gender = gender_str,
                    address = fake.street_address(),
                    about_me = fake.paragraph(nb_sentences=5),
                    country = fake.country(),
                    confirm_token = uuid.uuid4()
                )
                userDetail.save()
                
    def create_reference(self):
        total_rows = Reference.objects.count()
        if total_rows == 0:
            
            articles = [
                "Health and wellness",
                "Technology and gadgets",
                "Business and finance",
                "Travel and tourism",
                "Lifestyle and fashion"
            ]
            
            tags = [
                "Mental Health",
                "Fitness and Exercise",
                "Alternative Medicine",
                "Artificial Intelligence",
                "Network Security",
                "Cloud Computing",
                "Entrepreneurship",
                "Personal Finance",
                "Marketing and Branding",
                "Travel Tips and Tricks",
                "Cultural Experiences",
                "Destination Guides",
                "Beauty and Fashion Trends",
                "Celebrity News and Gossip",
                "Parenting and Family Life",
            ]
            
            portfolios = [
                "3D Modeling",
                "Web Application",
                "Mobile Application",
                "Illustrator Design",
                "UX Design"
            ]
            
            fake = Faker()
            
            for a in articles:
                ref_ar = Reference.objects.create(
                    slug = slugify(a),
                    name = a,
                    description = fake.paragraph(nb_sentences=5),
                    type = 1,
                    status= 1,
                )
                ref_ar.save()
                
            for t in tags:
                ref_tag = Reference.objects.create(
                    slug = slugify(t),
                    name = t,
                    description = fake.paragraph(nb_sentences=5),
                    type = 2,
                    status= 1,
                )
                ref_tag.save()
                
            for p in portfolios:
                ref_pp = Reference.objects.create(
                    slug = slugify(p),
                    name =p,
                    description = fake.paragraph(nb_sentences=5),
                    type = 3,
                    status= 1,
                )
                ref_pp.save()
                
    def create_customer(self):
        total_rows = Customer.objects.count()
        if total_rows == 0:
            for i in range(10):
                fake = Faker()
                sort = i + 1
                cs = Customer.objects.create(
                    image=("customer%s.jpg" % sort),
                    name=fake.name(),
                    email=fake.ascii_safe_email(),
                    phone=fake.phone_number(),
                    address=fake.street_address(),
                    sort=sort,
                    status=1
                )
                cs.save()
        
    def create_faq(self):
        total_rows = Faq.objects.count()
        if total_rows == 0:
            for i in range(10):
                fake = Faker()
                sort = i + 1
                faq = Faq.objects.create(
                    question= fake.paragraph(nb_sentences=1),
                    answer=fake.paragraph(nb_sentences=5),
                    status=1,
                    sort=sort
                )
                faq.save()
        
    def create_service(self):
        
        icons = [
            "bi bi-bicycle",
            "bi bi-bookmarks",
            "bi bi-box",
            "bi bi-building-add",
            "bi bi-calendar2-check",
            "bi bi-cart4",
            "bi bi-clipboard-data",
            "bi bi-gift",
            "bi bi-person-bounding-box",
        ]
        
        total_rows = Service.objects.count()
        if total_rows == 0:
            for index, icon in enumerate(icons):
                fake = Faker()
                sort = index + 1
                ss = Service.objects.create(
                    icon=icon,
                    title=fake.paragraph(nb_sentences=1),
                    description=fake.paragraph(nb_sentences=3),
                    sort=sort,
                    status=1
                )
                ss.save()    
            
                
    def create_slider(self):
        total_rows = Slider.objects.count()
        if total_rows == 0:
            for i in range(5):
                sort = i + 1
                fake = Faker()
                slider = Slider.objects.create(
                    image=("slider%s.jpg" % sort),
                    title=fake.paragraph(nb_sentences=2),
                    description=fake.paragraph(nb_sentences=4),
                    sort=sort,
                    status=1
                )
                slider.save()
        
    def create_team(self):
        total_rows = Team.objects.count()
        if total_rows == 0:
            for i in range(10):
                sort = i + 1
                fake = Faker()
                team = Team.objects.create(
                    image=("team%s.jpg" % sort),
                    name=fake.name(),
                    email=fake.ascii_safe_email(),
                    phone=fake.phone_number(),
                    address=fake.street_address(),
                    position_name=fake.job(),
                    twitter=fake.user_name(),
                    instagram=fake.user_name(),
                    linked_in=fake.user_name(),
                    facebook=fake.user_name(),
                    status=1,
                    sort=sort
                )
                team.save()
        
    def create_testimonial(self):
        total_rows = Testimonial.objects.count()
        if total_rows == 0:
            customers = Customer.objects.all()
            for index, customer in enumerate(customers):
                fake = Faker()
                sort = index + 1
                testimonial = Testimonial.objects.create(
                    image=("testimonial%s.jpg" % sort),
                    customer=customer,
                    name=fake.name(),
                    position=fake.job(),
                    quote=fake.paragraph(nb_sentences=4),
                    status=1,
                    sort=sort
                )
                testimonial.save()
        
    def create_portfolio(self):
        total_rows = Portfolio.objects.count()
        if total_rows == 0:
            for i in range(9):
                fake = Faker()
                sort = i + 1
                category = Reference.objects.filter(type = 3).order_by('?').first()
                customer = Customer.objects.order_by('?').first()
                portfolio = Portfolio.objects.create(
                    customer=customer,
                    reference=category,
                    title=fake.paragraph(nb_sentences=2),
                    description=fake.paragraph(nb_sentences=4),
                    project_date=fake.date_this_decade(),
                    project_url=fake.uri(),
                    status=1,
                    sort=sort
                )
                portfolio.save()
                
                for j in range(4):
                    
                    status = 0
                    if j == 0:
                        status = 1
                    
                    pg = PortfolioImage.objects.create(
                        portfolio=portfolio,
                        image=("testimonial%s.jpg" % sort),
                        status=status
                    )
                    pg.save()
                
                
        
    def create_article(self):
        total_rows = Article.objects.count()
        if total_rows == 0:
            users = User.objects.all()
            for index, user in enumerate(users):
                sort = index + 1
                fake = Faker()
                title = fake.paragraph(nb_sentences=2)
                slug = slugify(title)
                references = []
                categories = Reference.objects.filter(type = 1).order_by('?')[:3]
                tags = Reference.objects.filter(type = 2).order_by('?')[:5]
                
                for c in categories:
                    references.append(c)
                    
                for t in tags:
                    references.append(t)
                
                article = Article.objects.create(
                    image=("article%s.jpg" % sort),
                    author=user,
                    title=title,
                    slug=slug,
                    description = fake.paragraph(nb_sentences=5),
                    content=fake.paragraph(nb_sentences=10),
                    status=1
                )
                article.references.set(references)
                article.save()
                
                
                comments = User.objects.filter(is_active = 1).exclude(id = user.id).order_by('?')[:2]
                for comment in comments:
                    ac = ArticleComment.objects.create(
                        user=comment,
                        article=article,
                        comment=fake.paragraph(nb_sentences=6),
                        status=1
                    )
                    ac.save()