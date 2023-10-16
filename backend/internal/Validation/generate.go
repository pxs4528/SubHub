package validation

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)


type Claims struct {
	ID string `json:"id"`
	jwt.RegisteredClaims
}

type JWTStruct struct {
	Token string `json:"token"`
}

func GenerateJWT(response http.ResponseWriter,ID string,ch chan []byte) {

	claims := &Claims{
		ID: ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(1 * time.Hour)},
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





