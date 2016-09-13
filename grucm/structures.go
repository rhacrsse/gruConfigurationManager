package grucm

import (
	"github.com/coreos/etcd/client"
)

var HostIP string

var EtcdClient client.Client

const (
	ContentCSS = "text/css"
	ContentJS  = "text/javascript"
)

var OperazioneEseguita string
var OperazioneFallita string
var UserLogged string

var Auth struct {
	CreaAdmin                 bool
	EtcdServerStatusCode      string
	EtcdCreateAdminStatusCode string
	EtcdChangePasswordSuccess string
	EtcdChangePasswordFail    string
	CambiaPassword            string
}

type Analitiche struct {
	KeyAnalytics   string
	ValueAnalytics string
}

type Servizi struct {
	KeyService   string
	ValueService string
}

type ClusterConfig struct {
	ClusterID       string
	ClusterName     string
	AgentConfig     string
	ServicesConfig  []Servizi
	PolicyConfig    string
	AnalyticsConfig []Analitiche
}

type ParametriClusters struct {
	UserConfig         []client.User
	RoleConfig         []client.Role
	Config             []ClusterConfig
	PathCode           string
	AdminLogged        bool
	OperazioneEseguita string
	OperazioneFallita  string
	UserLogged         string
}
