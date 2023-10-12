package twofa

import (
	"fmt"
	"log"
	"os"

	"gopkg.in/gomail.v2"
)

func Send(email string,name string,code int) {

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
	m.SetBody("text/html",fmt.Sprintf(htmpBody,name,code))
	m.SetHeader("To",email)
	
	if err := gomail.NewDialer("smtp.gmail.com",587,os.Getenv("MAIL"),os.Getenv("PASSWD")).DialAndSend(m); err != nil {
		log.Printf("Fail to send email %v", err)
		return
	}
}