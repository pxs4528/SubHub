package subscriptions

import (
	"backend/internal/Response"
	validation "backend/internal/Validation"
	"context"
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)


func Insert(response http.ResponseWriter, request *http.Request, pool *pgxpool.Pool) {
	urlParam,ok := validation.GetUrlVal(request,"auth")
	if ok != "" {
		Response.Send(response,http.StatusUnauthorized,ok,nil)
		return
	}
	id := string(validation.Decrypt(urlParam))

	jwt,ok := validation.GetJWTHeader(request)
	if ok != "" {
		Response.Send(response,http.StatusUnauthorized,ok,nil)
		return
	}
	jwt = string(validation.Decrypt(jwt))
	
	jwtID,httpCode,err := validation.JWT(jwt)
	if err != nil || httpCode != http.StatusAccepted{
		Response.Send(response,httpCode,err.Error(),nil)
		return
	}
	if jwtID != id {
		Response.Send(response,http.StatusUnauthorized,"User not authorized",nil)
		return
	}
	
	var subscription Subscriptions
	err = json.NewDecoder(request.Body).Decode(&subscription)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return
	}
	subscription.ID = id
	caser := cases.Lower(language.AmericanEnglish)
	subscription.Name = caser.String(subscription.Name)
	var name string
	err = pool.QueryRow(context.Background(),`SELECT name
											FROM public.subscriptions
											WHERE name = $1;`,subscription.Name).Scan(&name)
	if err != pgx.ErrNoRows {
		Response.Send(response,http.StatusConflict,"Subscription Already Exists",nil)
		return
	}

	_,err = pool.Exec(context.Background(),`INSERT INTO public.subscriptions
											VALUES ($1,$2,$3,$4)`,subscription.ID,subscription.Name,subscription.Amount,subscription.Date)	
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error inserting subscriptions",nil)
		return
	}

	Response.Send(response,http.StatusAccepted,"Subscription Added",nil)
}

