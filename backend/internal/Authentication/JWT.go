package authentication

import (

	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)

func (uh *UserHandler) GenerateJWT() (string,error){

	uh.JWT = &JWT{
		ID: uh.User.ID,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: &jwt.NumericDate{Time: time.Now().Add(1 * time.Hour)},
		},
	}
	token := jwt.NewWithClaims(jwt.SigningMethodHS256,uh.JWT)
	
	tokenString, err := token.SignedString([]byte(os.Getenv("Secret")))
	if err != nil {
		
		return "",err
	}
	return tokenString,nil
}

/*
func JWT(headerToken string) (string,int,error){

	token,err := jwt.ParseWithClaims(headerToken,&Claims{}, func(t *jwt.Token) (interface{}, error) {
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
*/


func (uh *UserHandler) ValidateJWT() {
	
}