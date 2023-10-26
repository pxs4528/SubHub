package authentication

import (
	"backend/internal/Response"
	validation "backend/internal/Validation"
	"encoding/json"
	"log"
	"math/rand"

	"net/http"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
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
func NewSignUp(response http.ResponseWriter,request *http.Request, pool *pgxpool.Pool) {
	var user UserData

	err := json.NewDecoder(request.Body).Decode(&user)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return
	}
	user.ID = uuid.New().String()
	
	existUser := make(chan string)

	genJwt := make(chan string)

	go UserExist(user,pool,existUser)

	go validation.GenerateJWT(response,user.ID,genJwt)


	encryptedID := validation.Encrypt([]byte(user.ID))

	hpass,err := HashPassword(user.Password)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return

	}
	code := rand.Intn(999999-100000+1) + 100000
	
	user.Password = string(hpass)

	user.AuthType = "Regular"

	userExist := <- existUser

	JWT := <- genJwt

	if userExist != "" {
		Response.Send(response,http.StatusConflict,"User Already Exist",nil)
		return

	} else {
		go InsertUser(user,pool)
		go validation.Send(user.Email,user.Name,code)
		encryptedJWT := validation.Encrypt([]byte(JWT))
		go validation.InsertCode(pool,code,user.ID)
		request.Header.Add("Authorization","Bearer"+encryptedJWT)
		log.Println(JWT)
		Response.Send(response,http.StatusCreated,"User Created Successfully",encryptedID)
	}

}


