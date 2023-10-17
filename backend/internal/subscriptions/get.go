package subscriptions

import (
	validation "backend/internal/Validation"
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
)


func GetMax(response http.ResponseWriter,request *http.Request, pool *pgxpool.Pool){
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

	var subscriptions []GetSubscription

	row,err := pool.Query(context.Background(),`SELECT name,amount,date
												FROM public.subscriptions
												WHERE id = $1
												LIMIT 10`,id)
	if err != nil {
		log.Printf("Error Getting Subscription: %v",err)
		return
	}
	for row.Next() {
		var subscription GetSubscription
		err := row.Scan(&subscription.Name,&subscription.Amount,&subscription.Date)
		if err != nil {
			log.Printf("Error reading the subscription: %v",err)
			return
		}
		subscriptions = append(subscriptions, subscription)
	}
	if err := row.Err(); err != nil {
		log.Printf("Error with the row: %v",err)
		return
	}
	
	jsonSub, err := json.Marshal(subscriptions)
	if err != nil {
		log.Printf("Error encoding getMax: %v",err)
		return
	}

	response.Header().Set("Content-Type", "application/json")
	response.WriteHeader(http.StatusOK)
	response.Write(jsonSub)

}