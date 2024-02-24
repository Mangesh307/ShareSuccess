import { useContext, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";
import Loader from "../components/Loader";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const DeletePost = ({ postId: id }) => {
  //redirect for not logged in
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/");
    }
  }, []);

  const [isLoading, setisLoading] = useState(false);

  const deletePost = async (id) => {
    setisLoading(true);
    try {
      const response = await axios.delete(`${SERVER_URL}/posts/${id}`, {
        withCredentials: true,
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });

      if (response.status == 200) {
        toast.success("Post deleted successfully");
        if (location.pathname == `/myposts/${currentUser?.token}`) {
          navigate(0);
        } else {
          navigate("/");
        }
      }
      setisLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <Link className="btn sm danger" onClick={() => deletePost(id)}>
      Delete
    </Link>
  );
};

export default DeletePost;
