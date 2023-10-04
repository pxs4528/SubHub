package database

import (
	"context"
	"log"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	
)

/*
This func will start the connection to cockroachdb using pgx connection pool
what we are doing is getting the connection key from env and setting it to conn_str
then we want to parseconfig which basically means that set the value that are needed for connection pooling
for parseconfig, it will have values like minimum/maximum connection which will explicitely set those but we are just using default values which is good enough
then after setting up parseconfig, we call connectconfig which actually establishes the connection to the database and makes the connection pool which is then returned
most of the time when you call the func it usually returns the value you requested and and err, you always have to check err to see if we got an err, and if we did
display the error
*/


func Connect() *pgxpool.Pool{

	
	// get db conn-str from env
	conn_str := os.Getenv("CONN_STR")
	
	// configure connection pool
	config,err := pgxpool.ParseConfig(conn_str)
	if err != nil {
		log.Fatalln("Error configuring Connection Pool")
	}
	// connect to connection pool
	pool,err := pgxpool.NewWithConfig(context.Background(),config)
	if err != nil {
		log.Fatalln("Error connecting to the database")
	}
	return pool
}