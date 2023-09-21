package authentication

import (
	"backend/internal/Authentication/cookies"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
)

type UserData struct {
	ID string `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
}

func GoogleLogin(writer http.ResponseWriter, request *http.Request) {
	// configure oauth
	googleConfig := Config()
	// configure the state for the auth link
	url := googleConfig.AuthCodeURL("gsm")
	// redirect user to callback
	http.Redirect(writer,request,url,http.StatusSeeOther)
}


func GoogleCallback(writer http.ResponseWriter, request *http.Request, pool *pgxpool.Pool) {
	//we are checking to see if "state" is in the query google returns
	state := request.URL.Query()["state"][0]
	if state != "gsm" {
		writer.Write([]byte("State doesn't exists"))
		writer.WriteHeader(http.StatusConflict)
		return
	}


	code := request.URL.Query()["code"][0]


	googleConfig := Config()

	// we will get the access token from google which we will need for getting data
	token,err := googleConfig.Exchange(context.Background(),code)
	if err != nil {
		writer.Write([]byte("Code-Token Exchange Failed"))
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	// we will be getting user profile by using access token
	response,err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken)
	if err != nil {
		writer.Write([]byte("User Data Fetch Failed"))
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	// reading what get request returned 
	userData,err := io.ReadAll(response.Body)
	if err != nil {
		writer.Write([]byte("Json Parsing Failed"))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}


	var user UserData
	// desearlizing userData and getting specific value that are in struct user
	if err := json.Unmarshal(userData,&user); err != nil {
		writer.Write([]byte("Json Unmarshal failed"))
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	// setting user name in cookies
	cookies.GenCookie(writer,request,"Name",user.Name)
	writer.WriteHeader(http.StatusAccepted)
	writer.Write([]byte(user.Email))
	
}