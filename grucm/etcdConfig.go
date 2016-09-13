package grucm

import (
	"github.com/coreos/etcd/client"
	"github.com/elleFlorio/gru/utils"
	"golang.org/x/net/context"
	"log"
	"strings"
)

const (
	// ERRORE_SERVER_DOWN  -> The server is down or the user do not have the read permission for keys
	ERRORE_SERVER_DOWN        = "etcd cluster is unavailable or misconfigured"
	ERRORE_LOGIN              = "Insufficient credentials"
	ERRORE_CREDENZIALI        = "Credenziali non valide"
	ERRORE_ADMIN              = "does not exist"
	SUCCESS_ADMIN             = "Admin added successfully"
	SUCCESS_USER_UPDATE       = "User Updated successfully"
	SUCCESS_USER              = "User Added succesfully"
	SUCCESS_DELETE_USER       = "User Deleted succesfully"
	SUCCESS_ROLE              = "Role Added succesfully"
	SUCCESS_CHANGE_PERMISSION = "Permissions Change succesfully"
	SUCCESS_DELETE_ROLE       = "Role Deleted succesfully"
	KEY_NOT_FOUND_LOGIN       = "Key not found"
	ADD_AGENT                 = "Config Agent added succesfully"
	ADD_SERVICE               = "Config Service added succesfully"
	ADD_POLICY                = "Config Policy added succesfully"
	ADD_ANALYTICS             = "Config Analytics added succesfully"
	UPDATE_AGENT              = "Config Agent updated succesfully"
	UPDATE_SERVICE            = "Config Service updated succesfully"
	UPDATE_POLICY             = "Config Policy updated succesfully"
	UPDATE_ANALYTICS          = "Config Analytics updated succesfully"
	DELETE_CLUSTER            = "Cluster deleted succesfully"
	DELETE_AGENT              = "Config Agent deleted succesfully"
	DELETE_SERVICE            = "Config Service deleted succesfully"
	DELETE_POLICY             = "Config Policy deleted succesfully"
	DELETE_ANALYTICS          = "Config Analytics deleted succesfully"
)

// Get etcd Authentification client
func GetEtcdAuthClient(utente client.User) client.Client {

	cfg := client.Config{
		Endpoints: []string{"http://" + HostIP + ":4001"},
		Transport: client.DefaultTransport,
		Username:  utente.User,
		Password:  utente.Password,
	}

	c, err := client.New(cfg)
	if err != nil {
		log.Fatal(err)
	}
	return c
}

// Get etcd withoutAuthentification client
func GetEtcdClient() client.Client {

	cfg := client.Config{
		Endpoints: []string{"http://" + HostIP + ":4001"},
		Transport: client.DefaultTransport,
	}

	c, err := client.New(cfg)
	if err != nil {
		log.Fatal(err)
	}
	return c
}

// Login on Etcd
func EtcdLogin(utente client.User) string {

	c := GetEtcdAuthClient(utente)
	kapi := client.NewKeysAPI(c)

	// Options for loop Node of a cluster

	_, err := kapi.Get(context.Background(), "/gru/", &client.GetOptions{
		Recursive: true,
		Sort:      true,
		Quorum:    false,
	})

	if err != nil {
		log.Printf("Errore: %v", err)
		if strings.Contains(err.Error(), ERRORE_SERVER_DOWN) {
			return ERRORE_SERVER_DOWN
		}
		if strings.Contains(err.Error(), ERRORE_LOGIN) {
			return ERRORE_CREDENZIALI
		}
		if !strings.Contains(err.Error(), KEY_NOT_FOUND_LOGIN) {
			return err.Error()
		}
	}

	return ""
}

// Add an User on Etcd
func EtcdAddUser(c client.Client, utente client.User) (string, string) {

	uapi := client.NewAuthUserAPI(c)

	err := uapi.AddUser(context.Background(), utente.User, utente.Password)

	if err != nil {
		log.Printf("Errore: %v", err)
		return "", err.Error()
	}

	if utente.User == "root" {
		aapi := client.NewAuthAPI(c)
		err = aapi.Enable(context.Background())
		if err != nil {
			log.Fatal("Errore: %v", err)
		}

		return SUCCESS_ADMIN, ""
	}

	if len(utente.Roles) > 0 {
		_, err = uapi.GrantUser(context.Background(), utente.User, utente.Roles)

		if err != nil {
			log.Printf("Errore: %v", err)
			return "", err.Error()
		}
	}

	return SUCCESS_USER, ""
}

