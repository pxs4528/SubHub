package user

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v4/pgxpool"
)

type UserData struct {
	ID string `json:"id"`
	Email string `json:"email"`
	Name string `json:"name"`
	Password string `json:"password"`
}

func GetAllUser(writer http.ResponseWriter, response *http.Request, pool *pgxpool.Pool) {
	
	var users []UserData
	// gets all users from database
	rows,err := pool.Query(context.Background(),"SELECT * FROM public.users;")
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte("Query Error"))
		return
	}

	// loops through each user and put it into users array
	for rows.Next() {
		var user UserData
		err := rows.Scan(&user.ID,&user.Email,&user.Name,&user.Password)
		if err != nil {
			writer.WriteHeader(http.StatusInternalServerError)
			writer.Write([]byte("Error Scanning Table"))
			return
		}
		users = append(users, user)
	}

	// error handling 
	if err := rows.Err(); err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte("Error with row"))
		return
	}

	// serialize users[] and puts it in userJson
	userJson, err := json.Marshal(users)
	if err != nil {
		writer.WriteHeader(http.StatusInternalServerError)
		writer.Write([]byte("Error converting Users Json"))
		return
	}
	
	
	writer.Header().Set("Content-Type", "application/json")
	writer.WriteHeader(http.StatusOK)
	writer.Write(userJson)
}