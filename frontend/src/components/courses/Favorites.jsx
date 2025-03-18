import { useEffect, useState } from "react";
import axios from "axios";
import "./favorites.css";

const Bookmarks = () => {
  const studentId = localStorage.getItem("studentId"); // Get logged-in user ID
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (studentId) {
      axios
        .get(`http://localhost:8080/get-bookmarked-courses?student_id=${studentId}`)
        .then((response) => {
          setFavorites(response.data);
        })
        .catch((error) => {
          console.error("Error fetching bookmarked courses:", error);
        });
    }
  }, [studentId]);

  const removeFromFavorites = (courseId) => {
    axios
      .delete("http://localhost:8080/remove-bookmark", {
        data: { student_id: studentId, course_id: courseId },
      })
      .then(() => {
        setFavorites(favorites.filter((course) => course.id !== courseId));
      })
      .catch((error) => {
        console.error("Error removing bookmark:", error);
      });
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
              <button className="remove-btn" onClick={() => removeFromFavorites(course.id)}>
                ❌ Remove
              </button>
            </div>
          ))
        ) : (
          <p>No bookmarked courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