// Function that find the permissions to grant
func getGrant(begin, end string) []string {
	gr := []string{}

	if !strings.Contains(end, ",") {

		b := false

		if !strings.Contains(begin, " ") {
			if strings.Trim(end, " ") == strings.Trim(begin, " ") {
				b = true
			}
			if b == false {
				gr = append(gr, strings.Trim(end, " "))
			}
		} else {

			temp := strings.Split(begin, " ")

			for _, v := range temp {
				if strings.Trim(end, " ") == v {
					b = true
				}
			}
			if b == false {
				gr = append(gr, strings.Trim(end, " "))
			}
		}

	} else {

		tempEnd := strings.Split(end, ",")

		for _, valueEnd := range tempEnd {
			b := false

			if !strings.Contains(begin, " ") {
				if valueEnd == strings.Trim(begin, " ") {
					b = true
				}
				if b == false {
					gr = append(gr, valueEnd)
				}
			} else {

				tempBegin := strings.Split(begin, " ")

				for _, valueBegin := range tempBegin {
					if valueEnd == valueBegin {
						b = true
					}
				}
				if b == false {
					gr = append(gr, valueEnd)
				}
			}
		}
	}
	return gr
}

// Function that find the permissions to revoke
func getRevoke(begin, end string) []string {
	rr := []string{}

	if !strings.Contains(begin, " ") {

		b := false

		if !strings.Contains(end, ",") {
			if strings.Trim(begin, " ") == strings.Trim(end, " ") {
				b = true
			}
			if b == false {
				rr = append(rr, strings.Trim(begin, " "))
			}
		} else {

			temp := strings.Split(end, ",")

			for _, v := range temp {
				if strings.Trim(begin, " ") == v {
					b = true
				}
			}
			if b == false {
				rr = append(rr, strings.Trim(begin, " "))
			}
		}

	} else {

		tempBegin := strings.Split(begin, " ")

		for _, valueBegin := range tempBegin {
			b := false

			if !strings.Contains(end, ",") {
				if valueBegin == strings.Trim(end, " ") {
					b = true
				}
				if b == false {
					rr = append(rr, valueBegin)
				}
			} else {

				tempEnd := strings.Split(end, ",")

				for _, valueEnd := range tempEnd {
					if valueBegin == valueEnd {
						b = true
					}
				}
				if b == false {
					rr = append(rr, valueBegin)
				}
			}
		}
	}
	return rr
}

// Change Etcd User Password
func EtcdChangeUser(c client.Client, utente client.User, userRolesBegin, userRolesEnd string) (string, string) {

	uapi := client.NewAuthUserAPI(c)

	if utente.Password > "" {
		_, err := uapi.ChangePassword(context.Background(), utente.User, utente.Password)

		if err != nil {
			log.Printf("Errore: %v", err)
			return "", err.Error()
		}
	}

	grantRoles := getGrant(userRolesBegin, userRolesEnd)

	if len(grantRoles) > 0 {
		_, err := uapi.GrantUser(context.Background(), utente.User, grantRoles)
		if err != nil {
			log.Printf("Errore: %v", err)
			return "", err.Error()
		}
	}

	revokeRoles := getRevoke(userRolesBegin, userRolesEnd)

	if len(revokeRoles) > 0 {
		_, err := uapi.RevokeUser(context.Background(), utente.User, revokeRoles)
		if err != nil {
			log.Printf("Errore: %v", err)
			return "", err.Error()
		}
	}

	return SUCCESS_USER_UPDATE, ""
}

// Delete Etcd User
func EtcdDeleteUser(c client.Client, utente client.User) (string, string) {
	uapi := client.NewAuthUserAPI(c)

	err := uapi.RemoveUser(context.Background(), utente.User)
	if err != nil {
		log.Printf("Errore: %v", err)
		return "", err.Error()
	}

	log.Printf("Utente rimosso con successo")

	return SUCCESS_DELETE_USER, ""
}

