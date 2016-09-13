# Gru Configuration Manager
Configuration Manager for clusters configurations of Gru automatic management of Docker containers 

For pdf tecnichal documentation [Docs](https://github.com/Gexkill/gruConfigurationManager/blob/master/Documentation/ProgettoFinale_AngeloClaudioRe_758172.pdf)

### RUN WEB APP DOWNLOADING DOCKER HUB IMAGE
First install [Docker](https://docs.docker.com/engine/installation/#installation)

Export env variable of your HostIP
~~~
export HostIP = ...
~~~

and env variable of your IP Port listening
~~~
export HostPort = ...
~~~

RUN on cmd 
~~~
docker run --name=grucm -p ${HostPort}:${HostPort} -e "HostIP=${HostIP}" -e "HostPort=${HostPort}" --rm gexkill/grucm:webapp
~~~

or if you don't want delete the container evertytime
~~~
docker run --name=grucm -p ${HostPort}:${HostPort} -e "HostIP=${HostIP}" -e "HostPort=${HostPort}" gexkill/grucm:webapp
~~~

and when you run gruCM
~~~
docker start grucm
~~~

For the first of etcd's configuration instance there are two possibilities

####1) Using integrate graphic interface of gruCM for creating root user and other users and roles

####2) Using built-in etcd command line interface etcdctl
~~~
docker run --rm gexkill/grucm:cmd --endpoint="http://${HostIP}:2379,http://${HostIP}:4001" + {commands for interaction with etcd}
~~~
For documentation for the commands
[v2 Auth and Security](https://coreos.com/etcd/docs/latest/auth_api.html)
[Authentication Guide](https://coreos.com/etcd/docs/latest/authentication.html)

### RUN WEB APP DOWNLOADING GITHUB REPOSITORY
For documentation
[Gru](https://github.com/elleFlorio/gru)
<br>
<br>
Before installing Go and setting up your [GOPATH](https://golang.org/doc/code.html#GOPATH)

The web app is focused on Martini package for the backend,
Martini-contrib/render package for the frontend
and etcd package for storing data.

For documentation:
[martini-contrib/render](https://github.com/martini-contrib/render)

[Martini web server](https://github.com/go-martini/martini)

[Etcd github rep](https://github.com/coreos/etcd)

[Etdc docs](https://coreos.com/etcd/)

Install the Gru Configuration Manager package
~~~
go get github.com/Gexkill/gruConfigurationManager
~~~

run Etcd client
~~~
cd GOPATH$/bin
./etcd 
~~~
where GOPATH$ is the directory where you installed etcd 

Finally run your server:
~~~
cd GOPATH$/src/github.com/Gexkill/gruConfigurationManager
go run main.go 
~~~

You will now have the webserver running on 
~~~
localhost:8080/gruCM/login.html
~~~
or 
~~~
localhost:8080/gruCM
~~~

For the first of etcd's configuration instance there are two possibilities

####1) Using integrate graphic interface of gruCM for creating root user and other users and roles

####2) Using built-in etcd command line interface etcdctl
~~~
go get github.com/coreos/etcd/etcdctl
go install github.com/coreos/etcd/etcdctl
etcdctl + {commands for interaction with etcd}
~~~
For documentation for the commands
[v2 Auth and Security](https://coreos.com/etcd/docs/latest/auth_api.html)
[Authentication Guide](https://coreos.com/etcd/docs/latest/authentication.html)
