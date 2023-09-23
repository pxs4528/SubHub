package routes

import (
	authentication "backend/internal/Authentication"
	"backend/internal/user"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
)


func NewRouter(pool *pgxpool.Pool) http.Handler{
	// make a new http router
	mux := http.NewServeMux()

	// all the routes
	mux.HandleFunc("/auth/google/login",authentication.OauthLogin)

	mux.HandleFunc("/auth/google/callback", func(w http.ResponseWriter, r *http.Request) {
		authentication.GoogleCallback(w,r,pool)
	})

	mux.HandleFunc("/auth/signup", func(w http.ResponseWriter, r *http.Request) {
		authentication.NewSignUp(w,r,pool)
	})
	
	mux.HandleFunc("/getalluser", func(w http.ResponseWriter, r *http.Request) {
		user.GetAllUser(w,r,pool)
	})

	// return router
	return mux
}
