package database

import (
	"context"
	"fmt"
	"log"
	"time"

	"github.com/jackc/pgx/v4"
)
func connect_to_db() {
	dsn := ""
	ctx := context.Background()
	conn,err := pgx.Connect(ctx,dsn)
	defer conn.Close(context.Background())

	if err != nil {
		log.Fatal("Couldn't connect to database")
	}

	var now time.Time

	err = conn.QueryRow(ctx,"SELECT NOW()").Scan(&now)
	if err != nil {
		log.Fatal("Failed to query")
	}

	fmt.Println(now)
}