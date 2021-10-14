import json

from utils.testing.factories.users import UserFactory
from utils.testing.factories.blogs import BlogFactory, BlogPostFactory
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from guardian.shortcuts import assign_perm

from apps.blogs.models import Blog, BlogPost

class BlogBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()

        self.unauthorized_user = UserFactory()
        self.authorized_user = UserFactory()

        self.organization = OrganizationFactory()
        # assign_perm("blogs.add_blogpost", self.organization.primary_group.group)
        assign_perm("blogs.add_blogpost", self.authorized_user)
        MembershipFactory(user=self.authorized_user, organization=self.organization)

        self.blog_one = BlogFactory(organization=self.organization)
        self.blog_two = BlogFactory(organization=self.organization)

        self.blog_post_one = BlogPostFactory(blog=self.blog_one)
        self.blog_post_two = BlogPostFactory(blog=self.blog_one)

        return super().setUp()


class BlogResolverTestCase(BlogBaseTestCase):
    def setUp(self) -> None:
        return super().setUp()

    def test_resolve_blogs(self):
        query = """
                query {
                    allBlogs {
                        id
                        organization {
                            id
                            name
                            }
                        name
                        description
                        blogPost {
                            id
                            }
                    }
                }
                """
        response = self.query(query)
        self.assertResponseNoErrors(response)
        blogs = json.loads(response.content)["data"]["allBlogs"]
        self.assertEqual(len(blogs), 2, f"Expected 2 blos, but got {len(blogs)}",)

    def test_resolve_blog(self):
        # Test the field "blogPost", which is a list of blogposts connected
        # to the current blog, when "deep_assert_equal" is fixed. Ref issue #297
        # Also test that number of blogposts connected to the blog = 2 when fixed
        query = f"""
            query {{
                blog(blogId: {self.blog_one.id}) {{
                    id
                    name
                    description
                    organization {{
                        id
                        name
                    }}
                }}
            }}
        
        """

        response = self.query(query)
        self.assertResponseNoErrors(response)
        blog = json.loads(response.content)["data"]["blog"]
        self.deep_assert_equal(blog, self.blog_one)


class BlogPostResolverTestCase(BlogBaseTestCase):
    def setUp(self) -> None:
        return super().setUp()

    def test_resolve_blog_posts(self):
        """
        Expect to find 2 blog posts created in setup.
        """
        query = """
                query {
                    allBlogPosts {
                        id
                        author {
                            id
                        }
                        title
                        text
                    }
                }
                """
        response = self.query(query)
        self.assertResponseNoErrors(response)
        listings = json.loads(response.content)["data"]["allBlogPosts"]
        self.assertEqual(
            len(listings),
            2,
            f"Expected 2 blog posts, but got {len(listings)}",
        )

    def test_resolve_blog_post(self):
        query = f"""
            query {{
                blogPost(blogPostId: {self.blog_post_one.id}) {{
                    id
                    author {{
                        id
                        }}
                    publishDate
                    title
                    text
                }}
            }}
        """

        response = self.query(query)
        self.assertResponseNoErrors(response)
        blog_post = json.loads(response.content)["data"]["blogPost"]
        self.deep_assert_equal(blog_post, self.blog_post_one)


class BlogPostMutationTestCase(BlogBaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.title = "Title"
        self.text = "Text"
        self.create_mutation = f"""
            mutation {{
                createBlogPost(authorId: {self.authorized_user.id}, blogId: {self.blog_two.id}, title: "{self.title}", text: "{self.text}"){{
                    ok
                    blogPost{{
                        id
                        title
                        text
                        publishDate
                        author {{
                            id
                            username
                        }}
                        blog {{
                            id
                            name
                            organization {{
                                id
                                name
                            }}
                        }}
                    }}
                }}
            }}
        """

    def test_unauthorized_create_blog_post(self):
        response = self.query(self.create_mutation)
        self.assert_permission_error(response)
        response = self.query(self.create_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_authorized_create_blog_post(self):
        response = self.query(self.create_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        blog_post_data = json.loads(response.content)["data"]["createBlogPost"]["blogPost"]
        blog_post = BlogPost.objects.get(pk=blog_post_data["id"])
        self.deep_assert_equal(blog_post_data, blog_post)