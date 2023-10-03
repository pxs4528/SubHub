package jwt

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt"
)


type Claims struct {
	ID string `json:"email"`
	jwt.StandardClaims
}

type JWTStruct struct {
	Token string `json:"token"`
}

func Generate(response http.ResponseWriter,ID string,ch chan []byte) {

	claims := &Claims{
		ID: ID,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: time.Now().Add(time.Hour * 1).Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claims)

	tokenString, err := token.SignedString([]byte(os.Getenv("Secret")))
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error generating JWT"))
		return
	}

	tokenJson,err := json.Marshal(&JWTStruct{Token: tokenString})
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		response.Write([]byte("Error Marshalling Json"))
		return
	}
	ch <- tokenJson

}





