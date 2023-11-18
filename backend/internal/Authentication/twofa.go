package authentication

import (
	"backend/internal/Response"
	"encoding/json"
	"net/http"
	"time"
)

func (uh *UserHandler) Validate(response http.ResponseWriter,request *http.Request) {

	err := json.NewDecoder(request.Body).Decode(&uh.Code)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error decoding the 2FA code",nil)
		return
	}

	id := ValidateJWT(response,request)
	if id == ""{
		return
	}

	validate,err := GetCookie(request,"Validated")
	if err == http.ErrNoCookie {
		Response.Send(response,http.StatusUnauthorized,"User not logged in",nil)
		return
	} else if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error fetching the cookie",nil)
		return
	}

	sameCode,err := uh.GetCode(id)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting the 2FA code",nil)
		return
	}
	

	if !sameCode {
		Response.Send(response,http.StatusUnauthorized,"Invalid Code",nil)
		return
	}

	validate.Value = "True"
	validate.Expires = time.Now().Add(1*time.Hour)
	validate.HttpOnly = true
	validate.Path = "/"
	validate.SameSite = http.SameSiteNoneMode
	validate.Secure = true

	http.SetCookie(response,validate)

	Response.Send(response,http.StatusOK,"User Validated",nil)


}