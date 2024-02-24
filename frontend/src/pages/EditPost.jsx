import { useContext, useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../context/userContext";
import toast from "react-hot-toast";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const EditPost = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Uncategorized");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  //redirect for not logged in
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/");
    }
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "List",
    "bullet",
    "link",
    "image",
    "underline",
    "indent",
    "strike",
    "blockquote",
  ];

  const POST_CATEGORIES = [
    "Uncategorized",
    "Computer",
    "Information_Technology",
    "Electronics_&_Telecommunication",
    "Electronics",
    "Mechanical",
    "Civil",
    "Chemical",
    "Design",
  ];

  const { id } = useParams();

  useEffect(() => {
    const getPost = async () => {
      try {
        const { data } = await axios.get(`${SERVER_URL}/posts/${id}`);
        if (data) {
          setTitle(data.title);
          setCategory(data.category);
          setDescription(data.description);
        }
      } catch (error) {
        toast.error(error.response.data.message);
      }
    };
    getPost();
  }, []);

  const editPost = async (e) => {
    e.preventDefault();
    const postData = new FormData();
    postData.set("title", title);
    postData.set("category", category);
    postData.set("thumbnail", thumbnail);
    postData.set("description", description);

    try {
      const response = await axios.patch(
        `${SERVER_URL}/posts/${id}`,
        postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        }
      );
      if (response.status == 200) {
        toast.success("Post edited successfully");
        return navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="create-post">
      <div className="container">
        <h2>Edit Post</h2>
        <form className="form create-post__form" onSubmit={editPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {POST_CATEGORIES.map((cat) => (
              <option key={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill
            theme="snow"
            modules={modules}
            formats={formats}
            value={description}
            onChange={setDescription}
            className="q1-editor"
          />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="png, jpg, jpeg"
          />
          <button type="submit" className="btn primary">
            Update
          </button>
        </form>
      </div>
    </section>
  );
};

export default EditPost;
