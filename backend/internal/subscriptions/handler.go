package subscriptions

import (
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)


type Subscription_list struct {
	Expense_id string `json:"expense_id"`
	Subscription_id string `json:"subscription_id"`
	Name string `json:"name"`
	User_id string `json:"user_id"`
	Amount float32 `json:"amount"`
	Status string `json:"status"`
	Date time.Time `json:"date"`
	Months int `json:"months"`
}




type SubscriptionHandler struct {
	DB *pgxpool.Pool
	Subscription_list *Subscription_list
}