import { useParams } from "react-router-dom";
import Appbar from "../components/Appbar";
import { useBlog } from "../hooks/useBlog";
import Avatar from "../components/ui/Avatar";
import { BlogSkeleton } from "../components/BlogSkeleton";

const Blog = () => {
  const { id } = useParams();
  const { blog, loading } = useBlog({
    id: id || "",
  });

  if (loading) {
    return (
      <div>
        <Appbar />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
        <BlogSkeleton />
      </div>
    );
  }

  return (
    <div>
      <Appbar />
      <div className="grid grid-cols-12 pl-40 pt-12 max-w-screen-xl">
        <div className="col-span-8">
          <div className="text-5xl font-extrabold">{blog?.title}</div>
          <div className="text-slate-500 pt-2">Post on 2nd December 2023</div>
          <div className="pt-4">{blog?.content}</div>
        </div>
        <div className="col-span-4">
          <div className="text-slate-500 py-4">Author</div>

          <div className="flex">
            <div className="px-4">
              <Avatar authorChar={blog?.author.name || "anonymous"} />
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold">{blog?.author.name}</div>
              <div className="text-slate-500 py-2">
                This is the author for this blogpost
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
