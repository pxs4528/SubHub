package subscriptions

import (
	validation "backend/internal/Validation"
	"context"
	"encoding/json"
	"log"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

func Search(response http.ResponseWriter,request *http.Request,pool *pgxpool.Pool) {
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

	var name NameStruct
	err = json.NewDecoder(request.Body).Decode(&name)
	if err != nil {
		log.Printf("Error decoding name json: %v",err)
		return
	}
	caser := cases.Lower(language.AmericanEnglish)
	name.Name = caser.String(name.Name)

	var subscriptions []GetSubscription

	row,err := pool.Query(context.Background(),`SELECT name,amount,date
												FROM public.subscriptions
												WHERE name LIKE $1 AND id = $2
												ORDER BY amount DESC
												LIMIT 10;`,"%"+name.Name+"%",id)
	if err != nil {
		log.Printf("Error getting Subscription Duration: %v",err)
		return
	}
	caser = cases.Title(language.AmericanEnglish)
	for row.Next() {
		var subscription GetSubscription
		err := row.Scan(&subscription.Name,&subscription.Amount,&subscription.Date)
		if err != nil {
			log.Printf("Error reading the subscription: %v",err)
			return
		}
		subscription.Name = caser.String(subscription.Name)
		subscriptions = append(subscriptions,subscription)
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
