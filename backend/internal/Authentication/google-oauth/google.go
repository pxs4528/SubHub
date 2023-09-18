package authentication

import (
	"backend/internal/Authentication/cookies"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
)

func GoogleLogin(writer http.ResponseWriter, request *http.Request) {
	googleConfig := Config()

	url := googleConfig.AuthCodeURL("gsm")

	http.Redirect(writer,request,url,http.StatusSeeOther)
}

type UserData struct {
	ID string `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
}

func GoogleCallback(writer http.ResponseWriter, request *http.Request, pool *pgxpool.Pool) {
	state := request.URL.Query()["state"][0]
	if state != "gsm" {
		writer.Write([]byte("State doesn't exists"))
		writer.WriteHeader(http.StatusConflict)
		return
	}

	code := request.URL.Query()["code"][0]

	googleConfig := Config()

	token,err := googleConfig.Exchange(context.Background(),code)
	if err != nil {
		writer.Write([]byte("Code-Token Exchange Failed"))
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	response,err := http.Get("https://www.googleapis.com/oauth2/v2/userinfo?access_token="+token.AccessToken)
	if err != nil {
		writer.Write([]byte("User Data Fetch Failed"))
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}

	userData,err := io.ReadAll(response.Body)
	if err != nil {
		writer.Write([]byte("Json Parsing Failed"))
		writer.WriteHeader(http.StatusBadRequest)
		return
	}

	var user UserData
	if err := json.Unmarshal(userData,&user); err != nil {
		writer.Write([]byte("Json Unmarshal failed"))
		writer.WriteHeader(http.StatusInternalServerError)
		return
	}
	
	cookies.GenCookie(writer,request,"ID",user.ID)
	cookies.GenCookie(writer,request,"Name",user.Name)

	writer.WriteHeader(http.StatusAccepted)
	writer.Write([]byte(user.Email))

}