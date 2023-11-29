package Response

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)


type Body struct {
	Message string `json:"message"`
	Body interface{} `json:"body"`
}

func Send(response http.ResponseWriter, statuscode int,message string,body interface{}) {

	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})

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