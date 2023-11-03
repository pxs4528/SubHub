package authentication

import (
	"backend/internal/Response"
	"net/http"
)

func (uh *UserHandler) GetUserID(response http.ResponseWriter, request *http.Request) {
	accessToken := request.Header.Get("Access")
	if accessToken == "" {
		Response.Send(response,http.StatusUnauthorized,"User Unauthorized",nil)
		return
	}
	uh.UserID = &UserID{}

	uh.UserID.ID = accessToken

	Response.Send(response,http.StatusOK,"User ID",uh.UserID)
}