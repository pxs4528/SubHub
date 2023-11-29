package authentication

import (
	"net/http"
	"time"
)

func SetHttpOnlyCookie(key string, value string) *http.Cookie{
	cookie := &http.Cookie{
		Name: key,
		Value: value,
		Expires: time.Now().Add(1*time.Hour),
		HttpOnly: true,
		Path: "/",
		SameSite: http.SameSiteNoneMode,
		Secure: true,
	}

	return cookie
}


func SetRegularCookie(key string, value string) *http.Cookie {
	cookie := &http.Cookie{
		Name: key,
		Value: value,
		Expires: time.Now().Add(1*time.Hour),
		HttpOnly: false,
		Path: "/",
		SameSite: http.SameSiteNoneMode,
		Secure: true,
	}

	return cookie
}


func GetCookie(request *http.Request,key string) (*http.Cookie,error){
	cookie,err := request.Cookie(key)
	if err != nil {
		return nil,err
	}
	return cookie,nil
}