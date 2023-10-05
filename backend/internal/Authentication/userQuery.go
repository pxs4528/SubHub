package authentication

import (
	"context"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"golang.org/x/crypto/bcrypt"
)

/*
This query will insert the user in the database, we are passing UserData which will have ID, Name, Email, Password, and AuthType
and second parameter is the connection pool. If there was an error inserting user, it will be handled in signup.go and callback.go
*/
func InsertUser(user UserData, pool *pgxpool.Pool) error{
	_,err := pool.Exec(context.Background(), `INSERT INTO public.users 
												VALUES ($1,$2,$3,$4,$5);`,user.ID,user.Name,user.Email,user.Password,user.AuthType)
	return err
}

/*
This query will check if the user exists, we are passing UserData and connection pool, along with that we are passing channel which will
have boolean value, ch is used to call this function concurrently, after doing the query we will check if err == NoRows meaning we didn't get
anything from the query, and assign that boolean value to channel
*/
func UserExist(user UserData, pool *pgxpool.Pool, ch chan string){
	var id string
	err := pool.QueryRow(context.Background(), `SELECT id 
												FROM public.users
												WHERE email = $1;`,user.Email).Scan(&id)
	if err == pgx.ErrNoRows {
		ch <- ""
	} else {
		ch <- id
	}
}

func GetUser(loginCred LoginData, pool *pgxpool.Pool) UserData{

	var user UserData
	err := pool.QueryRow(context.Background(),`SELECT id, name, email, password, authtype
												FROM public.users
												WHERE email = $1;`,loginCred.Email).Scan(&user.ID,&user.Name,&user.Email,&user.Password,&user.AuthType)
	if err == pgx.ErrNoRows {
		return UserData{
			ID: "",
			Name: "",
			Email: "",
			Password: "",
			AuthType: "",
		}
	}
	return user
}


/*
We are hasing the user password, here by passing password as a parameter, and it will return the hash password along with error if there is any. 
We are using bcrypt for hashing password
*/
func HashPassword(password string) ([]byte,error){
	hpass,err := bcrypt.GenerateFromPassword([]byte(password),bcrypt.DefaultCost)
	return hpass,err
}

func VerifyPassword(hash []byte, password []byte) bool{
	err := bcrypt.CompareHashAndPassword(hash,password)
	return err == nil
}


