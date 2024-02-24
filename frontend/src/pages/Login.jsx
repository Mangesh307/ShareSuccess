import axios from "axios";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "../context/userContext";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const Login = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleInputController = (e) => {
    setUserData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const { setCurrentUser } = useContext(UserContext);

  const loginHandler = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(`${SERVER_URL}/users/login`, userData);
      if (!data) {
        toast.error("Login failed. Please try again... ");
      }
      setCurrentUser(data);
      toast.success(`${data?.name} logged in  successfully`);
      navigate("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <section className="login">
      <div className="container">
        <h2>Sign In</h2>
        <form className="form login_form" onSubmit={loginHandler}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={handleInputController}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={handleInputController}
          />

          <button type="submit" className="btn primary">
            SignIn
          </button>
        </form>
        <small>
          Don&apos;t have an account ? <Link to="/register">Sign Up</Link>
        </small>
      </div>
    </section>
  );
};

export default Login;
