package authentication

import (
	"backend/internal/Response"
	"net/http"
	"os"
	"strings"
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




func (uh *UserHandler) ValidateJWT(response http.ResponseWriter,request *http.Request) {

	headerToken,headerError := GetJWTHeader(request)
	if headerError != "" {
		Response.Send(response,http.StatusUnauthorized,"User Not Authorized",nil)
		return
	}

	token,err := jwt.ParseWithClaims(headerToken,&JWT{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("Secret")),nil
	})
	if err != nil {
		Response.Send(response,http.StatusUnauthorized,"JWT Token Parsing Error",nil)
		return
	}

	if !token.Valid {
		Response.Send(response,http.StatusUnauthorized,"Unvalid User Token",nil)
		return
	}

	claims,ok := token.Claims.(*JWT)
	if !ok {
		Response.Send(response,http.StatusUnauthorized,"Error getting claims from JWT",nil)
		return
	}

	expTime, err := token.Claims.GetExpirationTime()
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting JWT expiration",nil)
		return
	}

	if expTime.Unix() < time.Now().Unix() {
		Response.Send(response,http.StatusUnauthorized,"JWT Token Expired",nil)
		return
	}

	id,headerError := GetAccess(response)
	if headerError != "" {
		Response.Send(response,http.StatusUnauthorized,"User not authorized",nil)
		return
	}

	if id != claims.ID {
		Response.Send(response,http.StatusUnauthorized,"ID doesn't match",nil)
		return
	}

	Response.Send(response,http.StatusOK,"User Validated",nil)

}

func GetJWTHeader(request *http.Request) (string,string){
	if authHeaderValue := request.Header.Get("Authorization"); authHeaderValue != "" {
		if strings.HasPrefix(authHeaderValue, "Bearer ") {
			// Remove the "Bearer " prefix
			token := authHeaderValue[len("Bearer "):]	
			return token,""
		}
	}
	return "","User not authorized"
}

func GetAccess(response http.ResponseWriter) (string,string) {
	if accessToken :=  response.Header().Get("Access"); accessToken != "" {
		token := accessToken[:]
		return token,""
	}
	return "","User not authorized"
}

// func GetAccess(request *http.Request) (string,string) {
// 	if accessToken := request.Header.Get("Access"); accessToken != "" {
// 		token := accessToken[:]
// 		return token, ""
// 	}
// 	return "","User not authorized"
// }