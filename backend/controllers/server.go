package controllers

import (
	"log"
	"net/http"
	"os"
)


func Server() {

	// starting the server on localhost 8080
	err := http.ListenAndServe(":8080",nil)

	if err != nil{
		log.Fatal(err.Error())
		os.Exit(1)
	}
	
}