package main

import (
	"backend/internal/database"
	"backend/internal/routes"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
)

func main() {

	// loads all the env from .env file that is in main folder
	envErr := godotenv.Load(".env")
	if envErr != nil {
		log.Fatalln("Error loading env")
	}

	// sets up connection pool which is in  database package in internal
	pool := database.Connect()

	//sets up http router in router package in internal
	router := routes.NewRouter(pool)

	fmt.Printf("\nStarting Server on http://localhost:8080\n\n")

	// starts the server on localhost:8080
	servErr := http.ListenAndServe("localhost:8080", router)

	//if server is closed or has an error, the program will stop executing
	if errors.Is(servErr, http.ErrServerClosed) {
		fmt.Fprintf(os.Stderr, "Server Closed: %v\n", servErr)
		os.Exit(1)
	} else if servErr != nil {
		fmt.Fprintf(os.Stderr, "Error Starting Server: %v", servErr)
		os.Exit(1)
	}
}
