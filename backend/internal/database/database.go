package database

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/jackc/pgx/v4"
	"github.com/joho/godotenv"
)
func Connect() {

	envErr := godotenv.Load(".env")
	if envErr != nil {
		fmt.Println("Couldn't load env file")
		os.Exit(1)
	}

	dsn := os.Getenv("DSN")
	print(dsn)

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