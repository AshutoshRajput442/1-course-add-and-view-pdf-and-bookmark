import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./loginSignup.css";

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle Login/Signup
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [studentId, setStudentId] = useState(localStorage.getItem("student_id") || null); // ✅ Persist Student ID
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? "http://localhost:8080/login" : "http://localhost:8080/signup";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("🔍 Backend Response:", data); // ✅ Debugging log

      if (response.ok) {
        setMessage(data.message || "Success!");

        if (isLogin) {
          // ✅ Ensure student_id exists before storing
          if (data.student_id) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("student_id", data.student_id);
            console.log("✅ Stored Student ID:", data.student_id);

            setStudentId(data.student_id); // ✅ Update state with student_id
          } else {
            console.error("❌ student_id is missing in backend response");
          }

          // Redirect to CourseForm
          navigate("/CourseForm");
        } else {
          setIsLogin(true); // Switch to login after signup
        }
      } else {
        setMessage(data.error || "Something went wrong");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" id="loginbutton">
          {isLogin ? "Login" : "Sign Up"}
        </button>
      </form>
      {message && <p className="message">{message}</p>}

      {/* ✅ Show student ID only if available */}
      {studentId && (
        <p className="student-id">Your Student ID: <strong>{studentId}</strong></p>
      )}

      <p onClick={() => setIsLogin(!isLogin)} className="toggle">
        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
      </p>
    </div>
  );
};

export default LoginSignup;
