package subscriptions

import (
	authentication "backend/internal/Authentication"
	"backend/internal/Response"
	log "backend/internal/logger"
	"encoding/json"
	"net/http"
	"time"
	"github.com/google/uuid"
)

func (sh *SubscriptionHandler) InsertSubscription(response http.ResponseWriter,request *http.Request) {

	err := json.NewDecoder(request.Body).Decode(&sh.Subscription_list)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error decoding subscription data",nil)
		log.Warning("Error decoding subscription data")
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
		log.Warning("User is not logged in: "+sh.Subscription_list.User_id)
		return
	} else if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error fetching the cookie",nil)
		return
	}

	if validate.Value == "False" {
		Response.Send(response,http.StatusUnauthorized,"User hasn't validated 2FA",nil)
		log.Warning("User hasn't validated 2FA: "+sh.Subscription_list.User_id)
		return
	}

	duration := time.Now()
	newDuration := duration.AddDate(0,-(sh.Subscription_list.Months),0)
	sh.Subscription_list.Date = newDuration
	

	sh.Subscription_list.Subscription_id = sh.GetSubId(response,request)
	if sh.Subscription_list.Subscription_id == "" {
		return
	}


	_,queryError := sh.GetExpenseId(response,request)
	if queryError == "" {
		Response.Send(response,http.StatusConflict,"Subscription Exists",nil)
		log.Warning("This subscription exist: "+queryError)
		return
	} else if queryError == "Error getting expense subscription" {
		Response.Send(response,http.StatusInternalServerError,"Error getting the expense subscription",nil)
		log.Warning("Error getting the expense subscription")
		return
	}
	sh.Subscription_list.Expense_id = uuid.New().String()
	
	go sh.Insert()

	log.Info(sh.Subscription_list.Name+" inserted for user: "+sh.Subscription_list.User_id)
	Response.Send(response,http.StatusOK,"Subscription Inserted",nil)
}


