import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import TimeAgo from "react-timeago";
import englishStrings from "react-timeago/lib/language-strings/en";
import buildFormatter from "react-timeago/lib/formatters/buildFormatter";

const formatter = buildFormatter(englishStrings);

const APP_ASSETS_URL = import.meta.env.VITE_APP_ASSETS_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const PostAuthor = ({ createdAt, authorID }) => {
  const [author, setAuthor] = useState("");

  useEffect(() => {
    const getAuthor = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/users/${authorID}`);
        if (data) {
          setAuthor(data);
        }
      } catch (error) {
        toast.error(error.response.data.message);
        console.log(error);
      }
    };
    getAuthor();
  }, []);

  return (
    <Link to={`/posts/users/${authorID}`} className="post__author">
      <div className="post__author-avatar">
        <img src={`${APP_ASSETS_URL}/uploads/${author?.avatar}`} alt="poster" />
      </div>
      <div className="post_author-details">
        <h5>By: {author?.name}</h5>
        <small>
          <TimeAgo date={new Date(createdAt)} formatter={formatter} />
        </small>
      </div>
    </Link>
  );
};

export default PostAuthor;
