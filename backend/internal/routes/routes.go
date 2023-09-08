package routes

import "net/http"

func newRouter() http.Handler{
	mux := http.NewServeMux()

	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {})

	return mux

}
