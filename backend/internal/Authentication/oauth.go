package authentication

import (
	jwt "backend/internal/login/JWT"
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

	url := googleConfig.AuthCodeURL(os.Getenv("State"))

	http.Redirect(response,request,url,http.StatusSeeOther)
}


func GoogleCallback(response http.ResponseWriter, request *http.Request, pool *pgxpool.Pool) {
	//we are checking to see if "state" is in the query google returns
	state := request.URL.Query().Get("state")
	if state != os.Getenv("State") {
		response.Write([]byte("State doesn't exists"))
		response.WriteHeader(http.StatusConflict)
		return
	}


	code := request.URL.Query().Get("code")


	googleConfig := AuthConfig()
	if googleConfig == nil {
		response.Write([]byte("Error with google config"))
		response.WriteHeader(http.StatusInternalServerError)
	}

	// we will get the access token from google which we will need for getting data
	token,err := googleConfig.Exchange(context.Background(),code)
	if err != nil {
		response.Write([]byte("Error fetching token"))
		response.WriteHeader(http.StatusInternalServerError)
		return
	}

	// we will be getting user profile by using access token
	responseData,err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken)
	if err != nil {
		response.Write([]byte("User Data Fetch Failed"))
		response.WriteHeader(http.StatusInternalServerError)
		return
	}

	// reading what get request returned 
	userData,err := io.ReadAll(responseData.Body)
	if err != nil {
		response.Write([]byte("Json Parsing Failed"))
		response.WriteHeader(http.StatusBadRequest)
		return
	}


	var user UserData
	// desearlizing userData and getting specific value that are in struct user
	if err := json.Unmarshal(userData,&user); err != nil {
		response.Write([]byte("Json Unmarshal failed"))
		response.WriteHeader(http.StatusInternalServerError)
		return
	}
	user.ID = uuid.New().String()
	user.AuthType = "Google"

	rows,err := pool.Query(context.Background(),`SELECT *
												FROM public.users
												WHERE email = $1;`,user.Email)
												
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Query Error"))
		return
	}	

	jwt.Generate(response,request,user.Email)
	
	if rows.Next() {
		response.WriteHeader(http.StatusOK)
		return
	} else {

		_,err = pool.Exec(context.Background(),`INSERT INTO public.users
											VALUES ($1,$2,$3,$4,$5);`,user.ID,user.Name,user.Email,user.Password,user.AuthType)
	
		if err != nil {
			response.WriteHeader(http.StatusCreated)
			return
		}

	}
}