// Add a Role on Etcd
func EtcdAddRole(c client.Client, role client.Role) (string, string) {

	rapi := client.NewAuthRoleAPI(c)

	err := rapi.AddRole(context.Background(), role.Role)

	if err != nil {
		log.Printf("Errore: %v", err)
		return "", err.Error()
	}

	_, err = rapi.GrantRoleKV(context.Background(), role.Role, role.Permissions.KV.Read, client.ReadPermission)

	if err != nil {
		log.Printf("Errore: %v", err)
		return "", err.Error()
	}

	_, err = rapi.GrantRoleKV(context.Background(), role.Role, role.Permissions.KV.Write, client.WritePermission)

	if err != nil {
		log.Printf("Errore: %v", err)
		return "", err.Error()
	}

	return SUCCESS_ROLE, ""
}

// Change Etcd Role Permissions
func EtcdChangeRolePermissions(c client.Client, role client.Role,
	roleReadPermissionsBegin, roleWritePermissionsBegin,
	roleReadPermissionsEnd, roleWritePermissionsEnd string) (string, string) {

	rapi := client.NewAuthRoleAPI(c)

	grantReadPermissions := getGrant(roleReadPermissionsBegin, roleReadPermissionsEnd)

	if len(grantReadPermissions) > 0 {
		_, err := rapi.GrantRoleKV(context.Background(), role.Role, grantReadPermissions, client.ReadPermission)

		if err != nil {
			log.Printf("Errore: %v", err)
			return "", err.Error()
		}
	}

	revokeReadPermissions := getRevoke(roleReadPermissionsBegin, roleReadPermissionsEnd)

	if len(revokeReadPermissions) > 0 {
		_, err := rapi.RevokeRoleKV(context.Background(), role.Role, revokeReadPermissions, client.ReadPermission)
		if err != nil {
			log.Printf("Errore: %v", err)
			return "", err.Error()
		}
	}

	grantWritePermissions := getGrant(roleWritePermissionsBegin, roleWritePermissionsEnd)

	if len(grantWritePermissions) > 0 {
		_, err := rapi.GrantRoleKV(context.Background(), role.Role, grantWritePermissions, client.WritePermission)

		if err != nil {
			log.Printf("Errore: %v", err)
			return "", err.Error()
		}
	}

	revokeWritePermissions := getRevoke(roleWritePermissionsBegin, roleWritePermissionsEnd)

	if len(revokeWritePermissions) > 0 {
		_, err := rapi.RevokeRoleKV(context.Background(), role.Role, revokeWritePermissions, client.WritePermission)
		if err != nil {
			log.Printf("Errore: %v", err)
			return "", err.Error()
		}
	}

	return SUCCESS_CHANGE_PERMISSION, ""

}

// Delete Etcd Role
func EtcdDeleteRole(c client.Client, role client.Role) (string, string) {
	rapi := client.NewAuthRoleAPI(c)

	etcdRevokeUserRelationshipRole(c, role)

	err := rapi.RemoveRole(context.Background(), role.Role)

	if err != nil {
		log.Printf("Errore: " + err.Error())
		return "", err.Error()
	}

	log.Printf("Ruolo rimosso con successo")

	return SUCCESS_DELETE_ROLE, ""
}

// function that revoke the role (that will be deleted) from users
func etcdRevokeUserRelationshipRole(c client.Client, role client.Role) {

	uapi := client.NewAuthUserAPI(c)

	users, err := uapi.ListUsers(context.Background())

	if err != nil {
		log.Printf(err.Error())
	} else {
		log.Printf("Utenti:\n")

		for _, value := range users {
			log.Printf("%v\n", value)

			user, err := uapi.GetUser(context.Background(), value)
			if err != nil {
				log.Printf(err.Error())
			} else {
				log.Printf("Utente: %v\n\t e Ruoli: %v", user.User, user.Roles)

				for _, v := range user.Roles {
					if v == role.Role {
						_, err = uapi.RevokeUser(context.Background(), user.User, []string{role.Role})
						if err != nil {
							log.Printf("Errore: %v", err)
						}
					}
				}
			}
		}
	}
}

