package authentication

import (
	jwt "backend/internal/JWT"
	twofa "backend/internal/twoFA"
	"encoding/json"
	"math/rand"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)

func Login(response http.ResponseWriter, request *http.Request,pool *pgxpool.Pool) {
	response.Header().Set("Content-Type","application/json")
	var login LoginData
	err := json.NewDecoder(request.Body).Decode(&login)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error Decoding Json"))
		return
	}
	getJwt := make(chan []byte)

	code := rand.Intn(999999-100000+1) + 100000
	
	user := GetUser(login,pool)
	
	go twofa.Send(user.Email,user.Name,code)
	if user.ID == "" {
		response.WriteHeader(http.StatusNotFound)
		return
	}
	go jwt.Generate(response,user.ID,getJwt)


	matchPassword := VerifyPassword([]byte(user.Password),[]byte(login.Password))
	token := <- getJwt
	if matchPassword {
		response.WriteHeader(http.StatusAccepted)
		response.Write(token)
		return
	} else {
		response.WriteHeader(http.StatusNotFound)
		return
	}
	
}