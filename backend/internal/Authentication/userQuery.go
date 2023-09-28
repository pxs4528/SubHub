package authentication

import (
	"context"

	"github.com/jackc/pgx/v4"
	"github.com/jackc/pgx/v4/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

func InsertUser(user UserData, pool *pgxpool.Pool) error{
	_,err := pool.Exec(context.Background(), `INSERT INTO public.users 
												VALUES ($1,$2,$3,$4,$5);`,user.ID,user.Name,user.Email,user.Password,user.AuthType)
	return err
}


func UserExist(user UserData, pool *pgxpool.Pool, ch chan bool){
	var exists int
	err := pool.QueryRow(context.Background(), `SELECT * 
												FROM public.users
												WHERE email = $1;`,user.Email).Scan(&exists)
	ch <- err == pgx.ErrNoRows
}


func HashPassword(password string) ([]byte,error){
	hpass,err := bcrypt.GenerateFromPassword([]byte(password),bcrypt.DefaultCost)
	return hpass,err
}