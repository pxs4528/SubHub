package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v4/pgxpool"
	
)
func Connect() *pgxpool.Pool{

	

	conn_str := os.Getenv("CONN_STR")
	
	config,err := pgxpool.ParseConfig(conn_str)
	config.MinConns = 5
	config.MaxConns = 15
	if err != nil {
		log.Fatalln("Error configuring Connection Pool")
	}
	pool,err := pgxpool.ConnectConfig(context.Background(),config)
	if err != nil {
		log.Fatalln("Error connecting to the database")
	}
	return pool
}