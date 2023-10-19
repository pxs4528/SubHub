package authentication

type UserData struct {
	ID string `json:"id"`
	Name string `json:"name"`
	Email string `json:"email"`
	Password string `json:"password"`
	AuthType string `json:"authtype"`
}

type LoginData struct {
	Email string `json:"email"`
	Password string `json:"password"`
}