package Response

import (
	"encoding/json"
	"net/http"
)


type Body struct {
	Message string `json:"message"`
	Body interface{} `json:"body"`
}

func Send(response http.ResponseWriter, statuscode int,message string,body interface{}) {
	response.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	response.Header().Set("Content-Type","application/json")
	responseBody := Body{
		Message: message,
		Body: body,
	}
	jsonBody,err := json.Marshal(responseBody)
	if err != nil{
		Send(response,http.StatusInternalServerError,err.Error(),nil)
	}
	response.WriteHeader(statuscode)
	response.Write(jsonBody)
}