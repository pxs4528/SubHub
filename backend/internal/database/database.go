package database

import (
	"context"
	"fmt"
	"os"

	// "github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/joho/godotenv"
)
func Connect() *pgxpool.Pool{

	envErr := godotenv.Load(".env")
	if envErr != nil {
		fmt.Println("Couldn't load env file")
		os.Exit(1)
	}

	dsn := os.Getenv("DSN")
	print(dsn)
	
	pool,err := pgxpool.Connect(context.Background(),dsn)
	
	if err != nil {
		fmt.Fprintf(os.Stderr,"Unable to connect to database: %v\n",err)
		os.Exit(1)
	}
	defer pool.Close()


	return pool

}