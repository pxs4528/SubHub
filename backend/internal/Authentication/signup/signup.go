package signup

import (
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v4/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

type UserData struct {
	ID string `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
	Password string `json:"password"`
}

func SignUp(writer http.ResponseWriter,response *http.Request, pool *pgxpool.Pool) {
	// read data that was sent from response body
	userData,err := io.ReadAll(response.Body)
	if err != nil {
		writer.WriteHeader(http.StatusBadRequest)
		writer.Write([]byte("Json Parsing Failed"))
		return
	}

	// have a new uuid string
	id := uuid.New().String()

	var user UserData

	// deseralize userData and insert it in struct user
	if err := json.Unmarshal(userData,&user); err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte("Json Unmarshal failed"))
		return
	}

	password := user.Password

	// making a hash password using bcrypt
	hashPass, err := bcrypt.GenerateFromPassword([]byte(password),bcrypt.DefaultCost)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte("Error hashing password"))
		return
	}

	// check and see if user already exists in the db
	rows,err := pool.Query(context.Background(),`SELECT email 
												FROM public.users 
												WHERE email = $1`,user.Email)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte("Query Error"))
		return
	}

	if rows.Next() {
		writer.WriteHeader(http.StatusConflict)
		writer.Write([]byte("Email already exists"))
		return
	}

	// if user doesn't exist then we inset it into the database
	_,err = pool.Exec(context.Background(), `INSERT INTO public.users 
											VALUES ($1,$2,$3,$4)`,id,user.Email,user.Name,hashPass)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte("Query Error"))
		return
	}

	writer.WriteHeader(http.StatusCreated)
}