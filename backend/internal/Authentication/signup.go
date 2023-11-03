package authentication

import (

	"backend/internal/Response"
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
)

/*
First thing we will be doing is setting the header to return json, so when we use this func in postman, it will return properly styled json.
Then we set user to UserData struct and then read the response passed from frontend by decoding it and setting that to user.
then we make a channel called existUser and genJwt which will be used to call UserExist, and jwt.Generate() having the go in front of the func
means that you are using go routine basically meaning calling a thread to execute this func.
While threads execute the func NewSignUp will make a new uuid and set it to user.Id and then hash the password afterwards by calling HashPassword func
if HashPassword doesn't return any error we will be setting user.Password to hpass, and also set AuthType to Regular since user is making the account manually
**IMPORTANT** to call the thread and stop running this function, look at the way I call userExist := <- existUser, this will wait till the UserExist func is done,
then asssign the value for existUser channel to userExist by using this `<-` and same thing is done with JWT
after getting JWT, we check if user exists or not and if they do exist, we return error 409 and if the user doesn't than we insert the user and
return the JWT
*/

func (uh *UserHandler) NewSignUp(response http.ResponseWriter, request *http.Request) {

	err := json.NewDecoder(request.Body).Decode(&uh.User)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting the request",nil)
		return
	}

	id := uh.ExistUser()
	if id != "" {
		Response.Send(response,http.StatusConflict,"User Exist",nil)
		return
	}

	uh.User.ID = uuid.New().String()
	uh.User.AuthType = "Regular"

	JWT,err := uh.GenerateJWT()
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error Generating Session",nil)
		return
	}

	err = uh.HashPassword()
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error hashing password",nil)
		return
	}

	code := RandomCode()

	uh.Code = &Code{
		Code: code,
	}

	go uh.InsertUser()

	go uh.ValidateInsertCode()

	go uh.Send()

	request.Header.Add("Authorization","Bearer"+JWT)
	request.Header.Add("Access",uh.User.ID)

	log.Printf("JWT: %v",JWT)
	log.Printf("ID: %v",uh.User.ID)

	Response.Send(response,http.StatusCreated,"User Created Successfully",nil)


}