// Check Etcd Admin
func CheckEtcdAdminNotExist(utente client.User) bool {

	c := GetEtcdClient()

	auth := client.NewAuthUserAPI(c)

	_, err := auth.GetUser(context.Background(), utente.User)

	if err != nil {
		if /*strings.Contains(err.Error(), ERRORE_LOGIN) ||*/
		strings.Contains(err.Error(), ERRORE_ADMIN) {
			return true
		}
	}
	return false
}

// Check if the user that trying login is ad admin
func CheckLoginAdmin(utente client.User) bool {
	c := GetEtcdAuthClient(utente)

	auth := client.NewAuthUserAPI(c)

	_, err := auth.GetUser(context.Background(), utente.User)

	if err != nil {
		return false
	}

	return true
}

// Get Config of clusters,users and roles settings of etcd instance
func GetEtcdConfig(c client.Client, adminLogged bool) ParametriClusters {

	p := ParametriClusters{}

	if adminLogged == true {
		// GET USER SETTINGS
		p.UserConfig = getConfigUsers(c)

		// GET ROLE SETTINGS
		p.RoleConfig = getConfigRoles(c)
	}

	// GET KEYS VALUE
	p.Config = getConfigKeys(c)

	return p
}

// Get User Settings on etcd instance
func getConfigUsers(c client.Client) []client.User {
	u := ParametriClusters{}

	uapi := client.NewAuthUserAPI(c)

	users, err := uapi.ListUsers(context.Background())
	if err != nil {
		log.Printf(err.Error())
	} else {
		log.Printf("Utenti:\n")

		for _, value := range users {
			log.Printf("%v\n", value)

			cu := client.User{}

			cu.User = value

			user, _ := uapi.GetUser(context.Background(), cu.User)
			if err != nil {
				log.Printf(err.Error())
			} else {
				log.Printf("Utente: %v\n\t e Ruoli: %v", user.User, user.Roles)
				cu.Roles = user.Roles
			}

			u.UserConfig = append(u.UserConfig, cu)
		}
	}

	return u.UserConfig
}

// Get Roles Settings on Etcd instance
func getConfigRoles(c client.Client) []client.Role {
	r := ParametriClusters{}

	rapi := client.NewAuthRoleAPI(c)

	role, err := rapi.ListRoles(context.Background())
	if err != nil {
		log.Printf(err.Error())
	} else {
		log.Printf("Ruoli:\n")
		for _, value := range role {
			log.Printf("%v\n", value)

			cr := client.Role{}

			cr.Role = value

			role, err := rapi.GetRole(context.Background(), cr.Role)
			if err != nil {
				log.Printf(err.Error())
			} else {
				log.Printf("Ruoli: %v\n\t e Permessi:\n Read: %v\n\t Write: %v\n\t", role.Role, role.Permissions.KV.Read, role.Permissions.KV.Write)
			}

			cr.Permissions.KV.Read = role.Permissions.KV.Read
			cr.Permissions.KV.Write = role.Permissions.KV.Write

			r.RoleConfig = append(r.RoleConfig, cr)
		}
	}
	return r.RoleConfig
}

// Get Etcd Keys on etcd instance
func getConfigKeys(c client.Client) []ClusterConfig {

	pc := ParametriClusters{}

	resp := getConfig(c, "", "gru")

	for _, v := range resp.Nodes {
		nodo := &client.Node{}
		clust := ClusterConfig{}
		serv := Servizi{}
		anal := Analitiche{}

		cluster := strings.Split(v.Key, "/")[2]
		log.Printf("Get is done. Metadata is %v\n", cluster)

		// Set Cluster-k Name
		clust.ClusterName = cluster

		// Set Cluster-k clusterID config Node
		nodo = getConfig(c, cluster, "clusterID")
		if nodo.Value > "" {
			clust.ClusterID = nodo.Value
		}

		// Set Cluster-k agent config Node
		nodo = getConfig(c, cluster, "agent")
		if nodo.Value > "" {
			clust.AgentConfig = nodo.Value
		}

		// Set Cluster-k services Node
		nodo = getConfig(c, cluster, "service")

		for _, v := range nodo.Nodes {
			serv.KeyService = strings.Split(v.Key, "/")[4]
			serv.ValueService = v.Value
			clust.ServicesConfig = append(clust.ServicesConfig, serv)
		}

		// Set Cluster-k policy config Node
		nodo = getConfig(c, cluster, "policy")
		if nodo.Value > "" {
			clust.PolicyConfig = nodo.Value
		}

		// Set Cluster-k anaytics Node
		nodo = getConfig(c, cluster, "analytic")

		for _, v := range nodo.Nodes {
			anal.KeyAnalytics = strings.Split(v.Key, "/")[4]
			anal.ValueAnalytics = v.Value
			clust.AnalyticsConfig = append(clust.AnalyticsConfig, anal)
		}

		pc.Config = append(pc.Config, clust)
	}
	return pc.Config
}

