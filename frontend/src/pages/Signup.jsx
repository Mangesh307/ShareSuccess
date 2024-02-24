import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
const SERVER_URL = import.meta.env.VITE_SERVER_URL;



const Signup = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputController = (e) => {
    setUserData((prev) => {
      return {
        ...prev,
        [e.target.name]: e.target.value,
      };
    });
  };

  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${SERVER_URL}/users/register`,
        userData
      );
      const successMessage = data.split(" ")[1];
      toast.success(`${successMessage} registered successfully`);
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form className="form register_form" onSubmit={signupHandler}>
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={userData.name}
            onChange={handleInputController}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={userData.email}
            onChange={handleInputController}
          />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={userData.password}
            onChange={handleInputController}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={userData.confirmPassword}
            onChange={handleInputController}
          />
          <button type="submit" className="btn primary">
            Submit
          </button>
        </form>
        <small>
          Already have an account ? <Link to="/login">Sign In</Link>
        </small>
      </div>
    </section>
  );
};

export default Signup;
