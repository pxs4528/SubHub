package main

import (
	"backend/internal/database"
	"backend/internal/routes"
	"errors"
	"fmt"
	"net/http"
	"os"
)




func main() {
	pool := database.Connect()

	router := routes.NewRouter(pool)

	servErr := http.ListenAndServe("localhost:8080",router)

	if errors.Is(servErr,http.ErrServerClosed) {
		fmt.Fprintf(os.Stderr, "Server Closed: %v\n", servErr)
		os.Exit(1)
	} else if (servErr != nil) {
		fmt.Fprintf(os.Stderr,"Error Starting Server: %v",servErr)
		os.Exit(1)
	}
}