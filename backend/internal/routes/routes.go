package routes

import (
	authentication "backend/internal/Authentication/google-oauth"
	"backend/internal/Authentication/signup"
	"backend/internal/user"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
)


func NewRouter(pool *pgxpool.Pool) http.Handler{
	// make a new http router
	mux := http.NewServeMux()

	// all the routes
	mux.HandleFunc("/auth/google/login",authentication.GoogleLogin)

	mux.HandleFunc("/auth/google/callback", func(w http.ResponseWriter, r *http.Request) {
		authentication.GoogleCallback(w,r,pool)
	})

	mux.HandleFunc("/auth/signup", func(w http.ResponseWriter, r *http.Request) {
		signup.SignUp(w,r,pool)
	})
	
	mux.HandleFunc("/getalluser", func(w http.ResponseWriter, r *http.Request) {
		user.GetAllUser(w,r,pool)
	})

	// return router
	return mux
}
