package subscriptions

import "time"

type Subscriptions struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Amount float32 `json:"amount"`
	Date time.Time `json:"date"`
}


type GetSubscription struct {
	Name string `json:"name"`
	Amount float32 `json:"amount"`
	Date time.Time `json:"date"`
}