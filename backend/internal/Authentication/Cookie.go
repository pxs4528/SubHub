package authentication

import (
	"backend/internal/Response"
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

func DeleteCookie(response http.ResponseWriter,cookieName string) {
	cookie := &http.Cookie {
		Name: cookieName,
		Value: "",
		Expires: time.Now(),
		HttpOnly: false,
		Path: "/",
		SameSite: http.SameSiteNoneMode,
		Secure: true,
	}

	http.SetCookie(response,cookie)
}

func ClearAllCookie(respone http.ResponseWriter,request *http.Request) {
	cookieArray := [...]string{"Validated","Token","Access","Name"}

	for _,cookie := range cookieArray {
		DeleteCookie(respone,cookie)
	}
	Response.Send(respone,http.StatusOK,"User Signed out",nil)
}