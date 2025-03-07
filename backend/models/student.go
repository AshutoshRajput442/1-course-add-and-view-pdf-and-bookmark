package models

// Student struct represents the students table in MySQL
type Student struct {
	ID       int    `json:"id"`
	Email    string `json:"email"`
	Password string `json:"password"`
}
