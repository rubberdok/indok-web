import json

from utils.testing.factories.users import IndokUserFactory
from utils.testing.factories.blogs import BlogPostFactory
from utils.testing.ExtendedGraphQLTestCase import ExtendedGraphQLTestCase
from utils.testing.factories.users import IndokUserFactory


class BlogPostBaseTestCase(ExtendedGraphQLTestCase):
    def setUp(self) -> None:
        super().setUp()

        self.blog_post_one = BlogPostFactory()
        self.blog_post_two = BlogPostFactory()

        self.indok_user = IndokUserFactory()

        return super().setUp()


class BlogPostResolverTestCase(BlogPostBaseTestCase):
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
        data = json.loads(response.content)["data"]
        listings = data["allBlogPosts"]
        self.assertEqual(
            len(listings),
            2,
            f"Expected 2 blog posts, but only got {len(listings)}",
            )

    def test_resolve_blog_post(self):
        query = f"""
            query {{
                blogPost(blogPostId: {self.blog_post_one.id}) {{
                    id
                    author
                    publishDate
                    title
                    text
                }}
            }}
        """




class BlogPostMutationTestCase(BlogPostBaseTestCase):
    pass