package subscriptions

import (
	"backend/internal/Response"
	validation "backend/internal/Validation"
	"context"
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
		Response.Send(response,httpCode,err.Error(),nil)
		return
	}

	var subscriptions []GetSubscription

	row,err := pool.Query(context.Background(),`SELECT name,amount,date
												FROM public.subscriptions
												WHERE id = $1
												ORDER BY amount DESC
												LIMIT 4;`,id)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return
	}
	for row.Next() {
		var subscription GetSubscription
		err := row.Scan(&subscription.Name,&subscription.Amount,&subscription.Date)
		if err != nil {
			Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
			return
		}
		subscriptions = append(subscriptions, subscription)
	}
	if err := row.Err(); err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return
	}

	Response.Send(response,http.StatusOK,"Max Subscription List",subscriptions)
}


