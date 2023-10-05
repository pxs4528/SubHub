package oauth

import (
	authentication "backend/internal/Authentication"
	jwt "backend/internal/JWT"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
)

func Callback(response http.ResponseWriter,request *http.Request, pool *pgxpool.Pool) {
	response.Header().Set("Content-Type","application/json")

	//we are checking to see if "state" is in the query google returns
	state := request.URL.Query().Get("state")
	if state != os.Getenv("State") {
		response.WriteHeader(http.StatusConflict)
		response.Write([]byte("State doesn't exists"))
		return
	}

	code := request.URL.Query().Get("code")

	googleConfig := Config()
	if googleConfig == nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error with google config"))
		return
	}

	// we will get the access token from google which we will need for getting data
	token,err := googleConfig.Exchange(context.Background(),code)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error fetching token"))
		return
	}

	// we will be getting user profile by using access token
	responseData,err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("User Data Fetch Failed"))
		return
	}

	// reading what get request returned 
	userData,err := io.ReadAll(responseData.Body)
	if err != nil {
		response.WriteHeader(http.StatusBadRequest)
		response.Write([]byte("Json Parsing Failed"))
		return
	}


	var user authentication.UserData
	user.AuthType = "Google"
	
	existUser := make(chan string)
	genJwtNewID := make(chan []byte)
	genJwt := make(chan []byte)

	// desearlizing userData and getting specific value that are in struct user
	if err := json.Unmarshal(userData,&user); err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Json Unmarshal failed"))
		return
	}
	user.ID = uuid.New().String()
	go authentication.UserExist(user,pool,existUser)
	userExist := <- existUser
	if userExist != "" {
		go jwt.Generate(response,userExist,genJwt)
		JWT := <- genJwt
		response.WriteHeader(http.StatusAccepted)
		response.Write(JWT)
		return
		} else {
			go jwt.Generate(response,user.ID,genJwtNewID)
			err := authentication.InsertUser(user,pool)
			JWT := <- genJwtNewID
			if err != nil {
				response.WriteHeader(http.StatusInternalServerError)
				response.Write([]byte("Query Error"))
			return
		}
		response.WriteHeader(http.StatusCreated)
		response.Write(JWT)
	}
}