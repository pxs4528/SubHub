package authentication

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func Config() *oauth2.Config{

	config := &oauth2.Config{
		ClientID: os.Getenv("ClientID"),
		ClientSecret: os.Getenv("ClientSecret"),
		RedirectURL: "http://localhost:8080/auth/google/callback",
		Scopes: []string {
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
	return config
}