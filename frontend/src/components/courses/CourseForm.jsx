import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./Header";
import "./courseform.css";

const CourseForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    duration: "",
    image: null,
    pdf: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      await axios.post("http://localhost:8080/add-course", data);
      alert("Course added successfully");
      setFormData({
        title: "",
        description: "",
        duration: "",
        image: null,
        pdf: null,
      });
    } catch (error) {
      console.error("Error adding course:", error);
    }
  };

  return (
    <div>
      <Header /> {/* Using the new Header component */}

      <div className="course-form">
        <h2>Add Course</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          <input
            type="number"
            name="duration"
            placeholder="Duration (hours)"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
          />
          <input
            type="file"
            name="pdf"
            accept="application/pdf"
            onChange={handleFileChange}
            required
          />
          <button type="submit">Add Course</button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
