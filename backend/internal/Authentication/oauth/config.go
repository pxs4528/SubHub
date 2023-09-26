package oauth

import (
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
)

func Config() *oauth2.Config{
	config := &oauth2.Config{
		// configuring google oauth, where clientID and clientSecret are in API keys
		ClientID: os.Getenv("ClientID"),
		ClientSecret: os.Getenv("ClientSecret"),
		// this is the link user will be redirected to after successful login
		RedirectURL: "http://localhost:8080/auth/google/callback",
		// we're requesting email and user profile from google after successfull login
		Scopes: []string {
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile",
		},
		Endpoint: google.Endpoint,
	}
	return config
}