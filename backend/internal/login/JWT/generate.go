package jwt

import (
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)


type Claims struct {
	ID string `json:"email"`
	jwt.StandardClaims
}

func Generate(ID string) (string,error){

	claims := &Claims{
		ID: ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 1).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	tokenString, err := token.SignedString([]byte(os.Getenv("Secret")))

	return tokenString,err

}