// Get Config Node for key input {gru (domain), clusterID, agent, services, policy, analytics}
func getConfig(c client.Client, nomeCluster, chiave string) *client.Node {

	nullClient := &client.Node{}

	key := ""
	switch chiave {
	case "gru":
		kapi := client.NewKeysAPI(c)

		key = "/gru/"

		// Options for loop Node of a cluster
		act := &client.GetOptions{
			Recursive: true,
			Sort:      true,
			Quorum:    false,
		}

		resp, err := kapi.Get(context.Background(), key, act)
		if err != nil {
			log.Printf(err.Error())
			return nullClient
		} else {

			log.Printf("Get is done. Metadata Keys of Gru is %q\n", resp.Node.Nodes)
			return resp.Node
		}
	case "clusterID":
		kapi := client.NewKeysAPI(c)

		key = "/gru/" + nomeCluster + "/clusterID"

		resp, err := kapi.Get(context.Background(), key, nil)
		if err != nil {
			log.Printf(err.Error())
			return nullClient
		} else {

			log.Printf("Get is done. Metadata of ClusterID is %q\n", resp.Node.Value)
			return resp.Node
		}
	case "agent":
		kapi := client.NewKeysAPI(c)

		key = "/gru/" + nomeCluster + "/config"

		resp, err := kapi.Get(context.Background(), key, nil)
		if err != nil {
			log.Printf(err.Error())
			return nullClient
		} else {

			log.Printf("Get is done. Metadata of Agent is %q\n", resp.Node.Value)
			return resp.Node
		}
	case "service":
		kapi := client.NewKeysAPI(c)

		key = "/gru/" + nomeCluster + "/services/"

		// Options for loop Node of a cluster
		act := &client.GetOptions{
			Recursive: true,
			Sort:      true,
			Quorum:    false,
		}

		resp, err := kapi.Get(context.Background(), key, act)
		if err != nil {
			log.Printf(err.Error())
			return nullClient
		} else {

			// Print all nodes of services of a cluster
			for _, v := range resp.Node.Nodes {
				log.Printf("Get is done. Key is: %v\n", v.Key)
				log.Printf("Service is: %v\n", strings.Split(v.Key, "/")[4])
				log.Printf("Value: %v\n", v.Value)
			}
			return resp.Node
		}
	case "policy":
		kapi := client.NewKeysAPI(c)

		key = "/gru/" + nomeCluster + "/policy"

		resp, err := kapi.Get(context.Background(), key, nil)
		if err != nil {
			log.Printf(err.Error())
			return nullClient
		} else {

			log.Printf("Get is done. Metadata of Policy is %q\n", resp.Node.Value)
			return resp.Node
		}
	case "analytic":
		kapi := client.NewKeysAPI(c)

		key = "/gru/" + nomeCluster + "/analytics/"

		// Options for loop Node of a cluster
		act := &client.GetOptions{
			Recursive: true,
			Sort:      true,
			Quorum:    false,
		}

		resp, err := kapi.Get(context.Background(), key, act)
		if err != nil {
			log.Printf(err.Error())
			return nullClient
		} else {

			// Print all nodes of services of a cluster
			for _, v := range resp.Node.Nodes {
				log.Printf("Get is done. Key is: %v\n", v.Key)
				log.Printf("Analytics is: %v\n", strings.Split(v.Key, "/")[4])
				log.Printf("Value: %v\n", v.Value)
			}
			return resp.Node
		}
	default:
		log.Fatal("Unrecognized configuration type")
		return nullClient
	}
	return nullClient
}

