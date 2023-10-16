package validation

import (

	"net/http"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
)



type UserCred struct {
	ID string `json:"id"`
}


func JWT(body TokenCode,) (string,int,error){

	token,err := jwt.ParseWithClaims(body.Token,&Claims{}, func(t *jwt.Token) (interface{}, error) {
		return []byte(os.Getenv("Secret")),nil
	})
	if err != nil {
		return "",http.StatusInternalServerError,err
	}

	if !token.Valid {
		return "",http.StatusUnauthorized,nil
	}

	claims,ok := token.Claims.(*Claims)
	if !ok {
		return "",http.StatusUnauthorized,nil
	}

	expTime, err := token.Claims.GetExpirationTime()
	if err != nil {
		return "",http.StatusInternalServerError,err
	}

	if expTime.Unix() < time.Now().Unix() {
		return "",http.StatusUnauthorized,nil
	}

	return claims.ID,http.StatusAccepted,nil
}




// func Validate(response http.ResponseWriter,request *http.Request) string {
// 	var jwtToken token
// 	err := json.NewDecoder(request.Body).Decode(&jwtToken)
// 	if err != nil {
// 		response.Write([]byte(err.Error()))
// 		return ""
// 	}
// 	token,_ := jwt.ParseWithClaims(jwtToken.Token, &Claims{}, func(token *jwt.Token) (interface{}, error) {
// 		return []byte(os.Getenv("Secret")), nil
// 	})
// 	if err != nil {
// 		response.WriteHeader(http.StatusUnauthorized)
// 		return ""
// 	}

// 	if !token.Valid {
// 		response.WriteHeader(http.StatusUnauthorized)
// 		return ""
// 	}

// 	claims,ok := token.Claims.(*Claims)
// 	if !ok {
// 		response.WriteHeader(http.StatusUnauthorized)
// 		return ""
// 	}
// 	jsonID,err := json.Marshal(&UserCred{ID: claims.ID})
// 	if err != nil {
// 		response.WriteHeader(http.StatusInternalServerError)
// 		return ""
// 	}
	// expTime, err := token.Claims.GetExpirationTime()
	// if err != nil {
	// 	response.WriteHeader(http.StatusInternalServerError)
	// 	return ""
	// }

	// if expTime.Unix() < time.Now().Unix() {
	// 	response.WriteHeader(http.StatusUnauthorized)
	// 	return ""
	// }

// 	response.WriteHeader(http.StatusAccepted)
// 	response.Write(jsonID)
// 	return claims.ID
// }


