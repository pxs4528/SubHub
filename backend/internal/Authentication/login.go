package authentication

import (
	"backend/internal/Response"
	validation "backend/internal/Validation"
	"encoding/json"
	"log"
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

	encryptedID := validation.Encrypt([]byte(user.ID))




	go validation.GenerateJWT(response,user.ID,getJwt)

	matchPassword := VerifyPassword([]byte(user.Password),[]byte(login.Password))

	token := <- getJwt
	if matchPassword {
		go validation.InsertCode(pool,code,user.ID)
		encryptedJWT := validation.Encrypt([]byte(token))
		go validation.Send(user.Email,user.Name,code)
		log.Printf("ID: %v",encryptedID)

		request.Header.Add("Authorization","Bearer"+encryptedJWT)
		Response.Send(response,http.StatusAccepted,"User logged in",encryptedID)
		return
	} else {
		Response.Send(response,http.StatusNotFound,"User not found",nil)
		return
	}
}