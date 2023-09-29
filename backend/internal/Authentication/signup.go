package authentication

import (
	// jwt "backend/internal/login/JWT"
	jwt "backend/internal/login/JWT"
	"encoding/json"
	"net/http"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"

)

func NewSignUp(response http.ResponseWriter,request *http.Request, pool *pgxpool.Pool) {
	response.Header().Set("Content-Type","application/json")

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

	user.ID = uuid.New().String()
	hpass,err := HashPassword(user.Password)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error hashing password"))
		return
	}
	user.Password = string(hpass)
	user.AuthType = "Regular"

	userExist := <- existUser
	JWT := <- genJwt
	if !userExist {
		response.WriteHeader(http.StatusConflict)
		response.Write([]byte("User Already Exist"))
		return
	} else {
		err := InsertUser(user,pool)
		if err != nil {
			response.WriteHeader(http.StatusInternalServerError)
			response.Write([]byte("Query Error"))
			return
		}
	}
	response.WriteHeader(http.StatusCreated)
	response.Write(JWT)
}


