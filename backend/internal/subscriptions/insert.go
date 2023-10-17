package subscriptions

import (
	validation "backend/internal/Validation"
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)


func Insert(response http.ResponseWriter, request *http.Request, pool *pgxpool.Pool) {
	cookie,err := request.Cookie("token")
	if err != nil {
		http.Redirect(response,request,"http://localhost:3000/login",http.StatusNotFound)
		return
	}
	id,httpCode,err :=validation.JWT(cookie.Value)
	if err != nil || httpCode != http.StatusAccepted{
		response.WriteHeader(httpCode)
		return
	}
	var subscription Subscriptions
	err = json.NewDecoder(request.Body).Decode(&subscription)
	if err != nil {
		log.Printf("Error decoding json: %v", err)
		return
	}
	subscription.ID = id
	caser := cases.Title(language.AmericanEnglish)
	subscription.Name = caser.String(subscription.Name)
	var name string
	err = pool.QueryRow(context.Background(),`SELECT name
											FROM public.subscriptions
											WHERE name = $1;`,subscription.Name).Scan(&name)
	if err != pgx.ErrNoRows {
		response.WriteHeader(http.StatusConflict)
		return
	}

	_,err = pool.Exec(context.Background(),`INSERT INTO public.subscriptions
											VALUES ($1,$2,$3,$4)`,subscription.ID,subscription.Name,subscription.Amount,subscription.Date)	
	if err != nil {
		log.Printf("Error inserting subscription: %v",err)
		return
	}

	response.WriteHeader(http.StatusAccepted)
}