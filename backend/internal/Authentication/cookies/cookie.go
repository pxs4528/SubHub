package cookies

import (
	"net/http"
	"time"
)

type Cookie struct {
	Name string
	Value string
	
	Expires time.Time
	Secure bool
	HttpOnly bool
	Path string

}

// generates cookie for the front end, name will be the key you will be looking for and value is value for that key
func GenCookie(writer http.ResponseWriter, response *http.Request ,name string, value string) {

	cookie := http.Cookie{}
	cookie.Name = name
	cookie.Value = value
	cookie.Expires = time.Now().Add(365 * 24 * time.Hour)
	cookie.Secure = false
	cookie.HttpOnly = true
	cookie.Path = "/"

	http.SetCookie(writer,&cookie)
}