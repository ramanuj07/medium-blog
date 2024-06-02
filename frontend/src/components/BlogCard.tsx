import { Link } from "react-router-dom";
import Avatar from "./ui/Avatar";

interface BlogCardProps {
  id: number;
  authorName: string;
  title: string;
  content: string;
  publishedDate: string;
}

const BlogCard = ({
  id,
  authorName,
  publishedDate,
  title,
  content,
}: BlogCardProps) => {
  return (
    <Link to={`/blog/${id}`}>
      <div className="p-4 border-b border-slate-200 pb-4 w-screen max-w-screen-md cursor-pointer">
        <div className="flex gap-4 items-center">
          <Avatar authorChar={authorName} />
          <h4 className="font-extralight text-sm">{authorName}</h4>
          <h4 className="font-light text-slate-500 text-sm">{publishedDate}</h4>
        </div>
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <h2 className="text-md font-thin ">
            {content.slice(0, 100) + "..."}
          </h2>
        </div>

        <div className="text-sm text-slate-500">{`${Math.ceil(
          content.length / 100
        )} min read`}</div>
      </div>
    </Link>
  );
};

export default BlogCard;
