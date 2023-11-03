package subscriptions

import (
	"backend/internal/Response"
	validation "backend/internal/Validation"
	"context"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)


func GetMax(response http.ResponseWriter,request *http.Request, pool *pgxpool.Pool){
	
	id,ok := validation.GetAccess(request)
	if ok != "" {
		Response.Send(response,http.StatusUnauthorized,ok,nil)
		return
	}

	jwt,ok := validation.GetJWTHeader(request)
	if ok != "" {
		Response.Send(response,http.StatusUnauthorized,ok,nil)
		return
	}

	jwtID,httpCode,err := validation.JWT(jwt)
	if err != nil || httpCode != http.StatusAccepted{
		Response.Send(response,httpCode,err.Error(),nil)
		return
	}
	if jwtID != id {
		Response.Send(response,http.StatusUnauthorized,"User not authorized",nil)
		return
	}

	var subscriptions []GetSubscription
	caser := cases.Title(language.AmericanEnglish)
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
		subscription.Name = caser.String(subscription.Name)
		subscriptions = append(subscriptions, subscription)
	}
	if err := row.Err(); err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return
	}

	Response.Send(response,http.StatusOK,"Max Subscription List",subscriptions)
}


