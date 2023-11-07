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

	id := GetJWT(response,request)
	if id == "" {
		return
	}

	_,headerError := GetHeader(request,"Validated")
	if headerError != "" {
		Response.Send(response,http.StatusUnauthorized,"User not logged in",nil)
		return
	}

	var code int

	err = uh.DB.QueryRow(context.Background(),`SELECT code
												FROM public.twofa
												WHERE id = $1;`,id).Scan(&code)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting the 2FA code",nil)
		return
	}

	if code != uh.Code.Code {
		Response.Send(response,http.StatusUnauthorized,"Invalid 2FA Code",nil)
		return
	}

	request.Header.Del("Validated")
	request.Header.Add("Validated","True")


	Response.Send(response,http.StatusOK,"User Logged in ",nil)

}