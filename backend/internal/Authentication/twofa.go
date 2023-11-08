package authentication

import (
	"backend/internal/Response"
	"context"
	"encoding/json"
	"net/http"
)

func (uh *UserHandler) Validate(response http.ResponseWriter,request *http.Request) {

	err := json.NewDecoder(request.Body).Decode(&uh.Code)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error decoding the 2FA code",nil)
		return
	}

	id := ValidateJWT(response,request)
	if id == "" {
		return
	}

	validate,err := getCookie(request,"Validated")
	if err == http.ErrNoCookie {
		Response.Send(response,http.StatusUnauthorized,"User not logged in",nil)
		return
	} else if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error fetching the cookie",nil)
		return
	}

	var code int

	err = uh.DB.QueryRow(context.Background(),`SELECT code
												FROM public.twofa
												WHERE id = $1`,id).Scan(&code)

	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting the 2FA code",nil)
		return
	}

	if code != uh.Code.Code {
		Response.Send(response,http.StatusUnauthorized,"Invalid Code",nil)
		return
	}
	
	validate.Value = "True"

	http.SetCookie(response,validate)

	Response.Send(response,http.StatusOK,"User Validated",nil)




}