import { Link } from "react-router-dom";
import logo from "/logo.png";
import { FaBars } from "react-icons/fa";
import { AiOutlineClose } from "react-icons/ai";
import { useContext, useState } from "react";
import { UserContext } from "../context/userContext";

const Header = () => {
  const [isNavShow, setIsNavShow] = useState(
    window.innerWidth > 800 ? true : false
  );

  const closeNavHandle = () => {
    window.innerWidth < 800 ? setIsNavShow(false) : setIsNavShow(true);
  };

  const { currentUser } = useContext(UserContext);

  return (
    <nav>
      <div className="container nav__container">
        <Link to="/" className="nav__logo" onClick={closeNavHandle}>
          <img src={logo} alt="logo" />
        </Link>
        {currentUser?.id && isNavShow && (
          <ul className="nav__menu">
            <li>
              <Link to={`/profile/${currentUser?.id}`} onClick={closeNavHandle}>
                {currentUser?.name}
              </Link>
            </li>
            <li>
              <Link to="/create" onClick={closeNavHandle}>
                Add Experience
              </Link>
            </li>
            <li>
              <Link to="/authors" onClick={closeNavHandle}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={closeNavHandle}>
                Logout
              </Link>
            </li>
          </ul>
        )}
        {!currentUser?.id && isNavShow && (
          <ul className="nav__menu">
            <li>
              <Link to="/authors" onClick={closeNavHandle}>
                Authors
              </Link>
            </li>
            <li>
              <Link to="/login" onClick={closeNavHandle}>
                Login
              </Link>
            </li>
          </ul>
        )}

        <button
          className="nav__toggle-btn"
          onClick={() => setIsNavShow(!isNavShow)}
        >
          {isNavShow ? <AiOutlineClose /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
};

export default Header;
