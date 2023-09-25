package jwt

import (
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)


type Claims struct {
	Email string `json:"email"`
	jwt.StandardClaims
}

func Generate(response http.ResponseWriter, request *http.Request,userEmail string) {

	claims := &Claims{
		Email: userEmail,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 1).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	tokenString, err := token.SignedString([]byte(os.Getenv("Secret")))
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error Making JWT"))
		return
	}

	http.SetCookie(response,
		&http.Cookie{
			Name: "SessionID",
			Value: tokenString,
			Expires: time.Now().Add(time.Hour * 1),
		})

	response.WriteHeader(http.StatusCreated)

}





