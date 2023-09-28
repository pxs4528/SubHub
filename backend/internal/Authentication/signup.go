package authentication

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v4"
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
	ch := make(chan bool)
	go UserExist(user,pool,ch)

	user.ID = uuid.New().String()
	hpass,err := HashPassword(user.Password)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error hashing password"))
		return
	}
	user.Password = string(hpass)
	user.AuthType = "Regular"

	userExist := <- ch

	if !userExist {
		response.WriteHeader(http.StatusConflict)
		response.Write([]byte("User Already Exist"))
		return
	} else {
		_,_ = pool.Exec(context.Background(), `INSERT INTO public.users 
												VALUES ($1,$2,$3,$4,$5);`,user.ID,user.Name,user.Email,user.Password,user.AuthType)

		response.WriteHeader(http.StatusCreated)
	}

}

func UserExist(user UserData, pool *pgxpool.Pool, ch chan bool){
	var exists int
	err := pool.QueryRow(context.Background(), `SELECT * 
												FROM public.users
												WHERE email = $1;`,user.Email).Scan(&exists)
	ch <- err == pgx.ErrNoRows
}

func HashPassword(password string) ([]byte,error){
	hpass,err := bcrypt.GenerateFromPassword([]byte(password),bcrypt.DefaultCost)
	return hpass,err
}