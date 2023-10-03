package twofa

import (
	"fmt"
	"net/smtp"
	"os"
)

func Send(email string) {

  // Sender data.
	from := os.Getenv("MAIL")
	password := os.Getenv("PASSWD")

  // Receiver email address.
	to := []string{
		email,
	}

  // smtp server configuration.
	smtpHost := "smtp.gmail.com"
	smtpPort := "587"

  // Message.
	message := []byte("HOAI CARRRRRRRRRIESSSSSSSSSSSSSSS!!!!!!!!!!!")
  // Authentication.
	auth := smtp.PlainAuth("", from, password, smtpHost)

  // Sending email.
	err := smtp.SendMail(smtpHost+":"+smtpPort, auth, from, to, message)
	if err != nil {
		fmt.Println(err)
		return
	}
	fmt.Println("Email Sent Successfully!")
}