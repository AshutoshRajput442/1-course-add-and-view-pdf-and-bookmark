import { useEffect, useState } from "react";
import axios from "axios";
// import Header from "./Header";
import "./courselist.css";
import CourseForm from "./CourseForm";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const studentId = localStorage.getItem("student_id");

  useEffect(() => {
    fetchCourses();
    if (studentId) {
      fetchBookmarkedCourses();
    }
  }, [studentId]);
  // ✅ Fetch all courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:8080/get-courses");
      setCourses(response.data);
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
    }
  };

  // ✅ Fetch user's bookmarked courses
  const fetchBookmarkedCourses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/get-bookmarked-courses?student_id=${studentId}`
      );

      if (!response.data || !Array.isArray(response.data)) {
        console.warn("⚠️ Unexpected response format:", response.data);
        setBookmarkedCourses([]);
        return;
      }

      setBookmarkedCourses(response.data.map((course) => course.id));
    } catch (error) {
      console.error(
        "❌ Error fetching bookmarked courses:",
        error.response?.data || error.message
      );
      setBookmarkedCourses([]);
    }
  };

  // ✅ Add to Bookmark
  const addToBookmarks = async (courseId) => {
    if (!studentId) {
      alert("❌ Please log in to bookmark courses.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/add-to-bookmarks",
        {
          student_id: parseInt(studentId),
          course_id: courseId,
        }
      );

      if (response.status === 200) {
        setBookmarkedCourses([...bookmarkedCourses, courseId]);
      }
    } catch (error) {
      console.error(
        "❌ Error adding bookmark:",
        error.response?.data || error.message
      );
      alert("❌ Already bookmarked or an error occurred!");
    }
  };

  // ✅ Remove from Bookmark
  const removeFromBookmarks = async (courseId) => {
    if (!studentId) {
      alert("❌ Please log in to manage bookmarks.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/remove-from-bookmarks",
        {
          student_id: parseInt(studentId),
          course_id: courseId,
        }
      );

      if (response.status === 200) {
        setBookmarkedCourses(bookmarkedCourses.filter((id) => id !== courseId));
      }
    } catch (error) {
      console.error(
        "❌ Error removing bookmark:",
        error.response?.data || error.message
      );
      alert("❌ Failed to remove bookmark.");
    }
  };

  // ✅ Toggle between all courses and bookmarked courses
  const toggleShowBookmarks = () => {
    setShowBookmarks(!showBookmarks);
  };

  return (
    <div className="course-container">

      <CourseForm />
      {/* <Header /> */}

      <div className="course-list">
        <h2>{showBookmarks ? "Bookmarked Courses" : "Available Courses"}</h2>

        {/* ✅ Toggle Button */}
        <button className="toggle-btn" onClick={toggleShowBookmarks}>
          {showBookmarks ? "Show All Courses" : "Show Bookmarked"}
        </button>

        <ul>
          {(showBookmarks
            ? courses.filter((course) => bookmarkedCourses.includes(course.id))
            : courses
          ).length > 0 ? (
            (showBookmarks
              ? courses.filter((course) =>
                  bookmarkedCourses.includes(course.id)
                )
              : courses
            ).map((course) => {
              const isBookmarked = bookmarkedCourses.includes(course.id);
              return (
                <li key={course.id} className="course-item">
                  <h3>{course.title}</h3>
                  <p>{course.description}</p>
                  <span>Duration: {course.duration} hours</span>
                  <img
                    src={`http://localhost:8080/${course.image.replace(
                      /\\/g,
                      "/"
                    )}`}
                    alt={course.title}
                    className="course-image"
                  />
                  <a
                    href={`http://localhost:8080/${course.pdf.replace(
                      /\\/g,
                      "/"
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="pdf-link"
                  >
                    📄 View PDF
                  </a>

                  {/* ✅ Bookmark/Remove Button */}
                  {isBookmarked ? (
                    <button
                      className="remove-bookmark-btn"
                      onClick={() => removeFromBookmarks(course.id)}
                    >
                      ❌ Remove from Bookmark
                    </button>
                  ) : (
                    <button
                      className="bookmark-btn"
                      onClick={() => addToBookmarks(course.id)}
                    >
                      ⭐ Add to Bookmark
                    </button>
                  )}
                </li>
              );
            })
          ) : (
            <p>
              {showBookmarks
                ? "No bookmarked courses found."
                : "No courses available."}
            </p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CourseList;

// import { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "./Header";
// import "./courselist.css";

// const CourseList = () => {
//   const [courses, setCourses] = useState([]);
//   const [bookmarkedCourses, setBookmarkedCourses] = useState([]);
//   const studentId = localStorage.getItem("student_id");

//   useEffect(() => {
//     fetchCourses();
//     if (studentId) {
//       fetchBookmarkedCourses();
//     }
//   }, [studentId]);

//   const fetchCourses = async () => {
//     try {
//       const response = await axios.get("http://localhost:8080/get-courses");
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Error fetching courses:", error);
//     }
//   };

//   const fetchBookmarkedCourses = async () => {
//     try {
//       const response = await axios.get(
//         `http://localhost:8080/get-bookmarked-courses?student_id=${studentId}`
//       );
//       setBookmarkedCourses(response.data.map((course) => course.id));
//     } catch (error) {
//       console.error("Error fetching bookmarked courses:", error);
//     }
//   };

//   const addToBookmarks = async (courseId) => {
//     if (!studentId) {
//       alert("Please log in to bookmark courses.");
//       return;
//     }
//     try {
//       const response = await axios.post("http://localhost:8080/add-to-bookmarks", {
//         student_id: parseInt(studentId),
//         course_id: courseId,
//       });
//       if (response.status === 200) {
//         setBookmarkedCourses([...bookmarkedCourses, courseId]);
//       }
//     } catch (error) {
//       console.error("Error adding bookmark:", error);
//       alert("Already bookmarked or an error occurred!");
//     }
//   };

//   const removeFromBookmarks = async (courseId) => {
//     if (!studentId) {
//       alert("Please log in to manage bookmarks.");
//       return;
//     }
//     try {
//       const response = await axios.post("http://localhost:8080/remove-from-bookmarks", {
//         student_id: parseInt(studentId),
//         course_id: courseId,
//       });
//       if (response.status === 200) {
//         setBookmarkedCourses(bookmarkedCourses.filter((id) => id !== courseId));
//       }
//     } catch (error) {
//       console.error("Error removing bookmark:", error);
//       alert("Failed to remove bookmark.");
//     }
//   };

//   return (
//     <div className="course-container">
//       <Header />
//       <div className="course-list">
//         <h2>Available Courses</h2>
//         <ul>
//           {courses.length > 0 ? (
//             courses.map((course) => {
//               const isBookmarked = bookmarkedCourses.includes(course.id);
//               return (
//                 <li key={course.id} className="course-item">
//                   <h3>{course.title}</h3>
//                   <p>{course.description}</p>
//                   <span>Duration: {course.duration} hours</span>
//                   <img
//                     src={`http://localhost:8080/${course.image.replace(/\\/g, "/")}`}
//                     alt={course.title}
//                     className="course-image"
//                   />
//                   <a
//                     href={`http://localhost:8080/${course.pdf.replace(/\\/g, "/")}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="pdf-link"
//                   >
//                     📄 View PDF
//                   </a>
//                   {isBookmarked ? (
//                     <button className="remove-bookmark-btn" onClick={() => removeFromBookmarks(course.id)}>
//                       ❌ Remove from Bookmark
//                     </button>
//                   ) : (
//                     <button className="bookmark-btn" onClick={() => addToBookmarks(course.id)}>
//                       ⭐ Add to Bookmark
//                     </button>
//                   )}
//                 </li>
//               );
//             })
//           ) : (
//             <p>No courses available.</p>
//           )}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default CourseList;
