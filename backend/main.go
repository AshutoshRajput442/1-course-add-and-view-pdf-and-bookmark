// package main

// import (
// 	"backend/config"
// 	"backend/handlers"

// 	"github.com/gin-contrib/cors"
// 	"github.com/gin-gonic/gin"
// )

// func main() {
// 	// Initialize Database
// 	config.ConnectDB()

// 	// Create a Gin router
// 	router := gin.Default()

// 	// Enable CORS for frontend (http://localhost:5173)
// 	// router.Use(cors.Default())

// 	router.Use(cors.New(cors.Config{
// 		AllowOrigins:     []string{"http://localhost:5173"},
// 		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
// 		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
// 		AllowCredentials: true,
// 	}))

// 	router.POST("/signup", handlers.Signup)
// 	router.POST("/login", handlers.Login)
// 	router.GET("/dashboard", handlers.AuthMiddleware(), handlers.Dashboard)

// 	// Serve uploaded files
// 	router.Static("/uploads", "./uploads")

// 	// API Routes
// 	router.POST("/add-course", handlers.AddCourse)
// 	router.GET("/get-courses", handlers.GetCourses)

// 	// Start the server
// 	router.Run(":8080")
// }

package main

import (
	"backend/config"
	"backend/handlers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Initialize Database
	config.ConnectDB()

	// Create a Gin router
	router := gin.Default()

	// Enable CORS for frontend (http://localhost:5173)
	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Authentication routes
	router.POST("/signup", handlers.Signup)
	router.POST("/login", handlers.Login)
	router.GET("/dashboard", handlers.AuthMiddleware(), handlers.Dashboard)

	// Serve uploaded files
	router.Static("/uploads", "./uploads")

	// Course routes
	router.POST("/add-course", handlers.AddCourse)
	router.GET("/get-courses", handlers.GetCourses)

	// Bookmark routes (Newly Added)
	router.POST("/add-to-bookmarks", handlers.AddToBookmarks)
	router.POST("/remove-from-bookmarks", handlers.RemoveFromBookmarks)
	router.GET("/get-bookmarked-courses", handlers.GetBookmarkedCourses)

	// Start the server
	router.Run(":8080")
}
