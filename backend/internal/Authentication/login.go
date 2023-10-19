package authentication

import (
	"backend/internal/Response"
	validation "backend/internal/Validation"
	"encoding/json"
	"math/rand"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Login(response http.ResponseWriter, request *http.Request,pool *pgxpool.Pool) {

	var login LoginData
	err := json.NewDecoder(request.Body).Decode(&login)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return
	}
	getJwt := make(chan string)
	code := rand.Intn(999999-100000+1) + 100000
	
	user := GetUser(login,pool)
	
	go validation.Send(user.Email,user.Name,code)
	if user.ID == "" {
		Response.Send(response,http.StatusNotFound,"User not found",nil)
		return
	}
	go validation.GenerateJWT(response,user.ID,getJwt)


	matchPassword := VerifyPassword([]byte(user.Password),[]byte(login.Password))
	token := <- getJwt
	if matchPassword {
		go validation.InsertCode(pool,code,user.ID)
		go validation.Send(user.Email,user.Name,code)

		tokenCookie := http.Cookie{
			Name: "token",
			Value: token,
			Path: "/",
			HttpOnly: true,
			Secure: true,
		}
		name := http.Cookie{
			Name: "name",
			Value: user.Name,
			Path: "/",
		}

		http.SetCookie(response,&tokenCookie)
		http.SetCookie(response,&name)
		
		Response.Send(response,http.StatusAccepted,"User logged in",nil)
		return
	} else {
		Response.Send(response,http.StatusNotFound,"User not found",nil)
		return
	}
	
}