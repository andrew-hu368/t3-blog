import type { NextPage } from "next";
import { memo, useState } from "react";
import BlogPost from "../components/BlogPost";
import Layout from "../components/Layout";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { isLoading, data } = trpc.useQuery(["blog.all"]);

  return (
    <Layout>
      <h1>My personal blog</h1>
      {isLoading ? (
        <div>Loading posts</div>
      ) : (
        data?.map((blog) => <BlogPost blog={blog} key={blog.id} />)
      )}
      <CreatePostSection />
    </Layout>
  );
};

export default Home;

const CreatePostSection = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const ctx = trpc.useContext();
  const createMutation = trpc.useMutation("blog.create");

  return (
    <div>
      {createMutation.isLoading}
      <h2>Create a new blog post</h2>
      <div>
        <input
          name="title"
          placeholder="Your title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          rows={10}
          cols={50}
          value={content}
          placeholder="Start typing..."
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div>
        <button
          onClick={() =>
            createMutation.mutate(
              { title, content },
              {
                onSuccess() {
                  ctx.invalidateQueries("blog.all");
                  setContent("");
                  setTitle("");
                },
              }
            )
          }
          disabled={createMutation.isLoading}
        >
          Create new post
        </button>
      </div>
    </div>
  );
};
