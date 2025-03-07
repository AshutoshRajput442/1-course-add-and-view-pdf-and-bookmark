import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CourseList from "./components/courses/CourseList";
import Favorites from "./components/courses/Favorites";
import LoginSignup from "./components/loginpage/LoginSignup";
import CourseForm from "./components/courses/CourseForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginSignup />} />
        <Route path="/CourseForm" element={<CourseForm />} />

        <Route path="/courses" element={<CourseList />} />
        <Route path="/favorites" element={<Favorites />} />
      </Routes>
    </Router>
  );
}

export default App;
