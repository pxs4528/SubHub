package log

import (
	"os"

	"github.com/rs/zerolog"
	"github.com/rs/zerolog/log"
)

func Info(msg string) {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Info().Msg(msg)
	return
}

func Error(err error,msg string){
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Err(err).Msg(msg)
	return
}

func Warning(msg string) {
	log.Logger = log.Output(zerolog.ConsoleWriter{Out: os.Stderr})
	log.Warn().Msg(msg)
	return
}