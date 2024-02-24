import { Link } from "react-router-dom";
import PostAuthor from "./PostAuthor";
const APP_ASSETS_URL = import.meta.env.VITE_APP_ASSETS_URL;

const PostItem = (props) => {
  const {
    postID,
    thumbnail,
    category,
    title,
    description,
    authorID,
    createdAt,
  } = props;
  const shortdescription =
    description?.length > 145
      ? description?.substr(0, 100) + "..."
      : description;
  const shortTitle = title?.length > 25 ? title?.substr(0, 25) + "..." : title;

  return (
    <article className="post">
      <div className="post__thumbnail">
        <img src={`${APP_ASSETS_URL}/uploads/${thumbnail}`} alt={title} />
      </div>
      <div className="post__content">
        <Link to={`/posts/${postID}`}>
          <h3>{shortTitle}</h3>
        </Link>
        <p dangerouslySetInnerHTML={{ __html: shortdescription }} />
        <div className="post__footer">
          <PostAuthor authorID={authorID} createdAt={createdAt} />
          <Link to={`/posts/categories/${category}`} className="btn category">
            {category}
          </Link>
        </div>
      </div>
    </article>
  );
};

export default PostItem;
