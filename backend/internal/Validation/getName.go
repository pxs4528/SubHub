package validation

import (
	"log"
	"net/http"
)


func GetName(response http.ResponseWriter,request *http.Request) {
	cookie,err := request.Cookie("token")
	if err != nil {
		log.Println(err)
		return
	}
	response.Write([]byte(cookie.Value))
}