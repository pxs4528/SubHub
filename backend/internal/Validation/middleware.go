package validation

import (

	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)


func JWT(cookieToken string) (string,int,error){

	token,err := jwt.ParseWithClaims(cookieToken,&Claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("Secret")),nil
	})
	if err != nil {
		return "",http.StatusUnauthorized,err
	}

	if !token.Valid {
		return "",http.StatusUnauthorized,nil
	}

	claims,ok := token.Claims.(*Claims)
	if !ok {
		return "",http.StatusUnauthorized,nil
	}

	expTime, err := token.Claims.GetExpirationTime()
	if err != nil {
		return "",http.StatusInternalServerError,err
	}

	if expTime.Unix() < time.Now().Unix() {
		return "",http.StatusUnauthorized,nil
	}

	return claims.ID,http.StatusAccepted,nil
}

