import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

interface BlogInterface {
  title: string;
  content: string;
  id: number;
  author: {
    name: string;
  };
}

export const useBlog = ({
  id,
  initialData,
}: {
  id: string;
  initialData?: BlogInterface;
}) => {
  const [loading, setLoading] = useState(!initialData);
  const [blog, setBlog] = useState<BlogInterface | undefined>(initialData);

  useEffect(() => {
    if (!initialData) {
      axios
        .get(`${BACKEND_URL}/api/v1/blog/${id}`, {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        })
        .then((res) => {
          setBlog(res.data);
          setLoading(false);
        });
    }
  }, [id, initialData]);

  return {
    blog,
    loading,
  };
};
