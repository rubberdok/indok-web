from factory.django import DjangoModelFactory
import factory, factory.django
from faker import Faker
from apps.blogs.models import BlogPost
from utils.testing.factories.users import UserFactory


fake: Faker = Faker(["no-NO"])


class BlogPostFactory(DjangoModelFactory):
    class Meta:
        model = BlogPost
    
    title = fake.company()
    text = fake.text()
    author = factory.SubFactory(UserFactory)
