package validation

import (
	"net/http"
	"net/url"
	"strings"
)


func GetUrlVal(request *http.Request, getVal string) (string,string){
	queryParam,err := url.ParseQuery(request.URL.RawQuery)
	if err != nil {
		return "","Error getting url pararm"
	}

	authParam := queryParam.Get("auth")
	if authParam != "" {
		return authParam,""
	} else {
		return "","User not authorized"
	}
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