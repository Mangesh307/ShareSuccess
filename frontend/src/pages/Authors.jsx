import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import Loader from "../components/Loader.jsx";
const APP_ASSETS_URL = import.meta.env.VITE_APP_ASSETS_URL;
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchAuthorProfiles = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/users`);
        setAuthors(data);

        setIsLoading(false);
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    fetchAuthorProfiles();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section>
      <div className="authors">
        {authors.length > 0 ? (
          <div className="container authors__container">
            {authors?.map((author) => (
              <Link
                to={`/posts/users/${author?._id}`}
                key={author?._id}
                className="author"
              >
                <div className="author__avatar">
                  <img
                    src={`${APP_ASSETS_URL}/uploads/${author?.avatar}`}
                    alt={`${author?.name}`}
                  />
                  <div className="avatarColor"></div>
                </div>
                <div className="author__info">
                  <h4>{author.name}</h4>
                  <p>{author.posts}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <h2 className="center">No users/authors found</h2>
        )}
      </div>
    </section>
  );
};

export default Authors;
