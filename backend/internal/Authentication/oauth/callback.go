package oauth

import (
	authentication "backend/internal/Authentication"
	"backend/internal/Response"
	validation "backend/internal/Validation"
	"context"
	"encoding/json"

	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Callback(response http.ResponseWriter,request *http.Request, pool *pgxpool.Pool) {

	//we are checking to see if "state" is in the query google returns
	state := request.URL.Query().Get("state")
	if state != os.Getenv("State") {
		Response.Send(response,http.StatusConflict,"Incorrect URL",nil)
		return
	}

	code := request.URL.Query().Get("code")

	googleConfig := Config()
	if googleConfig == nil {
		Response.Send(response,http.StatusInternalServerError,"Error occured with Google OAuth",nil)
		return
	}

	// we will get the access token from google which we will need for getting data
	token,err := googleConfig.Exchange(context.Background(),code)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return
	}

	// we will be getting user profile by using access token
	responseData,err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error occured with Google OAuth",nil)
		return
	}

	// reading what get request returned 
	var user authentication.UserData
	err = json.NewDecoder(responseData.Body).Decode(&user)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error occured with Google OAuth",nil)

		return
	}

	user.AuthType = "Google"
	
	existUser := make(chan string)

	genJwtNewID := make(chan string)

	genJwt := make(chan string)

	user.ID = uuid.New().String()

	go authentication.UserExist(user,pool,existUser)
	
	userExist := <- existUser
	
	if userExist != "" {
		go validation.GenerateJWT(response,userExist,genJwt)
		JWT := <- genJwt

		cookie := http.Cookie{
			Name: "token",
			Value: JWT,
			Path: "/",
			HttpOnly: true,
			Secure: true,
		}
		name := http.Cookie{
			Name: "name",
			Value: user.Name,
			Path: "/",
		}
		http.SetCookie(response,&cookie)
		http.SetCookie(response,&name)
		http.Redirect(response,request,"http://localhost:3000/",http.StatusSeeOther)
		return

	} else {

		go validation.GenerateJWT(response,user.ID,genJwtNewID)
		go authentication.InsertUser(user,pool)
		JWT := <- genJwtNewID
		cookie := http.Cookie{
			Name: "token",
			Value: JWT,
			Path: "/",
			HttpOnly: true,
			Secure: true,
		}
		name := http.Cookie{
			Name: "name",
			Value: user.Name,
			Path: "/",
		}
		http.SetCookie(response,&cookie)
		http.SetCookie(response,&name)
		http.Redirect(response,request,"http://localhost:3000/",http.StatusSeeOther)
		return
	}
}