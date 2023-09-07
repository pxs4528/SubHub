package main

import (
	"log"
	"net/http"
	"os"
)



func main() {
	// starting the server on localhost 8080
	err := http.ListenAndServe(":8080",nil)

	if err != nil{
		log.Fatal(err.Error())
		os.Exit(1)
	}

}


