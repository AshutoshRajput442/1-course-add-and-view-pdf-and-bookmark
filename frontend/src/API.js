import axios from "axios";

const API_URL = "http://localhost:8080"; // Ensure your Golang backend is running on this port

// Fetch all courses
export const fetchCourses = async () => {
  try {
    const response = await axios.get(`${API_URL}/courses`);
    console.log("✅ Courses fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Error fetching courses:", error.response?.data || error.message);
    throw error;
  }
};

// Add a new course
export const addCourse = async (formData) => {
  console.log("📤 Sending FormData:", formData); // Debugging
  try {
    const response = await axios.post(`${API_URL}/add-course`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("✅ Course added successfully:", response.data); // Debugging
    return response.data;
  } catch (error) {
    console.error("❌ Error adding course:", error.response?.data || error.message);
    throw error;
  }
};
