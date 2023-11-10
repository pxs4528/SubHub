package subscriptions

import (
	"backend/internal/Response"
	"context"
	"log"
	"net/http"
	"github.com/jackc/pgx/v5"
)


func (sh *SubscriptionHandler) Insert(){
	_,err := sh.DB.Exec(context.Background(),`INSERT INTO public.user_expenses (
		expense_id,
		subscription_id,
		user_id,
		amount,
		status,
		date
		) 
		VALUES ($1,$2,$3,$4,$5,$6);
		`,sh.Subscription_list.Expense_id,sh.Subscription_list.Subscription_id,sh.Subscription_list.User_id,sh.Subscription_list.Amount,sh.Subscription_list.Status,sh.Subscription_list.Date)
	if err != nil {

		log.Printf("Error occured adding subscription %v",err.Error())
		return
	}
}

func (sh *SubscriptionHandler) Update() {
	_,err := sh.DB.Exec(context.Background(),`UPDATE public.user_expenses SET
												expense_id = $1,
												subscription_id = $2,
												user_id = $3,
												amount = $4,
												status = $5,
												date = $6
												WHERE subscription_id = $2 AND user_id = $3;
											`,sh.Subscription_list.Expense_id,sh.Subscription_list.Subscription_id,sh.Subscription_list.User_id,sh.Subscription_list.Amount,sh.Subscription_list.Status,sh.Subscription_list.Date)
	if err != nil {
		log.Printf("Error occured updating subscription %v",err.Error())
		return
	}
}

func (sh *SubscriptionHandler) GetSubId(response http.ResponseWriter,request *http.Request) string{
	var subscription_id string
	err := sh.DB.QueryRow(context.Background(),`SELECT id
												FROM public.subscription_list
												WHERE subscription_name LIKE $1`,sh.Subscription_list.Name).Scan(&subscription_id)
	if err == pgx.ErrNoRows {
		Response.Send(response,http.StatusNotFound,"Subscription not found",nil)
		return ""
	} else if err != nil {
		Response.Send(response,http.StatusInternalServerError,"Error getting the subscription",nil)
		return ""
	}
	return subscription_id
}


func (sh *SubscriptionHandler) GetExpenseId(response http.ResponseWriter,request *http.Request) (string,string){
	var expense_id string
	err := sh.DB.QueryRow(context.Background(),`SELECT expense_id
												FROM public.user_expenses
												WHERE subscription_id = $1 AND user_id = $2`,sh.Subscription_list.Subscription_id,sh.Subscription_list.User_id).Scan(&expense_id)
	if err == pgx.ErrNoRows {
		return "","No subscription"
	} else if err != nil {
		return "","Error getting expense subscription"
	}
	return expense_id,""
}

func (sh *SubscriptionHandler) DeleteSub() {
	_,err:= sh.DB.Exec(context.Background(),`DELETE
											FROM public.user_expenses
											WHERE subscription_id =	$1 AND user_id = $2`,sh.Subscription_list.Subscription_id,sh.Subscription_list.User_id)

	if err != nil {
		log.Printf("Error with delete query %v",err.Error())
		return
	}

}