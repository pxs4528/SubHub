package validation

import (
    "crypto/aes"
    "crypto/cipher"
    "crypto/rand"
    "encoding/base64"
    "io"
	"os"
    "log"
)

func Encrypt(text []byte) (string) {
	block, err := aes.NewCipher([]byte(os.Getenv("Key")))
    if err != nil {
        log.Printf("Error ciphering text: %v",err)
        return ""

    }

    ciphertext := make([]byte, aes.BlockSize+len(text))
    iv := ciphertext[:aes.BlockSize]
    if _, err := io.ReadFull(rand.Reader, iv); err != nil {
        log.Printf("Error  reading cypher text: %v",err)
        return ""
    }

    stream := cipher.NewCFBEncrypter(block, iv)
    stream.XORKeyStream(ciphertext[aes.BlockSize:], text)

    return base64.StdEncoding.EncodeToString(ciphertext)
}

func Decrypt(ciphertext string) ([]byte) {
    text, err := base64.StdEncoding.DecodeString(ciphertext)
    if err != nil {
        log.Printf("Error decoding text: %v",err)
        return nil
    }

    block, err := aes.NewCipher([]byte(os.Getenv("Key")))
    if err != nil {
        log.Printf("Error getting cypher block: %v",err)
        return nil
    }

    if len(text) < aes.BlockSize {
        return nil
    }

    iv := text[:aes.BlockSize]
    text = text[aes.BlockSize:]

    stream := cipher.NewCFBDecrypter(block, iv)
    stream.XORKeyStream(text, text)

    return text
}