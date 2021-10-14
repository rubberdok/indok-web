from factory.django import DjangoModelFactory
import factory, factory.django
from faker import Faker
from apps.blogs.models import Blog, BlogPost
from utils.testing.factories.users import UserFactory
from utils.testing.factories.organizations import OrganizationFactory


fake: Faker = Faker(["no-NO"])


class BlogFactory(DjangoModelFactory):
    class Meta:
        model = Blog

    name = fake.company()
    description = fake.paragraph(nb_sentences=10)
    organization = factory.SubFactory(OrganizationFactory)

class BlogPostFactory(DjangoModelFactory):
    class Meta:
        model = BlogPost
    
    title = fake.company()
    text = fake.text()
    author = factory.SubFactory(UserFactory)
