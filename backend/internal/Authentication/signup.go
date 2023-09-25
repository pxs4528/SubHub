package authentication

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	"golang.org/x/crypto/bcrypt"
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

	user.ID = uuid.New().String()
	hpass,err := hashPassword(user.Password)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error hashing password"))
		return
	}
	user.Password = string(hpass)
	user.AuthType = "Regular"
	
	_,err = pool.Exec(context.Background(), `INSERT INTO public.users 
											VALUES ($1,$2,$3,$4,$5);`,user.ID,user.Name,user.Email,user.Password,user.AuthType)
	if err != nil {
		response.WriteHeader(http.StatusConflict)
		response.Write([]byte("User Already Exist"))
		return
	}

	response.WriteHeader(http.StatusCreated)

}

func hashPassword(password string) ([]byte,error){
	hpass,err := bcrypt.GenerateFromPassword([]byte(password),bcrypt.DefaultCost)

	return hpass,err
}