package validation

import (
	"backend/internal/Response"
	"context"
	"encoding/json"
	"log"
	"net/http"

	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TokenCode struct {
	Code int `json:"code"`
}



func InsertCode(pool *pgxpool.Pool,code int,id string){
	var res int
	err := pool.QueryRow(context.Background(),`SELECT code
											FROM public.twofa
											WHERE id = $1;`,id).Scan(&res) 
	if err == pgx.ErrNoRows {
		_,err = pool.Exec(context.Background(), `INSERT INTO public.twofa 
													VALUES ($1,$2,$3);`,id,code,time.Now().Add(3 * time.Minute))
		if err != nil {
			log.Printf("Error inserting the code %v",err)
			return
		}
	} else{
		_, err = pool.Exec(context.Background(),`UPDATE public.twofa
												SET code = $1
												WHERE id = $2;`,code,id)	
		if err != nil {
			log.Printf("Error updating the code %v",err)
			return
		}
	}
}


func ValidateCode(response http.ResponseWriter,request *http.Request,pool *pgxpool.Pool) {
	var reqBody TokenCode
	err := json.NewDecoder(request.Body).Decode(&reqBody)
	if err != nil {
		Response.Send(response,http.StatusInternalServerError,err.Error(),nil)
		return
	}
	cookie,err := request.Cookie("token")
	if err != nil {
		http.Redirect(response,request,"http://localhost:3000/login",http.StatusNotFound)
		return
	}

	id,httpCode,err := JWT(cookie.Value)
	if err != nil || httpCode != http.StatusAccepted{
		Response.Send(response,httpCode,err.Error(),nil)
		return
	}

	var code int
	err = pool.QueryRow(context.Background(),`SELECT code
											FROM public.twofa
											WHERE id = $1;`,id).Scan(&code)

	if err == pgx.ErrNoRows {
		Response.Send(response,http.StatusUnauthorized,"Code Invalid",nil)
		response.WriteHeader(http.StatusUnauthorized)
		return
	}
	if code == reqBody.Code {
		Response.Send(response,http.StatusAccepted,"Code Accepted",nil)
		return
	} else if code != reqBody.Code {
		Response.Send(response,http.StatusUnauthorized,"Code Invalid",nil)
		return
	}

}
