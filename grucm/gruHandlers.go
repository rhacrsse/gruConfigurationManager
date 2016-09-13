package grucm

import (
	"bufio"
	"github.com/coreos/etcd/client"
	"github.com/martini-contrib/render"
	"github.com/martini-contrib/sessions"
	"log"
	"net/http"
	"os"
	"strings"
)

func addUserHandler(r render.Render, s sessions.Session, req *http.Request) {
	userName := req.FormValue("userName")
	password := req.FormValue("userPassword")
	userRoles := req.FormValue("ruoliUtenteEnd")

	OperazioneEseguita, OperazioneFallita = EtcdAddUser(EtcdClient,
		client.User{
			User:     userName,
			Password: password,
			Roles:    strings.Split(userRoles, ","),
		})

	r.Redirect("index.html", http.StatusFound)
}

func addRoleHandler(r render.Render, s sessions.Session, req *http.Request) {
	roleName := req.FormValue("roleName")
	roleReadPermissions := req.FormValue("permessiRuoloReadEnd")
	roleWritePermissions := req.FormValue("permessiRuoloWriteEnd")

	role := client.Role{}
	role.Role = roleName
	role.Permissions.KV.Read = strings.Split(roleReadPermissions, ",")
	role.Permissions.KV.Write = strings.Split(roleWritePermissions, ",")

	OperazioneEseguita, OperazioneFallita = EtcdAddRole(EtcdClient, role)

	r.Redirect("index.html", http.StatusFound)
}

func addConfigHandler(r render.Render, s sessions.Session, req *http.Request) {
	actionObject := req.FormValue("actionObject")

	var clusterName, configJson string
	var configName string = ""

	switch actionObject {
	case "agent":
		clusterName = req.FormValue("clusterNameOfAgentToSend")
		configJson = req.FormValue("agentConfigurationString")
	case "service":
		clusterName = req.FormValue("clusterNameOfServiceToSend")
		configJson = req.FormValue("serviceConfigurationString")
		configName = req.FormValue("serviceNameToSend")
	case "policy":
		clusterName = req.FormValue("clusterNameOfPolicyToSend")
		configJson = req.FormValue("policyConfigurationString")
	case "analytic":
		clusterName = req.FormValue("clusterNameOfAnalyticsToSend")
		configJson = req.FormValue("analyticsConfigurationString")
		configName = req.FormValue("analyticsNameToSend")
	default:
		log.Fatal("Tipo configurazione non valido")
	}

	OperazioneEseguita, OperazioneFallita = SendConfig(EtcdClient, clusterName, actionObject, configName, configJson)

	s.Set("percorso", req.FormValue("pathCode"))

	opt := sessions.Options{}

	// user session valid for 30 min
	opt.MaxAge = 1500

	s.Options(opt)

	r.Redirect("index.html", http.StatusFound)
}

func AddModeHandler(r render.Render, s sessions.Session, req *http.Request) {
	actionObject := req.FormValue("actionObject")

	switch actionObject {
	case "user":
		addUserHandler(r, s, req)
	case "role":
		addRoleHandler(r, s, req)
	default:
		addConfigHandler(r, s, req)
	}
}

func updateUserHandler(r render.Render, s sessions.Session, req *http.Request) {
	userName := req.FormValue("userName")
	password := req.FormValue("userPassword")

	userRolesBegin := req.FormValue("ruoliUtenteBegin")
	userRolesEnd := req.FormValue("ruoliUtenteEnd")

	OperazioneEseguita, OperazioneFallita = EtcdChangeUser(EtcdClient,
		client.User{
			User:     userName,
			Password: password,
		},
		userRolesBegin,
		userRolesEnd,
	)

	r.Redirect("index.html", http.StatusFound)
}

func updateRoleHandler(r render.Render, s sessions.Session, req *http.Request) {
	roleName := req.FormValue("roleName")
	roleReadPermissionsBegin := req.FormValue("permessiRuoloReadBegin")
	roleWritePermissionsBegin := req.FormValue("permessiRuoloWriteBegin")
	roleReadPermissionsEnd := req.FormValue("permessiRuoloReadEnd")
	roleWritePermissionsEnd := req.FormValue("permessiRuoloWriteEnd")

	OperazioneEseguita, OperazioneFallita = EtcdChangeRolePermissions(EtcdClient,
		client.Role{
			Role: roleName,
		},
		roleReadPermissionsBegin, roleWritePermissionsBegin,
		roleReadPermissionsEnd, roleWritePermissionsEnd)

	r.Redirect("index.html", http.StatusFound)
}

