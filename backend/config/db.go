package config

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/go-sql-driver/mysql"
)

var DB *sql.DB

func ConnectDB() {
	var err error
	dsn := "root:root@tcp(127.0.0.1:3306)/new_course_db"
	DB, err = sql.Open("mysql", dsn)
	if err != nil {
		log.Fatal("❌ Database Connection Failed:", err)
	}

	err = DB.Ping()
	if err != nil {
		log.Fatal("❌ Database Ping Failed:", err)
	}

	fmt.Println("✅ Connected to Database")
}
