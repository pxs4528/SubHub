package routes

import (
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
)

func NewRouter(*pgxpool.Pool) http.Handler{
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {})

	return mux

}
