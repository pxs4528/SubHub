package authentication

import (
	"backend/internal/Response"
	"context"
	"encoding/json"
	"net/http"
	"os"

	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func Config() *oauth2.Config{
	config := &oauth2.Config{
		// configuring google oauth, where clientID and clientSecret are in API keys
		ClientID: os.Getenv("ClientID"),
		ClientSecret: os.Getenv("ClientSecret"),
		// this is the link user will be redirected to after successful login
		RedirectURL: "http://localhost:8080/auth/google/callback",
		// we're requesting email and user profile from google after successfull login
		Scopes: []string {
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
	return config
}

func Login(response http.ResponseWriter, request *http.Request) {
	
	
	googleConfig := Config()

	url := googleConfig.AuthCodeURL(os.Getenv("State"))


	http.Redirect(response,request,url,http.StatusSeeOther)
}

func (uh *UserHandler) Callback(response http.ResponseWriter, request *http.Request){

	

	state := request.URL.Query().Get("state")
	if state != os.Getenv("State") {
		Response.Send(response,http.StatusConflict,"Incorrect URL",nil)
		return
	}

	googleCode := request.URL.Query().Get("code")

	googleConfig := Config()
	if googleConfig == nil {
		Response.Send(response,http.StatusInternalServerError,"Error occured with Google OAuth",nil)
		return
	}

	token,err := googleConfig.Exchange(context.Background(),googleCode)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error exchanging Google token",nil)
		return
	}

	responseData,err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting to Google OAuth",nil)
		return
	}

	err = json.NewDecoder(responseData.Body).Decode(&uh.User)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting the body from Google",nil)
		return
	}
	uh.User.AuthType = "Google"

	id := uh.ExistUser()
	if id != "" {
		uh.User.ID = id
		JWT,err := uh.GenerateJWT()
		if err != nil {
			Response.Send(response,http.StatusInternalServerError,"Error Generating Session",nil)
			return
		}

		http.SetCookie(response,SetHttpOnlyCookie("Token",JWT))
		http.SetCookie(response,SetRegularCookie("Access",uh.User.ID))
		http.SetCookie(response,SetHttpOnlyCookie("Validated","True"))

		http.Redirect(response,request,"http://localhost:3000/dashboard",http.StatusSeeOther)

		return
	} else {

		uh.User.ID = uuid.New().String()

		JWT,err := uh.GenerateJWT()
		if err != nil {
			Response.Send(response,http.StatusInternalServerError,"Error Generating Session",nil)
			return
		}

		go uh.InsertUser()

		http.SetCookie(response,SetHttpOnlyCookie("Token",JWT))
		http.SetCookie(response,SetRegularCookie("Access",uh.User.ID))
		http.SetCookie(response,SetHttpOnlyCookie("Validated","True"))

		http.Redirect(response,request,"http://localhost:3000/dashboard",http.StatusSeeOther)

		return

	}



}

