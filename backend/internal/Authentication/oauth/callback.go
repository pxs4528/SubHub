package oauth

import (
	authentication "backend/internal/Authentication"
	"backend/internal/Response"
	validation "backend/internal/Validation"
	"context"
	"encoding/json"

	"net/http"
	"net/url"
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
	
	userID := <- existUser
	
	if userID != "" {
		redirectURL,err := url.Parse("http://localhost:3000/")
		if err != nil {
			Response.Send(response,http.StatusInternalServerError,"Error getting the redirect url",nil)
			return
		}
		go validation.GenerateJWT(response,userID,genJwt)
		params := url.Values{}
		encriptedID := validation.Encrypt([]byte(userID))
		params.Add("auth",encriptedID)
		redirectURL.RawQuery = params.Encode()
		JWT := <- genJwt
		request.Header.Add("Authorization","Bearer"+JWT)
		http.Redirect(response,request,redirectURL.String(),http.StatusSeeOther)
		return

	} else {
		redirectURL,err := url.Parse("http://localhost:3000/")
		if err != nil {
			Response.Send(response,http.StatusInternalServerError,"Error getting the redirect url",nil)
			return
		}
		go validation.GenerateJWT(response,user.ID,genJwtNewID)
		go authentication.InsertUser(user,pool)
		params := url.Values{}
		encriptedID := validation.Encrypt([]byte(userID))
		params.Add("auth",encriptedID)
		redirectURL.RawQuery = params.Encode()
		JWT := <- genJwtNewID
		request.Header.Add("Authorization","Bearer"+JWT)
		http.Redirect(response,request,redirectURL.String(),http.StatusSeeOther)
		return
	}
}