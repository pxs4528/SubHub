package routes

import (
	authentication "backend/internal/Authentication"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
)

func NewRouter(*pgxpool.Pool) http.Handler{
	mux := http.NewServeMux()

	mux.HandleFunc("/auth/google/login", authentication.GoogleLogin)
	mux.HandleFunc("/auth/google/callback", authentication.GoogleCallback)
	return mux
}
