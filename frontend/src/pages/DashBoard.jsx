import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import DeletePost from "./DeletePost";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const APP_ASSETS_URL = import.meta.env.VITE_APP_ASSETS_URL;

const DashBoard = () => {
  //redirect for not logged in
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/");
    }
  }, []);

  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    const fetchPosts = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/posts/users/${id}`, {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        });
        setPosts(data);
        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchPosts();
  }, [currentUser?.token, id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="dashboard">
      {posts.length ? (
        <div className="container dashboard_container">
          {posts.map((post) => {
            return (
              <article key={post._id} className="dashboard__post">
                <div className="dashboard__post-info">
                  <div className="dashboard__post-thumbnail">
                    <img
                      src={`${APP_ASSETS_URL}/uploads/${post?.thumbnail}`}
                      alt={`${post?.title}`}
                    />
                  </div>
                  <h5>{post.title}</h5>
                </div>
                <div className="dashboard__post-actions">
                  <Link to={`/posts/${post._id}`} className="btn sm">
                    View
                  </Link>
                  <Link
                    to={`/posts/${post._id}/edit`}
                    className=" primary btn sm"
                  >
                    Edit
                  </Link>
                  <DeletePost postId={post?._id} />
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <h2 className="center">You have no posts yet</h2>
      )}
    </section>
  );
};

export default DashBoard;
