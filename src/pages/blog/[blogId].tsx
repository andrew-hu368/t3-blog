import Link from "next/link";
import { useRouter } from "next/router";

import BlogPost from "../../components/BlogPost";
import Layout from "../../components/Layout";
import { trpc } from "../../utils/trpc";

const SingleBlogPost = () => {
  const router = useRouter();
  const { data, isLoading } = trpc.useQuery([
    "blog.byId",
    { id: router.query.blogId as string },
  ]);

  return (
    <Layout>
      <div>
        <Link href="/">
          <a>Go Back</a>
        </Link>
      </div>
      <div>
        {isLoading || !data ? <>Loading...</> : <BlogPost blog={data} />}
      </div>
    </Layout>
  );
};

export default SingleBlogPost;
