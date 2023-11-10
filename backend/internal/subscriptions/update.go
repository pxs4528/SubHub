package subscriptions

import (
	authentication "backend/internal/Authentication"
	"backend/internal/Response"
	"encoding/json"
	"net/http"
	"time"
)


func (sh *SubscriptionHandler) UpdateSubscription(response http.ResponseWriter,request *http.Request) {
	err := json.NewDecoder(request.Body).Decode(&sh.Subscription_list)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error decoding subscription data",nil)
		return
	}

	id := authentication.ValidateJWT(response,request)
	if id == "" {
		return
	}

	sh.Subscription_list.User_id = id
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

	duration := time.Now()
	newDuration := duration.AddDate(0,-(sh.Subscription_list.Months),0)
	sh.Subscription_list.Date = newDuration

	sh.Subscription_list.Subscription_id = sh.GetSubId(response,request)
	if sh.Subscription_list.Subscription_id == "" {
		return
	}

	expense_id,queryError := sh.GetExpenseId(response,request)
	if queryError == "No subscription" {
		Response.Send(response,http.StatusConflict,"Subscription doesn't Exists",nil)
		return
	} else if queryError == "Error getting expense subscription" {
		Response.Send(response,http.StatusInternalServerError,"Error getting the expense subscription",nil)
		return
	}

	sh.Subscription_list.Expense_id = expense_id

	go sh.Update()

	Response.Send(response,http.StatusOK,"Subscription Updated",nil)
}