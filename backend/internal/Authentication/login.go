package authentication

import (
	"backend/internal/Response"
	"encoding/json"
	"log"
	"net/http"
)


func (uh *UserHandler) UserLogin(response http.ResponseWriter,request *http.Request) {

	uh.User = &UserData{}

	err := json.NewDecoder(request.Body).Decode(&uh.Login)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting the request",nil)
		return
	}

	err = uh.GetUser()
	if err != nil {
		Response.Send(response,http.StatusUnauthorized,"User doesn't exist",nil)
		return
	}

	
	JWT,err := uh.GenerateJWT()
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error Generating Session",nil)
		return
	}

	code := RandomCode()

	uh.Code = &Code{
		Code: code,
	}

	matchPassword := uh.VerifyPassword()
	
	if matchPassword{
		go uh.ValidateInsertCode()
		go uh.Send()
	
		request.Header.Add("Authorization","Bearer"+JWT)
		request.Header.Add("Access",uh.User.ID)
	
		log.Printf("JWT: %v",JWT)
		log.Printf("ID: %v",uh.User.ID)
	
		Response.Send(response,http.StatusAccepted,"User logged in",nil)
		return

	} else {
		Response.Send(response,http.StatusUnauthorized,"Password doesn't match",nil)
	}


}