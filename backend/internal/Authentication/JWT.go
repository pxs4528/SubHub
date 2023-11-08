package authentication

import (
	"backend/internal/Response"
	"net/http"
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

func ValidateJWT(response http.ResponseWriter,request *http.Request) string{
	tokenCookie,err := getCookie(request,"Token")
	if err == http.ErrNoCookie {
		Response.Send(response,http.StatusUnauthorized,"User not logged in",nil)
		return ""
	} else if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error fetching the cookie",nil)
		return ""
	}

	token,err := jwt.ParseWithClaims(tokenCookie.Value,&JWT{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("Secret")),nil
	})
	if err != nil {
		Response.Send(response,http.StatusUnauthorized,`Session expired / Invalid token`,nil)
		return ""
	}

	if !token.Valid {
		Response.Send(response,http.StatusUnauthorized,"Unvalid User Token",nil)
		return ""
	}

	claims,ok := token.Claims.(*JWT)
	if !ok {
		Response.Send(response,http.StatusUnauthorized,"Error getting claims from JWT",nil)
		return ""
	}

	expTime, err := token.Claims.GetExpirationTime()
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting JWT expiration",nil)
		return ""
	}

	if expTime.Unix() < time.Now().Unix() {
		Response.Send(response,http.StatusUnauthorized,"JWT Token Expired",nil)
		return ""
	}
	return claims.ID
}



// func ValidateJWT(response http.ResponseWriter,request *http.Request) {
// 	jwt := GetJWT(response,request)
// 	if jwt != "" {
// 		Response.Send(response,http.StatusOK,"User Validated",jwt)
// 	}
// }



// func GetJWT(response http.ResponseWriter,request *http.Request) string {
// 	headerToken,headerError := GetJWTHeader(request)
// 	if headerError == http.ErrNoCookie{
// 		Response.Send(response,http.StatusUnauthorized,"User Not Authorized",nil)
// 		return ""
// 	} else if headerError != nil {
// 		Response.Send(response,http.StatusInternalServerError,"Error getting cookie",nil)
// 		return ""
// 	}

	// token,err := jwt.ParseWithClaims(headerToken,&JWT{}, func(t *jwt.Token) (interface{}, error) {
	// 	return []byte(os.Getenv("Secret")),nil
	// })
	// if err != nil {
	// 	Response.Send(response,http.StatusUnauthorized,`Session expired / Invalid token`,nil)
	// 	return ""
	// }

	// if !token.Valid {
	// 	Response.Send(response,http.StatusUnauthorized,"Unvalid User Token",nil)
	// 	return ""
	// }

	// claims,ok := token.Claims.(*JWT)
	// if !ok {
	// 	Response.Send(response,http.StatusUnauthorized,"Error getting claims from JWT",nil)
	// 	return ""
	// }

	// expTime, err := token.Claims.GetExpirationTime()
	// if err != nil {
	// 	Response.Send(response,http.StatusInternalServerError,"Error getting JWT expiration",nil)
	// 	return ""
	// }

	// if expTime.Unix() < time.Now().Unix() {
	// 	Response.Send(response,http.StatusUnauthorized,"JWT Token Expired",nil)
	// 	return ""
	// }
	// return claims.ID
	// // Response.Send(response,http.StatusOK,"User Validated",nil)
// }

// func GetJWTHeader(request *http.Request) (string,error){
// 	cookie, err := request.Cookie("Token")
// 	if err != nil {
// 		return "", err
// 	}
// 	return cookie.Value,nil
// }



// func GetHeader(request *http.Request,value string) (string,string) {
// 	if accessToken := request.Header.Get(value); accessToken != "" {
// 		token := accessToken[:]
// 		return token, ""
// 	}
// 	return "","User not authorized"
// }