// import { useEffect, useState } from "react";
// import axios from "axios";
// import Header from "./Header";
// import "./courselist.css";

// const CourseList = () => {
//   const [courses, setCourses] = useState([]);
//   const [favorites, setFavorites] = useState(() => {
//     return JSON.parse(localStorage.getItem("favorites")) || [];
//   });

//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/get-courses")
//       .then((response) => {
//         setCourses(response.data);
//       })
//       .catch((error) => {
//         console.error("Error fetching courses:", error);
//       });
//   }, []);

//   const addToFavorites = (course) => {
//     if (!favorites.find((fav) => fav.id === course.id)) {
//       const updatedFavorites = [...favorites, course];
//       setFavorites(updatedFavorites);
//       localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
//     }
//   };

//   return (
//     <div className="course-container">
//       <Header /> {/* Using the new Header component */}

//       <div className="course-list">
//         <h2>Available Courses</h2>
//         <ul>
//           {courses.length > 0 ? (
//             courses.map((course) => {
//               const isFavorite = favorites.some((fav) => fav.id === course.id);
//               return (
//                 <li key={course.id} className="course-item">
//                   <h3>{course.title}</h3>
//                   <p>{course.description}</p>
//                   <span>Duration: {course.duration} hours</span>
//                   <img
//                     src={`http://localhost:8080/${course.image.replace(
//                       /\\/g,
//                       "/"
//                     )}`}
//                     alt={course.title}
//                     className="course-image"
//                   />
//                   <a
//                     href={`http://localhost:8080/${course.pdf.replace(
//                       /\\/g,
//                       "/"
//                     )}`}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="pdf-link"
//                   >
//                     📄 View PDF
//                   </a>

//                   {!isFavorite && (
//                     <button
//                       className="bookmark-btn"
//                       onClick={() => addToFavorites(course)}
//                     >
//                       ⭐ Add to Favorites
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



// dono code shi hai



import { useEffect, useState } from "react";
import axios from "axios";
import Header from "./Header";
import "./courselist.css";

const CourseList = () => {
  const [courses, setCourses] = useState([]);
  const userEmail = localStorage.getItem("userEmail"); // Get logged-in user email
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem(`favorites_${userEmail}`)) || [];
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/get-courses")
      .then((response) => {
        setCourses(response.data);
      })
      .catch((error) => {
        console.error("Error fetching courses:", error);
      });
  }, []);

  const addToFavorites = (course) => {
    if (!favorites.find((fav) => fav.id === course.id)) {
      const updatedFavorites = [...favorites, course];
      setFavorites(updatedFavorites);
      localStorage.setItem(`favorites_${userEmail}`, JSON.stringify(updatedFavorites));
    }
  };

  return (
    <div className="course-container">
      <Header />
      <div className="course-list">
        <h2>Available Courses</h2>
        <ul>
          {courses.length > 0 ? (
            courses.map((course) => {
              const isFavorite = favorites.some((fav) => fav.id === course.id);
              return (
                <li key={course.id} className="course-item">
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
                  {!isFavorite && (
                    <button className="bookmark-btn" onClick={() => addToFavorites(course)}>
                      ⭐ Add to Favorites
                    </button>
                  )}
                </li>
              );
            })
          ) : (
            <p>No courses available.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CourseList;
