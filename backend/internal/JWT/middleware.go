package jwt

import (
	"encoding/json"
	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)


type token struct {
	Token string `json:"token"`
}

func Validate(response http.ResponseWriter,request *http.Request) {
	var jwtToken token
	err := json.NewDecoder(request.Body).Decode(&jwtToken)
	if err != nil {
		response.Write([]byte(err.Error()))
		return
	}
	token,_ := jwt.ParseWithClaims(jwtToken.Token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("Secret")), nil
	})
	if err != nil {
		response.WriteHeader(http.StatusUnauthorized)
		return
	}

	if !token.Valid {
		response.WriteHeader(http.StatusUnauthorized)
		return
	}

	claims,ok := token.Claims.(*Claims)
	if !ok {
		response.WriteHeader(http.StatusUnauthorized)
		return
	}

	id := claims.ID
	jsonID,err := json.Marshal(id)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		return
	}
	expTime, err := token.Claims.GetExpirationTime()
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		return
	}

	if expTime.Unix() < time.Now().Unix() {
		response.WriteHeader(http.StatusUnauthorized)
		return
	}

	response.WriteHeader(http.StatusAccepted)
	response.Write(jsonID)
}