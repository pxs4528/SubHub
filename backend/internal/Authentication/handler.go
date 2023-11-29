package authentication

import (
	"github.com/golang-jwt/jwt/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type UserData struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
	AuthType string `json:"authtype"`
}

type LoginData struct {
	Email string `json:"email"`
	Password string `json:"password"`
}

type JWT struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}

type Code struct {
	Code int `json:"code"`
}

type UserID struct {
	ID string `json:"id"`
}

type UserHandler struct {
	User *UserData
	Login *LoginData
	JWT *JWT
	Code *Code
	UserID *UserID
	DB *pgxpool.Pool
}


