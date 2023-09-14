package authentication

import (
	"context"
	"fmt"
	"io"
	"net/http"
)

func GoogleLogin(writer http.ResponseWriter, request *http.Request) {
	googleConfig := Config()

	url := googleConfig.AuthCodeURL("gsm")

	http.Redirect(writer,request,url,http.StatusSeeOther)
}

func GoogleCallback(writer http.ResponseWriter, request *http.Request) {
	state := request.URL.Query()["state"][0]
	
	if state != "gsm" {
		http.Error(writer,"State Doesn't Exist",http.StatusConflict)
		return
	}

	code := request.URL.Query()["code"][0]

	googleConfig := Config()

	token,err := googleConfig.Exchange(context.Background(),code)
	if err != nil {
		http.Error(writer,"Code-Token Exchange Failed",http.StatusInternalServerError)
		return
	}

	response,err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken)
	if err != nil {
		http.Error(writer,"User Data Fetch Failed",http.StatusInternalServerError)
		return
	}

	userData,err := io.ReadAll(response.Body)
	if err != nil {
		http.Error(writer,"Json Parsing Failed",http.StatusBadRequest)
	}

	fmt.Fprintln(writer,string(userData))

}