package routes

import (
	authentication "backend/internal/Authentication"
	"backend/internal/Authentication/oauth"
	"backend/internal/user"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/rs/cors"
)

func NewRouter(pool *pgxpool.Pool) http.Handler {
	// make a new http router
	mux := http.NewServeMux()

	c := cors.New(cors.Options{
		AllowedOrigins: []string{"http://localhost:3000"}, // Replace with your React frontend's URL
		AllowedMethods: []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
	})

	// all the routes
	mux.HandleFunc("/auth/google/login", oauth.Login)

	mux.HandleFunc("/auth/google/callback", func(w http.ResponseWriter, r *http.Request) {
		oauth.Callback(w, r, pool)
	})

	mux.HandleFunc("/auth/signup", func(w http.ResponseWriter, r *http.Request) {
		authentication.NewSignUp(w, r, pool)
	})

	mux.HandleFunc("/getalluser", func(w http.ResponseWriter, r *http.Request) {
		user.GetAllUser(w, r, pool)
	})

	mux.HandleFunc("/",func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("BRUHBRUH"))
	})

	handler := c.Handler(mux)

	// return router
	return handler
}
