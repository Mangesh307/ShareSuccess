import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaCheck } from "react-icons/fa";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import axios from "axios";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;
const APP_ASSETS_URL = import.meta.env.VITE_APP_ASSETS_URL;

const Profile = () => {
  const [avatar, setAvatar] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [avatarTouched, setAvatarTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  //redirect for not logged in
  const navigate = useNavigate();
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    try {
      const getAvatar = async () => {
        const { data } = await axios.get(
          `${SERVER_URL}/users/${currentUser?.id}`,
          {
            withCredentials: true,
            headers: { Authorization: `Bearer ${currentUser?.id}` },
          }
        );
        if (data) {
          setAvatar(data?.avatar);
          setName(data?.name);
          setEmail(data?.email);
        }
      };
      getAvatar();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  }, [currentUser?.id]);

  const changeAvatarHandler = async () => {
    setAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set("avatar", avatar);
      const { data } = await axios.post(
        `${SERVER_URL}/users/change-avatar`,
        postData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        }
      );

      setAvatar(data?.avatar);
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  const updateProfileDataHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("email", email);
      formData.set("currentPassword", currentPassword);
      formData.set("newPassword", newPassword);
      formData.set("confirmNewPassword", confirmNewPassword);

      const response = await axios.patch(
        `${SERVER_URL}/users/edit-user`,
        formData,
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${currentUser?.token}` },
        }
      );
      if (response.status == 200) {
        toast.success("User profile data updated");
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <section className="profile">
      <div className="container profile__container">
        <Link to={`/myposts/${currentUser?.id}`} className="btn">
          My posts
        </Link>
        <div className="profile__details">
          <div className="avatar__wrapper">
            <div className="profile__avatar">
              <img src={`${APP_ASSETS_URL}/uploads/${avatar}`} alt="avatar" />
            </div>
            {/*  Form to update avatar */}
            <form className="avatar__form">
              <input
                type="file"
                name="avatar"
                id="avatar"
                accept="png,jpeg,jpg"
                onChange={(e) => setAvatar(e.target.files[0])}
              />

              <label htmlFor="avatar" onClick={() => setAvatarTouched(true)}>
                <FaEdit />
              </label>
            </form>
            {avatarTouched && (
              <button
                className="profile__avatar-btn"
                onClick={changeAvatarHandler}
              >
                <FaCheck />
              </button>
            )}
          </div>
          <h1>{currentUser?.name}</h1>

          {/* form to update user data */}

          <form
            className="form profile__form"
            onSubmit={updateProfileDataHandler}
          >
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button type="submit" className="btn primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Profile;
