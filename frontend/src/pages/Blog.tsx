import { useParams } from "react-router-dom";
import Appbar from "../components/Appbar";
import BlogCard from "../components/BlogCard";
import { useBlog } from "../hooks/useBlog";

const Blog = () => {
  const { id } = useParams();
  const { blog, loading } = useBlog({
    id: id || "",
  });

  if (loading) {
    return <div>loading...</div>;
  }
  return (
    <div>
      <Appbar />
      <div className="flex justify-center">
        <div>hello</div>
      </div>
    </div>
  );
};

export default Blog;
