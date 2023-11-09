package authentication

import (
	"backend/internal/Response"
	"net/http"
)

func (uh *UserHandler) ValidateUser(response http.ResponseWriter,request *http.Request) {
	id := ValidateJWT(response,request)
	if id == "" {
		return
	}

	validateCookie,err := getCookie(request,"Validated")
	if err == http.ErrNoCookie {
		Response.Send(response,http.StatusUnauthorized,"User not logged in",nil)
		return
	} else if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error fetching the cookie",nil)
		return
	}

	if validateCookie.Value == "False" {
		Response.Send(response,http.StatusUnauthorized,"User not validated",nil)
		return
	}

	Response.Send(response,http.StatusOK,"User validated",nil)

}