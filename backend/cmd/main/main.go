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

	envErr := godotenv.Load(".env")
	if envErr != nil {
		log.Fatalln("Error loading env")
	}

	pool := database.Connect()

	router := routes.NewRouter(pool)

	fmt.Printf("\nStarting Server on http://localhost:8080\n\n")

	servErr := http.ListenAndServe("localhost:8080",router)

	if errors.Is(servErr,http.ErrServerClosed) {
		fmt.Fprintf(os.Stderr, "Server Closed: %v\n", servErr)
		os.Exit(1)
	} else if (servErr != nil) {
		fmt.Fprintf(os.Stderr,"Error Starting Server: %v",servErr)
		os.Exit(1)
	}
}