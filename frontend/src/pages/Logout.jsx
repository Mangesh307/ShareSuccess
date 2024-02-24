import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";

const Logout = () => {
  const navigate = useNavigate();
  //redirect for not logged in
  const { currentUser } = useContext(UserContext);

  useEffect(() => {
    if (!currentUser?.token) {
      navigate("/");
    }
  }, []);

  const { setCurrentUser } = useContext(UserContext);
  setCurrentUser(null);
  navigate("/login");
  return <div></div>;
};

export default Logout;
