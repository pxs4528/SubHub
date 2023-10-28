package validation

import (
	"net/http"
	"strings"
)


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

func GetAccess(request *http.Request) (string,string) {
	if accessToken := request.Header.Get("Access"); accessToken != "" {
		token := accessToken[:]
		return token, ""
	}
	return "","User not authorized"
}