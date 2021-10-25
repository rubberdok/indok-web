import factory
import factory.django
from apps.blogs.models import Blog, BlogPost
from factory.django import DjangoModelFactory
from faker import Faker
from utils.testing.factories.users import UserFactory

fake: Faker = Faker(["no-NO"])


class BlogFactory(DjangoModelFactory):
    class Meta:
        model = Blog

    name = fake.company()
    description = fake.paragraph(nb_sentences=10)


class BlogPostFactory(DjangoModelFactory):
    class Meta:
        model = BlogPost

    title = fake.company()
    text = fake.text()
    author = factory.SubFactory(UserFactory)
