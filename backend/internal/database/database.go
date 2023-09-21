package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
	
)
func Connect() *pgxpool.Pool{

	
	// get db conn-str from env
	conn_str := os.Getenv("CONN_STR")
	
	// configure connection pool
	config,err := pgxpool.ParseConfig(conn_str)
	if err != nil {
		log.Fatalln("Error configuring Connection Pool")
	}
	// connect to connection pool
	pool,err := pgxpool.ConnectConfig(context.Background(),config)
	if err != nil {
		log.Fatalln("Error connecting to the database")
	}
	return pool
}