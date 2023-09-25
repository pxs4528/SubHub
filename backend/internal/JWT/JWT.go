package JWT

import (
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
)

func Generate(id string) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"exp":        time.Now().Add(time.Hour * 24).Unix(),
		"user":       id,
		"authorized": true,
	})

	fmt.Println(token)
}
