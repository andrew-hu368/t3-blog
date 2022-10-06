import { useState } from "react";
import { type Blog } from "@prisma/client";
import Link from "next/link";
import { useRouter } from "next/router";

import { trpc } from "../utils/trpc";

const BlogPost = ({ blog }: { blog: Blog }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(blog.title);
  const [content, setContent] = useState(blog.content);
  const updatePost = trpc.useMutation("blog.updateById");
  const deletePost = trpc.useMutation("blog.deleteById");
  const ctx = trpc.useContext();
  const router = useRouter();

  const handleResetPost = () => {
    setTitle(blog.title);
    setContent(blog.content);
  };
  const invalidateBlog = (id: Blog["id"]) => {
    ctx.invalidateQueries(["blog.byId", { id }]);
    ctx.invalidateQueries(["blog.all"]);
  };

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={updatePost.isLoading || deletePost.isLoading}
          />
        </div>
      ) : (
        <Link href={`/blog/${blog.id}`}>
          <a>{blog.title}</a>
        </Link>
      )}

      <p>
        <small>{blog.createdAt.toDateString()}</small>
      </p>
      {isEditing ? (
        <div>
          <textarea
            rows={10}
            cols={50}
            value={content}
            placeholder="Start typing..."
            onChange={(e) => setContent(e.target.value)}
            disabled={updatePost.isLoading || deletePost.isLoading}
          />
        </div>
      ) : (
        <p>{blog.content}</p>
      )}
      <div>
        <button
          onClick={() => {
            setIsEditing((isEditing) => !isEditing);
            handleResetPost();
          }}
          disabled={updatePost.isLoading || deletePost.isLoading}
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>{" "}
        <button
          disabled={updatePost.isLoading || deletePost.isLoading}
          onClick={() =>
            deletePost.mutate(
              { id: blog.id },
              {
                onSuccess() {
                  invalidateBlog(blog.id);
                  router.replace("/");
                },
              }
            )
          }
        >
          Delete
        </button>{" "}
        {isEditing && (
          <button
            disabled={updatePost.isLoading || deletePost.isLoading}
            onClick={() =>
              updatePost.mutate(
                {
                  id: blog.id,
                  title,
                  content,
                },
                {
                  onSuccess() {
                    invalidateBlog(blog.id);
                    setIsEditing(false);
                  },
                }
              )
            }
          >
            Save
          </button>
        )}
      </div>
    </div>
  );
};

export default BlogPost;
