import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
// import "./userBookmark.css";

const UserBookmark = () => {
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const studentId = localStorage.getItem("student_id"); // Get logged-in user ID

  useEffect(() => {
    if (studentId) {
      fetchBookmarkedCourses();
    }
  }, [studentId]);

  // ✅ Fetch bookmarked courses for the logged-in user
  const fetchBookmarkedCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/get-bookmarked-courses?student_id=${studentId}`
      );

      console.log("📌 Bookmarked Courses Response:", response.data);

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("⚠️ Unexpected response format:", response.data);
        setBookmarkedCourses([]);
        return;
      }

      setBookmarkedCourses(response.data);
    } catch (error) {
      console.error("❌ Error fetching bookmarked courses:", error.response?.data || error.message);
      setBookmarkedCourses([]);
    }
  };

  return (
    <div className="user-bookmark-container">
      <Header />
      <h2>📌 Your Bookmarked Courses</h2>

      {bookmarkedCourses.length > 0 ? (
        <ul className="bookmark-list">
          {bookmarkedCourses.map((course) => (
            <li key={course.id} className="bookmark-item">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <span>Duration: {course.duration} hours</span>
              <img
                src={`http://localhost:8080/${course.image.replace(/\\/g, "/")}`}
                alt={course.title}
                className="course-image"
              />
              <a
                href={`http://localhost:8080/${course.pdf.replace(/\\/g, "/")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="pdf-link"
              >
                📄 View PDF
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bookmarked courses yet.</p>
      )}
    </div>
  );
};

export default UserBookmark;
