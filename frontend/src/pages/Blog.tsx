import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import Appbar from "../components/Appbar";
import { useBlog } from "../hooks/useBlog";
import Avatar from "../components/ui/Avatar";
import { BlogSkeleton } from "../components/BlogSkeleton";

interface BlogData {
  id: number;
  title: string;
  content: string;
  author: {
    name: string;
  };
}

interface BlogProps {
  initialData?: BlogData;
}

const Blog: React.FC<BlogProps> = ({ initialData }) => {
  const { id } = useParams();
  const { blog, loading } = useBlog({
    id: id || "",
    initialData,
  });

  if (loading && !initialData) {
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

  const data = initialData || blog;

  if (!data) {
    return (
      <div>
        <Appbar />
        <div className="text-center text-2xl mt-10">Blog post not found</div>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>{data.title}</title>
        <meta name="description" content={data.content.substring(0, 160)} />
        <meta property="og:title" content={data.title} />
        <meta
          property="og:description"
          content={data.content.substring(0, 160)}
        />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://yourdomain.com/blog/${id}`} />
        <meta
          property="og:image"
          content="https://yourdomain.com/default-image.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta property="article:author" content={data.author.name} />
      </Helmet>
      <Appbar />
      <div className="grid grid-cols-12 pl-40 pt-12 max-w-screen-xl">
        <div className="col-span-8">
          <h1 className="text-5xl font-extrabold">{data.title}</h1>

          <div className="pt-4">{data.content}</div>
        </div>
        <div className="col-span-4">
          <div className="text-slate-500 py-4">Author</div>
          <div className="flex">
            <div className="px-4">
              <Avatar authorChar={data.author.name[0] || "A"} />
            </div>
            <div className="flex flex-col">
              <div className="text-xl font-bold">{data.author.name}</div>
              <div className="text-slate-500 py-2">
                Author of this blog post
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
