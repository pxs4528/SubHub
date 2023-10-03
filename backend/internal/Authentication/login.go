package authentication

import (
	jwt "backend/internal/JWT"
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
)

func Login(response http.ResponseWriter, request *http.Request, pool *pgxpool.Pool) {
	var user UserData
	err := json.NewDecoder(request.Body).Decode(&user)
	if err != nil {
		response.WriteHeader(http.StatusBadRequest)
		response.Write([]byte("Mission Json Data"))
		return
	}

	existUser := make(chan bool)

	genJwt := make(chan []byte)

	go UserExist(user,pool,existUser)

	go jwt.Generate(response,user.ID,genJwt)

	userExist := <- existUser
	JWT := <- genJwt

	if userExist {
		
	} else {
		response.WriteHeader(http.StatusNotFound)
		response.Write([]byte("User not found"))
	}
}