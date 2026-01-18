package main

import (
	"database/sql"
	"log"

	"github.com/gin-gonic/gin"
	_ "github.com/lib/pq"

	"pravoai/backend/internal/modules/auth"
)

func main() {
	db, err := sql.Open("postgres", "postgres://pravo:pravo@postgres:5432/pravoai?sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}

	repo := auth.NewRepository(db)
	handler := auth.NewHandler(repo)

	r := gin.Default()
	r.POST("/register", handler.Register)
	r.POST("/login", handler.Login)

	if err := r.Run(":8080"); err != nil {
		log.Fatal(err)
	}
}