func updateConfigHandler(r render.Render, s sessions.Session, req *http.Request) {
	actionObject := req.FormValue("actionObject")

	clusterName := ""
	configJson := ""
	configName := ""

	switch actionObject {
	case "agent":
		clusterName = req.FormValue("clusterNameOfAgentToSend")
		configJson = req.FormValue("agentConfigurationString")
	case "service":
		clusterName = req.FormValue("clusterNameOfServiceToSend")
		configJson = req.FormValue("serviceConfigurationString")
		configName = req.FormValue("serviceNameToSend")
	case "policy":
		clusterName = req.FormValue("clusterNameOfPolicyToSend")
		configJson = req.FormValue("policyConfigurationString")
	case "analytic":
		clusterName = req.FormValue("clusterNameOfAnalyticsToSend")
		configJson = req.FormValue("analyticsConfigurationString")
		configName = req.FormValue("analyticsNameToSend")
	default:
		log.Fatal("Tipo configurazione non valido")
	}

	OperazioneEseguita, OperazioneFallita = UpdateConfig(EtcdClient, clusterName, actionObject, configName, configJson)

	s.Set("percorso", req.FormValue("pathCode"))

	opt := sessions.Options{}

	// user session valid for 30 min
	opt.MaxAge = 1500

	s.Options(opt)

	r.Redirect("index.html", http.StatusFound)
}

func UpdateModeHandler(r render.Render, s sessions.Session, req *http.Request) {
	actionObject := req.FormValue("actionObject")

	switch actionObject {
	case "user":
		updateUserHandler(r, s, req)
	case "role":
		updateRoleHandler(r, s, req)
	default:
		updateConfigHandler(r, s, req)
	}
}

func deleteUserHandler(r render.Render, s sessions.Session, req *http.Request) {
	userName := req.FormValue("userName")

	OperazioneEseguita, OperazioneFallita = EtcdDeleteUser(EtcdClient,
		client.User{
			User: userName,
		})

	r.Redirect("index.html", http.StatusFound)
}

func deleteRoleHandler(r render.Render, s sessions.Session, req *http.Request) {
	roleName := req.FormValue("roleName")

	OperazioneEseguita, OperazioneFallita = EtcdDeleteRole(EtcdClient,
		client.Role{
			Role: roleName,
		})

	r.Redirect("index.html", http.StatusFound)
}

func deleteConfigHandler(r render.Render, s sessions.Session, req *http.Request) {
	actionObject := req.FormValue("actionObject")

	clusterName := ""
	configName := ""

	switch actionObject {
	case "cluster":
		clusterName = req.FormValue("clusterNameToDelete")
	case "agent":
		clusterName = req.FormValue("clusterNameOfAgentToDelete")
	case "service":
		clusterName = req.FormValue("clusterNameOfServiceToDelete")
		configName = req.FormValue("serviceNameToDelete")
	case "policy":
		clusterName = req.FormValue("clusterNameOfPolicyToDelete")
	case "analytic":
		clusterName = req.FormValue("clusterNameOfAnalyticsToDelete")
		configName = req.FormValue("analyticsNameToDelete")
	default:
		log.Fatal("Tipo configurazione non valido")
	}

	OperazioneEseguita, OperazioneFallita = DeleteConfig(EtcdClient, clusterName, actionObject, configName)

	s.Set("percorso", req.FormValue("pathCode"))

	opt := sessions.Options{}

	// user session valid for 30 min
	opt.MaxAge = 1500

	s.Options(opt)

	r.Redirect("index.html", http.StatusFound)
}

func DeleteModeHandler(r render.Render, s sessions.Session, req *http.Request) {
	actionObject := req.FormValue("actionObject")

	switch actionObject {
	case "user":
		deleteUserHandler(r, s, req)
	case "role":
		deleteRoleHandler(r, s, req)
	default:
		deleteConfigHandler(r, s, req)
	}
}

func RedirectLoginHandler(r render.Render) {
	r.Redirect("/gruCM/login.html", http.StatusFound)
}

func LoginHandler(r render.Render, s sessions.Session, req *http.Request) {
	filename := "login"

	Auth.CreaAdmin = CheckEtcdAdminNotExist(client.User{
		User: "root",
	})

	if Auth.CreaAdmin == true {
		// Etcd è stato appena avviato per la prima volta e
		// dovremo far creare all'utente un'username e una password
		// per l'amministratore di sistema

		r.HTML(http.StatusOK, filename, Auth)
		// Auth.CreaAdmin = false
	} else {
		Auth.CambiaPassword = req.FormValue("cambiaPassword")
		if Auth.CambiaPassword == "true" {
			r.HTML(http.StatusOK, filename, Auth)

			Auth.CambiaPassword = ""
		} else {
			if v := s.Get("sessioneattiva"); v == true {
				r.Redirect("index.html", http.StatusFound)
			}
			r.HTML(http.StatusOK, filename, Auth)

			Auth.EtcdCreateAdminStatusCode = ""
			Auth.EtcdChangePasswordSuccess = ""
			Auth.EtcdChangePasswordFail = ""
			Auth.EtcdServerStatusCode = ""
		}
	}
}

