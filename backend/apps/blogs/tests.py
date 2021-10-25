import json

from utils.testing.factories.users import UserFactory
from utils.testing.factories.blogs import BlogFactory, BlogPostFactory
from utils.testing.factories.organizations import MembershipFactory, OrganizationFactory
from utils.testing.base import ExtendedGraphQLTestCase
from guardian.shortcuts import assign_perm

from apps.blogs.models import Blog, BlogPost


class BlogBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()

        self.unauthorized_user = UserFactory()
        self.authorized_user = UserFactory()

        self.organization_one = OrganizationFactory()
        self.organization_two = OrganizationFactory()

        # Assign permissions to authorized test-user
        assign_perm("blogs.add_blog", self.authorized_user)
        assign_perm("blogs.change_blog", self.authorized_user)
        assign_perm("blogs.delete_blog", self.authorized_user)

        assign_perm("blogs.add_blogpost", self.authorized_user)
        assign_perm("blogs.change_blogpost", self.authorized_user)
        assign_perm("blogs.delete_blogpost", self.authorized_user)

        MembershipFactory(user=self.authorized_user, organization=self.organization_one)

        # Adds two blog instances to the test cases
        self.blog_one = BlogFactory(organization=self.organization_one)
        self.blog_two = BlogFactory(organization=self.organization_one)

        # Adds two blogpost instances to the test cases
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
        self.assertEqual(
            len(blogs), 2, f"Expected 2 blogposts, but got {len(blogs)}",
        )

    def test_resolve_blog(self):
        query = f"""
            query {{
                blog(blogId: {self.blog_one.id}) {{
                    id
                    name
                    description
                    blogPost {{
                        id
                    }}
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
        blog_posts = json.loads(response.content)["data"]["allBlogPosts"]
        self.assertEqual(
            len(blog_posts), 2, f"Expected 2 blog posts, but got {len(blog_posts)}",
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


class BlogMutationTestCase(BlogBaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.name = "Test blog"
        self.description = "Test description"

        self.create_mutation = f"""
        mutation {{
            createBlog(
                organizationId: {self.organization_one.id},
                name: "{self.name}",
                description: "{self.description}"
            ) {{
                ok
                blog {{
                    id
                    name
                    description
                    organization {{
                        id
                        name
                    }}

                }}
            }}
        }}
        """
        self.update_mutation = f"""
        mutation {{
            updateBlog(
                blogData: {{
                    id: {self.blog_one.id},
                    name: "{self.name}",
                    description: "{self.description}",
                    organizationId: {self.organization_two.id}
                }}
            ) {{
                ok
                blog {{
                    id
                    name
                    description
                    organization {{
                        id
                        name
                    }}
                }}
            }}

        }}
        """
        self.delete_mutation = f"""
        mutation {{
            deleteBlog(blogId: {self.blog_one.id}) {{
                ok
            }}
        }}
        """

    def test_unauthorized_create_blog(self):
        response = self.query(self.create_mutation)
        self.assert_permission_error(response)
        response = self.query(self.create_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_authorized_create_blog(self):
        response = self.query(self.create_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        blog_data = json.loads(response.content)["data"]["createBlog"]["blog"]
        blog = Blog.objects.get(pk=blog_data["id"])
        self.deep_assert_equal(blog_data, blog)

    def test_unauthorized_update_blog(self):
        response = self.query(self.update_mutation)
        self.assert_permission_error(response)
        response = self.query(self.update_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_authorized_update_blog(self):
        response = self.query(self.update_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        updated_blog = json.loads(response.content)["data"]["updateBlog"]["blog"]
        self.deep_assert_equal(updated_blog, Blog.objects.get(pk=self.blog_one.id))

    def test_unauthorized_delete_blog(self):
        response = self.query(self.delete_mutation)
        self.assert_permission_error(response)
        response = self.query(self.delete_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_authorized_delete_blog(self):
        response = self.query(self.delete_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        try:
            Blog.objects.get(pk=self.blog_one.id)
            self.fail("Expected the blog to be deleted, but it was not.")
        except Blog.DoesNotExist:
            pass

        # Tests that blog posts connected to the deleted blog are also deleted
        try:
            BlogPost.objects.get(pk=self.blog_post_one.id)
            BlogPost.objects.get(pk=self.blog_post_two.id)
            self.fail("Expected the blog posts in the deleted blog to also be deleted, but they were not.")
        except BlogPost.DoesNotExist:
            pass


class BlogPostMutationTestCase(BlogBaseTestCase):
    def setUp(self) -> None:
        super().setUp()
        self.title = "Title"
        self.text = "Text"
        self.create_mutation = f"""
            mutation {{
                createBlogPost(
                    authorId: {self.authorized_user.id},
                    blogId: {self.blog_two.id},
                    title: "{self.title}",
                    text: "{self.text}"
                ){{
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

        self.update_mutation = f"""
            mutation {{

                updateBlogPost(
                    blogPostData: {{
                        id: {self.blog_post_one.id},
                        blogId: {self.blog_two.id},
                        title: "{self.title}",
                        text: "{self.text}"
                    }}
                ) {{
                    ok
                    blogPost {{
                        id
                        blog {{
                            id
                            name
                            organization {{
                                id
                                name
                            }}
                        }}
                        title
                        text
                        publishDate
                        author {{
                            id
                            username
                        }}
                    }}
                }}
            }}

        """

        self.delete_mutation = f"""
            mutation {{
                deleteBlogPost(blogPostId: {self.blog_post_one.id}) {{
                    ok
                }}
            }}"""

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

    def test_unathorized_change_blog_post(self):
        response = self.query(self.update_mutation)
        self.assert_permission_error(response)
        response = self.query(self.update_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_authorized_change_blog_post(self):
        response = self.query(self.update_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        updated_blog_post = json.loads(response.content)["data"]["updateBlogPost"]["blogPost"]
        self.deep_assert_equal(updated_blog_post, BlogPost.objects.get(pk=self.blog_post_one.id))

    def test_unauthorized_delete_blog_post(self):
        response = self.query(self.delete_mutation)
        self.assert_permission_error(response)
        response = self.query(self.delete_mutation, user=self.unauthorized_user)
        self.assert_permission_error(response)

    def test_authorized_delete_blog_post(self):
        response = self.query(self.delete_mutation, user=self.authorized_user)
        self.assertResponseNoErrors(response)

        try:
            BlogPost.objects.get(pk=self.blog_post_one.id)
            self.fail("Expected the blog post to be deleted, but it was not.")
        except BlogPost.DoesNotExist:
            pass
