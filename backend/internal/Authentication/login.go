package authentication

import (
	"backend/internal/Response"
	"encoding/json"
	"log"
	"net/http"
	"time"
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

	log.Print(uh.User)
	
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
		
		// request.Header.Add("Authorization","Bearer"+JWT)
		// request.Header.Add("Validated","False")
		// response.Header().Add("Access",uh.User.ID)

	
		log.Printf("JWT: %v",JWT)
		log.Printf("ID: %v",uh.User.ID)

		http.SetCookie(response,&http.Cookie{
			Name: "token",
			Value: JWT,
			Expires: time.Now().Add(1*time.Hour),
			HttpOnly: true,
			Path: "/",
			SameSite: http.SameSiteNoneMode,
			Secure: true,
		})

		

		Response.Send(response,http.StatusAccepted,"User logged in",nil)
		return

	} else {
		Response.Send(response,http.StatusUnauthorized,"Password doesn't match",nil)
	}


}