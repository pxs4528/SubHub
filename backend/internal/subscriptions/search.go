package subscriptions

import (
	authentication "backend/internal/Authentication"
	"backend/internal/Response"
	log "backend/internal/logger"
	"context"
	"encoding/json"
	"net/http"
	"regexp"
	"strconv"
	"time"

	"github.com/jackc/pgx/v5"
)

func (sh *SubscriptionHandler) SearchSubscriptions(response http.ResponseWriter,request *http.Request) {
	id := authentication.ValidateJWT(response,request)
	if id == "" {
		return
	}

	validate,err := authentication.GetCookie(request,"Validated")
	if err == http.ErrNoCookie {
		Response.Send(response,http.StatusUnauthorized,"User not logged in",nil)
		return
	} else if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error fetching the cookie",nil)
		return
	}

	if validate.Value == "False" {
		Response.Send(response,http.StatusUnauthorized,"User hasn't validated 2FA",nil)
		return
	}


	err = json.NewDecoder(request.Body).Decode(&sh.Search)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error decoding search subscription data",nil)
		log.Warning("Error decoding search subscription data")
		return
	}
	
	isInteger, err := regexp.MatchString(`^\d+$`, sh.Search.Search)
    if err != nil {
        // Handle error
        Response.Send(response, http.StatusInternalServerError, "Error processing search value", nil)
        return
    }

	var row pgx.Rows
    if isInteger {
        monthsAgo, err := strconv.Atoi(sh.Search.Search)
        if err != nil {
            // Handle error
            Response.Send(response, http.StatusBadRequest, "Invalid search value", nil)
            return
        }
		sh.Search.Date = time.Now().AddDate(0, -monthsAgo, 0)

		row,err = sh.DB.Query(context.Background(),`WITH FilteredExpenses AS (
														SELECT ue.expense_id, ue.subscription_id, sl.subscription_name, ue.user_id, ue.amount, ue.status, ue.date
														FROM public.user_expenses ue
														JOIN public.subscription_list sl ON ue.subscription_id = sl.id
														WHERE ue.user_id = $1
														AND (
															($2 ~ '^\d+$' AND EXTRACT(YEAR FROM ue.date) = $3 AND EXTRACT(MONTH FROM ue.date) = $4)
															OR 
															($2 ~ '^\d+(\.\d+)?$' AND (ROUND(ue.amount, 2) >= ROUND($2::DECIMAL, 2) AND ROUND(ue.amount, 2) < ROUND($2::DECIMAL, 2) + 1))
															OR 
															(NOT $2 ~ '^\d+$' AND NOT $2 ~ '^\d+(\.\d+)?$' AND (SOUNDEX(sl.subscription_name) = SOUNDEX($2) OR SOUNDEX(ue.status) = SOUNDEX($2)))
														)
													)
													SELECT *
													FROM FilteredExpenses
													UNION ALL
													SELECT ue.expense_id, ue.subscription_id, sl.subscription_name, ue.user_id, ue.amount, ue.status, ue.date
													FROM public.user_expenses ue
													JOIN public.subscription_list sl ON ue.subscription_id = sl.id
													WHERE NOT EXISTS (SELECT 1 FROM FilteredExpenses)
													AND ue.user_id = $1
													ORDER BY date DESC;		
													`,id,sh.Search.Search,sh.Search.Date.Year(),sh.Search.Date.Month())	
		if err != nil {
		log.Error(err,"Error occurred getting subscription list: "+err.Error())
		Response.Send(response,http.StatusInternalServerError,"Error occured getting subscription list",nil)
		return
		}											

	} else {
		row,err = sh.DB.Query(context.Background(),`WITH FilteredExpenses AS (
														SELECT ue.expense_id, ue.subscription_id, sl.subscription_name, ue.user_id, ue.amount, ue.status, ue.date
														FROM public.user_expenses ue
														JOIN public.subscription_list sl ON ue.subscription_id = sl.id
														WHERE ue.user_id = $1
														AND (
															($2 ~ '^\d+(\.\d+)?$' AND (ROUND(ue.amount, 2) >= ROUND($2::DECIMAL, 2) AND ROUND(ue.amount, 2) < ROUND($2::DECIMAL, 2) + 1))
															OR 
															(NOT $2 ~ '^\d+$' AND NOT $2 ~ '^\d+(\.\d+)?$' AND (SOUNDEX(sl.subscription_name) = SOUNDEX($2) OR SOUNDEX(ue.status) = SOUNDEX($2)))
														)
													)
													SELECT *
													FROM FilteredExpenses
													UNION ALL
													SELECT ue.expense_id, ue.subscription_id, sl.subscription_name, ue.user_id, ue.amount, ue.status, ue.date
													FROM public.user_expenses ue
													JOIN public.subscription_list sl ON ue.subscription_id = sl.id
													WHERE NOT EXISTS (SELECT 1 FROM FilteredExpenses)
													AND ue.user_id = $1
													ORDER BY date DESC;		
													`,id,sh.Search.Search)	
		if err != nil {
			log.Error(err,"Error occurred getting subscription list: "+err.Error())
			Response.Send(response,http.StatusInternalServerError,"Error occured getting subscription list",nil)
			return
		}
	}
	var user_subscriptions []User_Subscription_List

	
	for row.Next() {
		var user_subscription User_Subscription_List
		err := row.Scan(&user_subscription.Expense_id, &user_subscription.Subscription_id, &user_subscription.Name, &user_subscription.User_id, &user_subscription.Amount, &user_subscription.Status, &user_subscription.Date)
		if err != nil {
			log.Error(err,"Error scanning the user_subscription: "+err.Error())
			Response.Send(response,http.StatusInternalServerError,"Error scanning the user_subscription",nil)
			return
		}
		user_subscription.User_id = id
		user_subscription.Month = monthDiff(time.Now(),user_subscription.Date)
		user_subscriptions = append(user_subscriptions, user_subscription)

	}
	if err := row.Err(); err != nil {
		log.Error(err,"Error occured reading the row: "+err.Error())
		Response.Send(response,http.StatusInternalServerError,"Error occured reading the row",nil)
		return
	}
	Response.Send(response,http.StatusOK,"User latest subscriptions",user_subscriptions)




}