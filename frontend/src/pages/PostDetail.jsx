import PostAuthor from "../components/PostAuthor";
import { Link, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { UserContext } from "../context/userContext";
import DeletePost from "./DeletePost";
import Loader from "../components/Loader";
const APP_ASSETS_URL = import.meta.env.VITE_APP_ASSETS_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PostDetail = () => {
  const [postData, setPostData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useContext(UserContext);
  const { id } = useParams();

  useEffect(() => {
    const getPostDetail = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get(`${SERVER_URL}/posts/${id}`);
        if (data) {
          setIsLoading(false);
          setPostData(data);
        }
      } catch (error) {
        setError(error.response.data.message);
      }
    };
    getPostDetail();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="post-detail">
      {error && <p className="error">{error}</p>}
      {postData && (
        <div className="container post-detail__container">
          <div className="post-detail__header">
            <PostAuthor
              authorID={postData?.creator}
              createdAt={postData?.createdAt}
            />
            {currentUser?.id === postData?.creator && (
              <div className="post-detail__buttons">
                <Link to={`/posts/${id}/edit`} className="btn sm primary">
                  Edit
                </Link>
                <DeletePost postId={id} />
              </div>
            )}
          </div>
          <h1>{postData?.title}</h1>
          <div className="post-detail__thumbnail">
            <img
              src={`${APP_ASSETS_URL}/uploads/${postData?.thumbnail}`}
              alt=""
            />
          </div>
          <p dangerouslySetInnerHTML={{ __html: postData?.description }}></p>
        </div>
      )}
    </section>
  );
};

export default PostDetail;