func AuthentificationHandler(r render.Render, s sessions.Session, req *http.Request) {

	param := req.FormValue("submit")
	if param == "Crea Amministratore" {
		u := client.User{
			User:     req.FormValue("username"),
			Password: req.FormValue("password"),
			Roles:    []string{},
		}

		EtcdClient = GetEtcdAuthClient(u)
		Auth.EtcdCreateAdminStatusCode, _ = EtcdAddUser(EtcdClient, u)

		r.Redirect("/gruCM/login.html", http.StatusFound)
	} else if param == "Cambia Password" {
		u := client.User{
			User:     req.FormValue("username"),
			Password: req.FormValue("password"),
			Roles:    []string{},
		}
		npw := req.FormValue("nuovaPassword")

		EtcdClient = GetEtcdAuthClient(u)

		u.Password = npw
		Auth.EtcdChangePasswordSuccess,
			Auth.EtcdChangePasswordFail = EtcdChangeUser(EtcdClient, u, "", "")

		r.Redirect("/gruCM/login.html", http.StatusFound)
	} else if param == "Logout" {

		opt := sessions.Options{}
		opt.MaxAge = 0
		s.Options(opt)
		s.Clear()

		r.Redirect("/gruCM/login.html", http.StatusFound)
	} else if param == "Login" {

		tempUser := req.FormValue("username")
		tempPass := req.FormValue("password")

		u := client.User{
			User:     tempUser,
			Password: tempPass,
		}

		EtcdClient = GetEtcdAuthClient(u)
		errorMessage := EtcdLogin(u)

		if errorMessage > "" {
			Auth.EtcdServerStatusCode = errorMessage

			if v := s.Get("sessioneattiva"); v == true {
				opt := sessions.Options{}
				opt.MaxAge = 0
				s.Options(opt)
				s.Clear()
			}

			r.Redirect("/gruCM/login.html", http.StatusFound)
		} else {
			Auth.EtcdServerStatusCode = ""

			UserLogged = u.User

			s.Set("sessioneattiva", true)

			// Call function for check if user have admin role
			adminUser := CheckLoginAdmin(u)

			if adminUser == true {
				s.Set("adminlogged", true)
			} else {
				s.Set("adminlogged", false)
			}

			opt := sessions.Options{}

			// user session valid for 30 min
			opt.MaxAge = 1500

			s.Options(opt)

			r.Redirect("index.html", http.StatusFound)

		}
	}
}

// function for manage web server request/response
func Handler(r render.Render, s sessions.Session) {

	if v := s.Get("sessioneattiva"); v != true {
		r.Redirect("/gruCM/login.html", http.StatusFound)
	} else {

		filename := "index"

		al := s.Get("adminlogged").(bool)

		p := GetEtcdConfig(EtcdClient, al)

		if OperazioneFallita > "" {
			p.PathCode = ""
		} else if pc, ok := s.Get("percorso").(string); pc > "" && ok == true {
			p.PathCode = pc
		}

		// Check if an admin is logged in
		p.AdminLogged = al

		p.OperazioneEseguita = OperazioneEseguita
		p.OperazioneFallita = OperazioneFallita
		p.UserLogged = UserLogged

		r.HTML(http.StatusOK, filename, p)

		OperazioneEseguita = ""
		OperazioneFallita = ""
	}
}

func ServeResource(r render.Render, res http.ResponseWriter, req *http.Request) {
	arrayURL := strings.Split(req.URL.Path, "/")
	path := arrayURL[len(arrayURL)-1]

	var dir string
	if strings.HasSuffix(path, ".css") {
		dir = "css"
	} else if strings.HasSuffix(path, ".js") {
		dir = "js"
	}

	CSSJS(http.StatusOK, dir, res, req)
}

// function that hold js and css contents
func CSSJS(status int, directory string, res http.ResponseWriter, req *http.Request) {
	arrayURL := strings.Split(req.URL.Path, "/")

	path := arrayURL[len(arrayURL)-1]

	var content string
	if strings.HasSuffix(path, ".css") {
		content = ContentCSS
	} else if strings.HasSuffix(path, ".js") {
		content = ContentJS
	} else {
		content = render.ContentText
	}

	if directory > "" {
		path = directory + "/" + path
	}

	f, err := os.Open(path)

	if err == nil {
		defer f.Close()
		res.Header().Add(render.ContentType, content)
		br := bufio.NewReader(f)
		br.WriteTo(res)
	} else {
		res.WriteHeader(http.StatusNotFound)
	}
}
