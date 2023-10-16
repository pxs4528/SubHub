package validation

import (
	"context"
	"encoding/json"
	"net/http"

	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type TokenCode struct {
	Token string `json:"token"`
	Code int `json:"code"`
}



func InsertCode(pool *pgxpool.Pool,code int,id string, ch chan error){
	var res int
	err := pool.QueryRow(context.Background(),`SELECT code
											FROM public.twofa
											WHERE id = $1;`,id).Scan(&res)
	if err == pgx.ErrNoRows {
		_,err = pool.Exec(context.Background(), `INSERT INTO public.twofa 
													VALUES ($1,$2,$3);`,id,code,time.Now().Add(3 * time.Minute))
	} else {
		_, err = pool.Exec(context.Background(),`UPDATE public.twofa
												SET code = $1
												WHERE id = $2;`,code,id)	
	}
	ch <- err
}


func ValidateCode(response http.ResponseWriter,request *http.Request,pool *pgxpool.Pool) {
	var reqBody TokenCode
	err := json.NewDecoder(request.Body).Decode(&reqBody)
	if err != nil {
		response.WriteHeader(http.StatusInternalServerError)
		return
	}

	id,httpCode,err := JWT(reqBody)
	if err != nil || httpCode != http.StatusAccepted{
		response.WriteHeader(httpCode)
		return
	}

	var code int
	err = pool.QueryRow(context.Background(),`SELECT code
											FROM public.twofa
											WHERE id = $1;`,id).Scan(&code)

	if err == pgx.ErrNoRows {
		response.WriteHeader(http.StatusUnauthorized)
		return
	}
	if code == reqBody.Code {
		response.WriteHeader(http.StatusAccepted)
		return
	} else if code != reqBody.Code {
		response.WriteHeader(http.StatusUnauthorized)
		return
	}

}
