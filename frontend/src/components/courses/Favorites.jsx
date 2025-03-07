import { useEffect, useState } from "react";
import "./favorites.css";

const Bookmarks = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // Remove from Bookmarks
  const removeFromFavorites = (courseId) => {
    const updatedFavorites = favorites.filter((course) => course.id !== courseId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites)); // Update LocalStorage
  };

  return (
    <div className="bookmarks-container">
      <h2>Bookmarked Courses</h2>
      <div className="favorites-grid">
        {favorites.length > 0 ? (
          favorites.map((course) => (
            <div key={course.id} className="favorite-item">
              <h3>{course.title}</h3>
              <img
                src={`http://localhost:8080/${course.image.replace(/\\/g, "/")}`}
                alt={course.title}
                className="favorite-image"
              />
              <a
                href={`http://localhost:8080/${course.pdf.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-link"
              >
                📄 View PDF
              </a>
              {/* Remove Button */}
              <button className="remove-btn" onClick={() => removeFromFavorites(course.id)}>
                ❌ Remove
              </button>
            </div>
          ))
        ) : (
          <p>No favorite courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
