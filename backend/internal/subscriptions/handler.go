package subscriptions

import (
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)


type User_Subscription_List struct {
	Expense_id string `json:"expense_id"`
	Subscription_id string `json:"subscription_id"`
	Name string `json:"name"`
	User_id string `json:"user_id"`
	Amount float32 `json:"amount"`
	Status string `json:"status"`
	Date time.Time `json:"date"`
	Month int `json:"month"`
}

type Subscriptions struct {
	ID string `json:"id"`
	Subscription_name string `json:"subscription_name"`
}

type Subscription_Count struct {
	Count int `json:"count"`
	PaidTotal float32 `json:"paidtotal"`
	PendingTotal float32 `json:"pendingtotal"`
	TotalAmount float32 `json:"totalamount"`
}

type Montly_Cost struct {
	MonthlyExpenses float32 `json:"monthlyexpenses"`
	Month time.Month `json:"month"`
}

type Search_Subscription struct {
	Search string `json:"search"`
	Date time.Time `json:"date"`
}


type SubscriptionHandler struct {
	DB *pgxpool.Pool
	Subscription_list *User_Subscription_List
	Subscription_Count *Subscription_Count
	Search *Search_Subscription
}