import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <ul className=" footer__categories">
      <li>
          <Link to="/posts/categories/Computer">Computer</Link>
        </li>
        <li>
          <Link to="/posts/categories/Information_Technology">Information Technology</Link>
        </li>
        <li>
          <Link to="/posts/categories/Electronics_&_Telecommunication">Electronics & Telecommunication</Link>
        </li>
        <li>
          <Link to="/posts/categories/Electronics">Electronics</Link>
        </li>
        <li>
          <Link to="/posts/categories/Mechanical">Mechanical</Link>
        </li>
        <li>
          <Link to="/posts/categories/Civil">Civil</Link>
        </li>
        <li>
          <Link to="/posts/categories/Chemical">Chemical</Link>
        </li>
        <li>
          <Link to="/posts/categories/Design">Design</Link>
        </li>
      </ul>

      <div className="footer__copyright">
        <small>All Rights Reserved &copy; Copyright, ShareSuccess LIMITED</small>
      </div>
    </footer>
  );
};

export default Footer;
