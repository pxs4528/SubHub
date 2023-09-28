package oauth

import (
	authentication "backend/internal/Authentication"
	// jwt "backend/internal/login/JWT"
	"context"
	"encoding/json"
	"io"
	"net/http"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
)

func Callback(response http.ResponseWriter,request *http.Request, pool *pgxpool.Pool) {
	
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
	// desearlizing userData and getting specific value that are in struct user
	if err := json.Unmarshal(userData,&user); err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Json Unmarshal failed"))
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

	// JWTToken,err := jwt.Generate(user.ID)
	// if err != nil {
	// 	response.WriteHeader(http.StatusInternalServerError)
	// 	response.Write([]byte("Error Generating JWT Token"))
	// 	return
	// }
	
	if rows.Next() {
		// http.SetCookie(response,
		// 	&http.Cookie{
		// 		Name:"Token",
		// 		Value: JWTToken,
		// 		HttpOnly: true,
		// 		Secure: true,
		// 		SameSite: http.SameSiteStrictMode,
		// 	},
		// )
		http.Redirect(response,request,"/",http.StatusSeeOther)
		return

	} else {
		http.SetCookie(response,
			&http.Cookie{
				Name: "Name",
				Value: user.Name,
				Expires: time.Now().Add(time.Hour * 1),
			},
		)
		
		_,err = pool.Exec(context.Background(),`INSERT INTO public.users
											VALUES ($1,$2,$3,$4,$5);`,user.ID,user.Name,user.Email,user.Password,user.AuthType)
	
		if err != nil {
			http.Redirect(response,request,"/",http.StatusSeeOther)
			return
		}

	}
}