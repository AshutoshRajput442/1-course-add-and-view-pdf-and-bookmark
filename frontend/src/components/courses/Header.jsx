import { useNavigate } from "react-router-dom";
import "./header.css";
// import Favorites from "./Favorites"

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h1>Course Management</h1>
      <div>
        <button className="header-btn" onClick={() => navigate("/favorites")}>
          ⭐ Show Bookmarks
        </button>
        <button className="header-btn" onClick={() => navigate("/courses")}>
          📚 Show Courses
        </button>
      </div>
    </header>
  );
};

export default Header;
