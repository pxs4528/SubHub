package authentication

import (
	"context"
	"fmt"
	"log"
	"math/rand"
	"os"
	"time"

	"github.com/jackc/pgx/v5"
	"golang.org/x/crypto/bcrypt"
	"gopkg.in/gomail.v2"
)


func (uh *UserHandler) InsertUser(){
	_,err := uh.DB.Exec(context.Background(),`INSERT INTO public.users
											VALUES ($1,$2,$3,$4,$5)`,uh.User.ID,uh.User.Name,uh.User.Email,uh.User.Password,uh.User.AuthType)
	if err != nil {
		log.Printf("Error occured inserting user: %v",err.Error())
		return
	}
}



func (uh *UserHandler) HashPassword() (string,error){

	hpass,err := bcrypt.GenerateFromPassword([]byte(uh.User.Password),bcrypt.DefaultCost)
	if err != nil {
		return "",err
	}
	return string(hpass),nil
}

func (uh *UserHandler) VerifyPassword() bool{
	err := bcrypt.CompareHashAndPassword([]byte(uh.User.Password),[]byte(uh.Login.Password))
	return err == nil
}


func (uh *UserHandler) ExistUser() string{
	var id string
	err := uh.DB.QueryRow(context.Background(), `SELECT id 
												FROM public.users
												WHERE email = $1;`,uh.User.Email).Scan(&id)
	if err == pgx.ErrNoRows {
		return ""
	} else {
		return id
	}
}


func RandomCode() int{
	code := rand.Intn(999999-100000+1) + 100000
	return code
}

func (uh *UserHandler) ValidateInsertCode(){
	var code int
	err := uh.DB.QueryRow(context.Background(),`SELECT code
											FROM public.twofa
											WHERE id = $1;`,uh.User.ID).Scan(&code)
	if err == pgx.ErrNoRows{
		go uh.InsertCode()
	} else {
		go uh.UpdateCode()
	}
}


func (uh *UserHandler) InsertCode() {
	_,err := uh.DB.Exec(context.Background(),`INSERT INTO public.twofa
											VALUES ($1,$2,$3);`,uh.User.ID,uh.Code.Code,time.Now().Add(3*time.Minute))
	if err != nil{
		log.Printf("Error occured inserting code: %v",err.Error())
		return
	}
}

func (uh *UserHandler) UpdateCode() {
	_,err := uh.DB.Exec(context.Background(),`UPDATE public.twofa
											SET CODE = $1
											WHERE id = $2;`,uh.Code.Code,uh.User.ID)
	if err != nil {
		log.Printf("Error occured inserting user: %v",err.Error())
		return
	}
}

func (uh *UserHandler) Send() {

	htmpBody := `
		<html>
		<body>
			<p>Hi %s,</p>
		
			<p>Your verification code is: <b>%d</b></p>

			<p>Enter this code to complete your login.</p>

			<p>Thanks,<br>SubHub Team</p>
		</body>
		</html>

	`



	m := gomail.NewMessage()
	m.SetHeader("From",os.Getenv("MAIL"))
	m.SetHeader("Subject","2FA Authentication Code")
	m.SetBody("text/html",fmt.Sprintf(htmpBody,uh.User.Name,uh.Code.Code))
	m.SetHeader("To",uh.User.Email)
	
	if err := gomail.NewDialer("smtp.gmail.com",587,os.Getenv("MAIL"),os.Getenv("PASSWD")).DialAndSend(m); err != nil {
		log.Printf("Fail to send email %v", err)
		return
	}
}



func (uh *UserHandler) GetUser() error{
	err := uh.DB.QueryRow(context.Background(),`SELECT id,name,email,password,authtype
												FROM public.users
												WHERE email = $1`,uh.Login.Email).Scan(&uh.User.ID,&uh.User.Name,&uh.User.Email,&uh.User.Password,&uh.User.AuthType)
	if err == pgx.ErrNoRows {
		return err
	}
	return nil
}
