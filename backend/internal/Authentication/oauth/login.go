package oauth

import (
	"net/http"
	"os"
)


func Login(response http.ResponseWriter, request *http.Request) {
	googleConfig := Config()

	url := googleConfig.AuthCodeURL(os.Getenv("State"))

	http.Redirect(response,request,url,http.StatusSeeOther)
}