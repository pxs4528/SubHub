package authentication

import (
	
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func AuthConfig() *oauth2.Config{

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


func OauthLogin(response http.ResponseWriter, request *http.Request) {

	googleConfig := AuthConfig()

	url := googleConfig.AuthCodeURL("subhub")

	http.Redirect(response,request,url,http.StatusSeeOther)
}


func GoogleCallback(writer http.ResponseWriter, request *http.Request, pool *pgxpool.Pool) {
	//we are checking to see if "state" is in the query google returns
	state := request.URL.Query().Get("state")
	if state != "subhub" {
		writer.Write([]byte("State doesn't exists"))
		writer.WriteHeader(http.StatusConflict)
		return
	}


	code := request.URL.Query().Get("code")


	googleConfig := AuthConfig()
	if googleConfig == nil {
		writer.Write([]byte("Error with google config"))
		writer.WriteHeader(http.StatusInternalServerError)
	}

	// we will get the access token from google which we will need for getting data
	token,err := googleConfig.Exchange(context.Background(),code)
	if err != nil {
		writer.Write([]byte("Error fetching token"))
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	// we will be getting user profile by using access token
	responseData,err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken)
	if err != nil {
		writer.Write([]byte("User Data Fetch Failed"))
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	// reading what get request returned 
	userData,err := io.ReadAll(responseData.Body)
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
	user.ID = uuid.New().String()
	user.AuthType = "Google"

	_,err = pool.Exec(context.Background(),`INSERT INTO public.users
											VALUES ($1,$2,$3,$4,$5);`,user.ID,user.Name,user.Email,user.Password,user.AuthType)
	
	if err != nil {
		writer.WriteHeader(http.StatusOK)
		return
	}

	// if strings.Contains(err.Error(),"")
	writer.WriteHeader(http.StatusCreated)

	
}