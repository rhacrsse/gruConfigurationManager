package main

import (
	"github.com/Gexkill/gruConfigurationManager/grucm"
	"github.com/go-martini/martini"
	"github.com/martini-contrib/render"
	"github.com/martini-contrib/sessions"
	"os"
)

func main() {

	grucm.HostIP = os.Getenv("HostIP")

	m := martini.Classic()

	store := sessions.NewCookieStore([]byte("secret123"))
	m.Use(sessions.Sessions("my_session", store))

	m.Use(render.Renderer(render.Options{
		Extensions: []string{".html"},
	}))

	m.Group("/gruCM", func(r martini.Router) {
		m.Get("", grucm.RedirectLoginHandler)

		m.Get("/login.html", grucm.LoginHandler)
		m.Get("/authentification", grucm.AuthentificationHandler)

		m.Get("/index.html", grucm.Handler)
		m.Post("/index.html", grucm.Handler)

		m.Post("/addMode", grucm.AddModeHandler)
		m.Post("/updateMode", grucm.UpdateModeHandler)
		m.Post("/deleteMode", grucm.DeleteModeHandler)
		m.Get("/deleteMode", grucm.DeleteModeHandler)

		m.Get("/css/gruStylesheet.css", grucm.ServeResource)
		m.Get("/js/gruIndexFunction.js", grucm.ServeResource)
		m.Get("/js/gruLoginFunction.js", grucm.ServeResource)
		m.Get("/js/FileSaver.js", grucm.ServeResource)
	})

	m.RunOnAddr(":" + os.Getenv("HostPort"))
}