func SendConfig(c client.Client, cluster, confType, serviceName, confFile string) (string, string) {

	kapi := client.NewKeysAPI(c)

	key := ""
	successMessage := ""
	switch confType {
	case "clusterID":
		key = "/gru/" + cluster + "/clusterID"
	case "agent":
		key = "/gru/" + cluster + "/config"
		successMessage = ADD_AGENT
	case "service":
		key = "/gru/" + cluster + "/services/" + serviceName
		successMessage = ADD_SERVICE
	case "policy":
		key = "/gru/" + cluster + "/policy"
		successMessage = ADD_POLICY
	case "analytic":
		analyticsName := serviceName
		key = "/gru/" + cluster + "/analytics/" + analyticsName
		successMessage = ADD_ANALYTICS
	default:
		log.Fatal("Unrecognized configuration type")
	}

	resp, err := kapi.Set(context.Background(), key, confFile, nil)
	if err != nil {
		log.Printf(err.Error())
		return "", err.Error()
	}
	// print common key info
	log.Printf("Set is done. Metadata is %q\n", resp)

	// Set ClusterID for new cluster, after save its first configuration
	nodo := getConfig(c, cluster, "clusterID")
	if nodo.Value == "" {
		ID, genError := utils.GenerateUUID()
		if genError != nil {
			log.Printf("ClusterID Generation for cluster %v failed", cluster)
		} else {
			log.Printf("ClusterID Generation for cluster %v succesfully", cluster)
			_, _ = SendConfig(c, cluster, "clusterID", "", ID)
		}
	}

	return successMessage, ""
}

func UpdateConfig(c client.Client, cluster, confType, serviceName, confFile string) (string, string) {

	kapi := client.NewKeysAPI(c)

	key := ""
	successMessage := ""
	switch confType {
	case "agent":
		key = "/gru/" + cluster + "/config"
		successMessage = ADD_AGENT
	case "service":
		key = "/gru/" + cluster + "/services/" + serviceName
		successMessage = ADD_SERVICE
	case "policy":
		key = "/gru/" + cluster + "/policy"
		successMessage = ADD_POLICY
	case "analytic":
		analyticsName := serviceName
		key = "/gru/" + cluster + "/analytics/" + analyticsName
		successMessage = ADD_ANALYTICS
	default:
		log.Fatal("Unrecognized configuration type")
	}

	resp, err := kapi.Update(context.Background(), key, confFile)
	if err != nil {
		log.Printf(err.Error())
		return "", err.Error()
	}
	// print common key info
	log.Printf("Set is done. Metadata is %q\n", resp)

	return successMessage, ""
}

func DeleteConfig(c client.Client, cluster, confType, configName string) (string, string) {

	kapi := client.NewKeysAPI(c)

	key := ""
	successMessage := ""
	switch confType {
	case "cluster":
		key = "/gru/" + cluster
		successMessage = DELETE_CLUSTER
	case "agent":
		key = "/gru/" + cluster + "/config"
		successMessage = DELETE_AGENT
	case "services":
		key = "/gru/" + cluster + "/services/"
		successMessage = DELETE_SERVICE
	case "service":
		key = "/gru/" + cluster + "/services/" + configName
		successMessage = DELETE_SERVICE
	case "policy":
		key = "/gru/" + cluster + "/policy"
		successMessage = DELETE_POLICY
	case "analytics":
		key = "/gru/" + cluster + "/analytics/"
		successMessage = DELETE_ANALYTICS
	case "analytic":
		key = "/gru/" + cluster + "/analytics/" + configName
		successMessage = DELETE_ANALYTICS
	default:
		log.Fatal("Unrecognized configuration type")
	}

	// Options for loop Node of a cluster
	act := &client.DeleteOptions{
		Recursive: true,
	}

	resp, err := kapi.Delete(context.Background(), key, act)
	if err != nil {
		log.Printf(err.Error())
		return "", err.Error()
	}

	log.Printf("Delete is done. Metadata is %q\n", resp)

	return successMessage, ""
}
