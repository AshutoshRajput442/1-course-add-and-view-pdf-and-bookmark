// import { useNavigate } from "react-router-dom";
// import "./header.css";

// const Header = () => {
//   const navigate = useNavigate();
  
//   return (
//     <header className="header">
//       <h1>Course Management</h1>
//       <div>
//         <button className="header-btn" onClick={() => navigate("/userBookmark")}>⭐ Show Bookmarks</button>
//         <button className="header-btn" onClick={() => navigate("/courses")}>📚 Show Courses</button>
//       </div>
//     </header>
//   );
// };

// export default Header;











// import { useNavigate } from "react-router-dom";
// import "./header.css";

// const Header = () => {
//   const navigate = useNavigate();

//   // Get student_id from localStorage (assuming it's stored after login)
//   const studentId = localStorage.getItem("student_id");
// console.log(studentId)
//   return (
//     <header className="header">
//       <h1>Course Management</h1>
//       <div>
//         {/* Ensure studentId is passed when navigating to bookmarked courses */}
//         <button
//           className="header-btn"
//           onClick={() => navigate(`/userBookmark?student_id=${studentId}`)}
//         >
//           ⭐ Show Bookmarks
//         </button>
//         <button className="header-btn" onClick={() => navigate("/courses")}>
//           📚 Show Courses
//         </button>
//       </div>
//     </header>
//   );
// };

// export default Header;
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./header.css";

const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem("student_id");
    console.log("📌 Student ID from localStorage:", studentId); // Debugging
  }, []);

  const studentId = localStorage.getItem("student_id");

  return (
    <header className="header">
      <h1>Course Management</h1>
      <div>
        <button
          className="header-btn"
          onClick={() => {
            if (studentId) {
              navigate(`/userBookmark?student_id=${studentId}`);
            } else {
              alert("Please log in first!");
            }
          }}
        >
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
