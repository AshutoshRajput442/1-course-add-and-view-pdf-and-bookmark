package handlers

import (
	"backend/config"
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Upload directory
const uploadDir = "uploads/"

// AddCourse handles course creation
func AddCourse(c *gin.Context) {
	// Ensure upload directory exists
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}

	// Get Form Data
	title := c.PostForm("title")
	description := c.PostForm("description")
	durationStr := c.PostForm("duration")

	// Debugging
	fmt.Println("📥 Received:", title, description, durationStr)

	// Convert duration to int
	duration, err := strconv.Atoi(durationStr)
	if err != nil {
		fmt.Println("❌ Duration conversion error:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid duration"})
		return
	}

	// Handle Image Upload
	imagePathDB, err := saveUploadedFile(c, "image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Handle PDF Upload
	pdfPathDB, err := saveUploadedFile(c, "pdf")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Insert into Database
	query := "INSERT INTO courses (title, description, duration, image, pdf) VALUES (?, ?, ?, ?, ?)"
	result, err := config.DB.Exec(query, title, description, duration, imagePathDB, pdfPathDB)
	if err != nil {
		fmt.Println("❌ Database Insert Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to insert data"})
		return
	}

	// Confirm Insert
	rowsAffected, _ := result.RowsAffected()
	fmt.Println("✅ Course Added - Rows affected:", rowsAffected)

	c.JSON(http.StatusOK, gin.H{"message": "Course added successfully"})
}

// GetCourses retrieves all courses
func GetCourses(c *gin.Context) {
	// Define struct locally (no models folder)
	type Course struct {
		ID          int    `json:"id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		Duration    int    `json:"duration"`
		ImagePath   string `json:"image"`
		PDFPath     string `json:"pdf"`
	}

	query := "SELECT id, title, description, duration, image, pdf FROM courses"
	rows, err := config.DB.Query(query)
	if err != nil {
		fmt.Println("❌ Database Query Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch courses"})
		return
	}
	defer rows.Close()

	var courses []Course

	for rows.Next() {
		var course Course
		if err := rows.Scan(&course.ID, &course.Title, &course.Description, &course.Duration, &course.ImagePath, &course.PDFPath); err != nil {
			fmt.Println("❌ Data Scanning Error:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning data"})
			return
		}

		courses = append(courses, course)
	}

	if err := rows.Err(); err != nil {
		fmt.Println("❌ Rows Iteration Error:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error reading courses from database"})
		return
	}

	// Send response
	c.JSON(http.StatusOK, courses)
}

// saveUploadedFile handles file upload and saves it in the "uploads" folder
func saveUploadedFile(c *gin.Context, formKey string) (string, error) {
	file, header, err := c.Request.FormFile(formKey)
	if err != nil {
		return "", fmt.Errorf("%s upload failed", formKey)
	}
	defer file.Close()

	// Ensure the uploads folder exists
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}

	// Save file to uploads directory
	filePath := filepath.Join(uploadDir, header.Filename)
	outFile, err := os.Create(filePath)
	if err != nil {
		return "", fmt.Errorf("failed to save %s", formKey)
	}
	defer outFile.Close()

	io.Copy(outFile, file)

	// Return relative path for database storage
	return filePath, nil
}

// Ensure the uploads folder exists at startup
func init() {
	if _, err := os.Stat(uploadDir); os.IsNotExist(err) {
		os.Mkdir(uploadDir, os.ModePerm)
	}
}
