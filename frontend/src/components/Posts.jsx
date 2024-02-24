import { useEffect, useState } from "react";
import PostItem from "./PostItem";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "./Loader.jsx";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/posts`);
        setPosts(data);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchPosts();
  }, []);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <section className="posts">
      {posts?.length > 0 ? (
        <div className="container posts__container">
          {posts?.map((post) => (
            <PostItem
              key={post._id}
              postID={post._id}
              thumbnail={post.thumbnail}
              category={post.category}
              title={post.title}
              description={post.description}
              authorID={post.creator}
              createdAt={post.createdAt}
            />
          ))}
        </div>
      ) : (
        <h2 className="center">No posts found</h2>
      )}
    </section>
  );
};

export default Posts;
