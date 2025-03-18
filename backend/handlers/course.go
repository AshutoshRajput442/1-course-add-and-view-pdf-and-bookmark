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

// BookmarkRequest represents the request body for adding/removing bookmarks
type BookmarkRequest struct {
	StudentID int `json:"student_id"`
	CourseID  int `json:"course_id"`
}

// AddToBookmarks adds a course to the user's bookmarks
func AddToBookmarks(c *gin.Context) {
	var req BookmarkRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing student_id or course_id"})
		return
	}

	query := "INSERT INTO bookmarkcourses (students_id, course_id) VALUES (?, ?)"
	_, err := config.DB.Exec(query, req.StudentID, req.CourseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to bookmark course"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Course added to bookmarks successfully"})
}

// RemoveFromBookmarks removes a course from the user's bookmarks
func RemoveFromBookmarks(c *gin.Context) {
	var req BookmarkRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing student_id or course_id"})
		return
	}

	query := "DELETE FROM bookmarkcourses WHERE students_id = ? AND course_id = ?"
	_, err := config.DB.Exec(query, req.StudentID, req.CourseID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove bookmark"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Course removed from bookmarks successfully"})
}

// GetBookmarkedCourses retrieves all bookmarked courses for a specific user

func GetBookmarkedCourses(c *gin.Context) {
	studentID := c.Query("student_id") // Get student_id from query parameter

	if studentID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Missing student_id parameter"})
		return
	}

	// Define a struct for response
	type Course struct {
		ID          int    `json:"id"`
		Title       string `json:"title"`
		Description string `json:"description"`
		Duration    int    `json:"duration"`
		ImagePath   string `json:"image"`
		PDFPath     string `json:"pdf"`
	}

	// SQL Query
	query := `
		SELECT c.id, c.title, c.description, c.duration, c.image, c.pdf 
FROM bookmarkcourses bc
JOIN courses c ON bc.course_id = c.id
WHERE bc.students_id = ?;
	`

	rows, err := config.DB.Query(query, studentID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch bookmarked courses"})
		return
	}
	defer rows.Close()

	var courses []Course
	for rows.Next() {
		var course Course
		if err := rows.Scan(&course.ID, &course.Title, &course.Description, &course.Duration, &course.ImagePath, &course.PDFPath); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Error scanning data"})
			return
		}
		courses = append(courses, course)
	}

	c.JSON(http.StatusOK, courses)
}
