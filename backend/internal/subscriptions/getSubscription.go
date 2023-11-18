package subscriptions

import (
	authentication "backend/internal/Authentication"
	"backend/internal/Response"
	"context"
	"net/http"
	"os"
	"time"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func (sh *SubscriptionHandler) GetAllSubscriptions(response http.ResponseWriter,request *http.Request) {
	
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	
	var subscriptions []Subscriptions

	row,err := sh.DB.Query(context.Background(),`SELECT id,subscription_name
												FROM public.subscription_list;`)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error occured getting subscription list",nil)
		return
	}
	for row.Next(){
		var subscription Subscriptions
		err := row.Scan(&subscription.ID,&subscription.Subscription_name)
		if err != nil {
			Response.Send(response,http.StatusInternalServerError,"Error scanning the subscriptions_list rows",nil)
			return
		}
		subscriptions = append(subscriptions,subscription)
	}
	if err := row.Err(); err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error occured reading the row",nil)
		return
	}
	Response.Send(response,http.StatusOK,"Subscription List",subscriptions)

}

func (sh *SubscriptionHandler) GetLatestSubscription(response http.ResponseWriter,request *http.Request) {

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



	var user_subscriptions []User_Subscription_List

	row,err := sh.DB.Query(context.Background(),`SELECT ue.expense_id,ue.subscription_id,sl.subscription_name,ue.amount,ue.date,ue.status
												FROM public.user_expenses AS ue
												JOIN public.subscription_list AS sl ON sl.id = ue.subscription_id
												WHERE ue.user_id = $1
												ORDER BY ue.date DESC
												LIMIT 5;`,id)	
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error occured getting subscription list",nil)
		return
	}
	for row.Next() {
		var user_subscription User_Subscription_List
		err := row.Scan(&user_subscription.Expense_id,&user_subscription.Subscription_id,&user_subscription.Name,&user_subscription.Amount,&user_subscription.Date,&user_subscription.Status)
		if err != nil {
			Response.Send(response,http.StatusInternalServerError,"Error scanning the user_subscription",nil)
			return
		}
		user_subscription.User_id = id
		user_subscription.Months = monthDiff(time.Now(),user_subscription.Date)
		user_subscriptions = append(user_subscriptions, user_subscription)

	}
	if err := row.Err(); err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error occured reading the row",nil)
		return
	}
	Response.Send(response,http.StatusOK,"User latest subscriptions",user_subscriptions)


}

func (sh*SubscriptionHandler) GetUserSubscriptionCount(response http.ResponseWriter,request *http.Request) {
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

	sh.Subscription_Count = &Subscription_Count{}
	err = sh.DB.QueryRow(context.Background(),`SELECT COUNT(*),
												COALESCE(SUM(CASE WHEN status = 'Paid' THEN amount ELSE 0 END), 0) AS "paid",
												COALESCE(SUM(CASE WHEN status = 'Pending' THEN amount ELSE 0 END), 0) AS "pending"
												FROM public.user_expenses
												WHERE user_id = $1`,id).Scan(&sh.Subscription_Count.Count,&sh.Subscription_Count.PaidTotal,&sh.Subscription_Count.PendingTotal)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting the count of total user subscriptions",err.Error())
		return
	}

	Response.Send(response,http.StatusOK,"Count of user subscriptions",sh.Subscription_Count)
}

func monthDiff(a, b time.Time) int {
    yearDiff := a.Year() - b.Year()
    monthDiff := int(a.Month()) - int(b.Month())

    return yearDiff*12 + monthDiff
}


