// GLOBAL VARIABLES
var serviceRemote = "";
var portaGuest = "";
var porteHost = "";
var stringaCommand = [];
var doppioApice = '"';
var sendAction = "";
var stringaAnalytics = "";
/*
  INSERT / DELETE TABLE DATA

  If the cells of a row are blank, then i'm
  adding a new record, as soon as i select a row or focus on it
  (i will mark this behaviour with a global variable "marcatoreNuovaRiga"

  If i change the value of the cells of a row to blank
  and if before their values wasn't blank when i select or focus on a cell,
  then i delete the row.

  If i fill a valid value in the 2 cells of a row and 
  if before their values was blank when i select or focus on a cell,
  then i append a row to the table
  else i don't add nothing
  
  When i loop the table, i start from the first row (row[1]), because
  row[0] contains the columns header (<th>)
  and i stop the performing with row = rows.length -1 because
  the last row is empty to allow the insert of 
  a possible new row
  
  Possibles marcatoreNuovaRiga's values:
    - true : i'm adding a new row 
    - false: i'm changing an existence row
             after call setMarcatoreRiga(tableID, classPrefix, indexSuffix)
    - error: i'm changing an existence row
             without call setMarcatoreRiga(tableID, classPrefix, indexSuffix)


*/
var marcatoreNuovaRiga = "";

// Pretty function for enable focus on input text or radio button table
var focusTable = function (event) {
  var d = document.getElementsByClassName(event.target.className);
  d[1].focus();
  d[0].checked = true;
}

// Function that clean the content of target table
var cleanTableContents = function (tableID) {
  var table = document.getElementById(tableID);
  if (table.rows.length > 2) {
    for (var index = table.rows.length-1;index > 1;index--){
        table.deleteRow(index);
      }
  }
}

// Function that set setMarcatoreRiga global variable
// that it mark the content of a target cell 
var setMarcatoreRiga = function(tableID, classPrefix, indexSuffix) {
    keyCellID = classPrefix + indexSuffix;
  if(document.getElementsByClassName(keyCellID)[1].value > " ") {
    marcatoreNuovaRiga = "true";
  } else {
    marcatoreNuovaRiga = "false";
  }
}

// Function the set the insert and the
// delete of new row of a table
var gestisciRiga = function(tableID, classPrefix, indexSuffix) {
    index = indexSuffix;
    keyCellID = classPrefix + indexSuffix;
  if (marcatoreNuovaRiga == "true" || marcatoreNuovaRiga == "error"){
    if(document.getElementsByClassName(keyCellID)[1].value > " ") {

    } else {
      // delete the row
      var table = document.getElementById(tableID);
      table.deleteRow(index);
      fixIndexTable(table, tableID, classPrefix);
    }

  } else {
    // marcatoreNuovaRiga == "false"
    if(document.getElementsByClassName(keyCellID)[1].value > " ") {
      // insert a new row
      var table = document.getElementById(tableID);

      var newIndex = parseFloat(index) + 1;
      var row = table.insertRow(newIndex);

      var keyCell = row.insertCell(0);

      if (tableID == "tableOfPermissionsRole") {
        var input = document.createElement("input");
        input.type = "radio";
        input.name = "permission";
        input.checked = true;
        input.className = classPrefix + newIndex;
        input.setAttribute("onclick","focusTable(event)");
        keyCell.appendChild(input);

        input = document.createElement("input");
        input.type = "text";
        input.className = classPrefix + newIndex;
        input.setAttribute("onfocus","setMarcatoreRiga("
          + doppioApice + tableID + doppioApice
          + ","
          + doppioApice + classPrefix + doppioApice
          + ","
          + newIndex
          +")");
        input.setAttribute("onclick","focusTable(event);setMarcatoreRiga("
          + doppioApice + tableID + doppioApice
          + ","
          + doppioApice + classPrefix + doppioApice
          + ","
          + newIndex
          +")");
        input.setAttribute("onmouseover","setMarcatoreRiga("
          + doppioApice + tableID + doppioApice
          + ","
          + doppioApice + classPrefix + doppioApice
          + ","
          + newIndex
          +")");
        input.setAttribute("onchange","gestisciRiga("
          + doppioApice + tableID + doppioApice
          + ","
          + doppioApice + classPrefix + doppioApice
          + ","
          + newIndex
          +")");
        keyCell.appendChild(input);

        input = document.createElement("input");
        input.type = "checkbox";

        // Read is mandatory
        input.setAttribute("checked",true);
        input.setAttribute("disabled",true);
        input.className = classPrefix + newIndex;
        input.setAttribute("onclick","focusTable(event)");
        keyCell.appendChild(input);

        var text = "read";
        keyCell.innerHTML = keyCell.innerHTML + text;


        input = document.createElement("input");
        input.type = "checkbox";
        input.checked = false;
        input.className = classPrefix + newIndex;
        input.setAttribute("onclick","focusTable(event)");
        keyCell.appendChild(input);

        text = "write";
        keyCell.innerHTML = keyCell.innerHTML + text;

      } else {

        var input = document.createElement("input");
        input.type = "text";
        input.className = classPrefix + newIndex;
        input.setAttribute("onfocus","setMarcatoreRiga("
          +doppioApice+tableID+doppioApice
          +","
          +doppioApice+classPrefix+doppioApice
          +","
          +newIndex
          +")");
        input.setAttribute("onclick","setMarcatoreRiga("
          +doppioApice+tableID+doppioApice
          +","
          +doppioApice+classPrefix+doppioApice
          +","
          +newIndex
          +")");
        input.setAttribute("onmouseover","setMarcatoreRiga("
          +doppioApice+tableID+doppioApice
          +","
          +doppioApice+classPrefix+doppioApice
          +","
          +newIndex
          +")");
        input.setAttribute("onchange","gestisciRiga("
          +doppioApice+tableID+doppioApice
          +","
          +doppioApice+classPrefix+doppioApice
          +","
          +newIndex
          +")");
        keyCell.className = input.className;
        keyCell.appendChild(input);

        if (tableID == "tableOfEnvironmentVariables" 
          || tableID == "tableOfServiceConstraints"){
            var valueCell = row.insertCell(1);
            input = document.createElement("input");
            input.type = "text";
            input.className = classPrefix + newIndex;
            valueCell.appendChild(input);
        }
      }

      marcatoreNuovaRiga = "error";
    }
  }
}

// Function that fixes the indexes
// of the attributes of the rows of
// a table when a row is deleted
var fixIndexTable = function(table, tableID, classPrefix) {

  for (var r in table.rows){
    if (r > 0){
      if (tableID == "tableOfPermissionsRole") {

        var keyCellID = table.rows[r].cells[0].childNodes[1].className;

        document.getElementsByClassName(keyCellID)[3].setAttribute("onclick","focusTable(event)");
        document.getElementsByClassName(keyCellID)[3].className = classPrefix+r;

        document.getElementsByClassName(keyCellID)[2].setAttribute("onclick","focusTable(event)");
        document.getElementsByClassName(keyCellID)[2].className = classPrefix+r;

        document.getElementsByClassName(keyCellID)[1].setAttribute("onfocus",
          "setMarcatoreRiga("+doppioApice+tableID+doppioApice+","
          +doppioApice+classPrefix+doppioApice+","
          +r
          +")");
        document.getElementsByClassName(keyCellID)[1].setAttribute("onclick",
          "focusTable(event);setMarcatoreRiga("+doppioApice+tableID+doppioApice+","
          +doppioApice+classPrefix+doppioApice+","
          +r
          +")");
        document.getElementsByClassName(keyCellID)[1].setAttribute("onmouseover",
          "setMarcatoreRiga("+doppioApice+tableID+doppioApice+","
          +doppioApice+classPrefix+doppioApice+","
          +r
          +")");
        document.getElementsByClassName(keyCellID)[1].setAttribute("onchange",
          "gestisciRiga("+doppioApice+tableID+doppioApice+","
          +doppioApice+classPrefix+doppioApice+","
          +r
          +")");
        document.getElementsByClassName(keyCellID)[1].className = classPrefix+r;

        document.getElementsByClassName(keyCellID)[0].setAttribute("onclick","focusTable(event)");
        document.getElementsByClassName(keyCellID)[0].className = classPrefix+r;

      } else {

        var keyCellID = table.rows[r].cells[0].className;

        if (tableID == "tableOfEnvironmentVariables" 
          || tableID == "tableOfServiceConstraints"){
          document.getElementsByClassName(keyCellID)[2].className = classPrefix+r;
        }

        document.getElementsByClassName(keyCellID)[1].setAttribute("onfocus",
          "setMarcatoreRiga("+doppioApice+tableID+doppioApice+","
          +doppioApice+classPrefix+doppioApice+","
          +r
          +")");
        document.getElementsByClassName(keyCellID)[1].setAttribute("onclick",
          "setMarcatoreRiga("+doppioApice+tableID+doppioApice+","
          +doppioApice+classPrefix+doppioApice+","
          +r
          +")");
        document.getElementsByClassName(keyCellID)[1].setAttribute("onmouseover",
          "setMarcatoreRiga("+doppioApice+tableID+doppioApice+","
          +doppioApice+classPrefix+doppioApice+","
          +r
          +")");
        document.getElementsByClassName(keyCellID)[1].setAttribute("onchange",
          "gestisciRiga("+doppioApice+tableID+doppioApice+","
          +doppioApice+classPrefix+doppioApice+","
          +r
          +")");
        document.getElementsByClassName(keyCellID)[1].className = classPrefix+r;

        table.rows[r].cells[0].className = classPrefix+r;
      }
    }
  }
}

// Function that print the Json config (key:value)
var looppa = function(mezzo) {
  for (var property in mezzo){
    if(typeof mezzo[property] == "object"){
      console.log(mezzo[property]);
      looppa(mezzo[property])
    }else{
      console.log(property + " : " + mezzo[property]);
    }
  }
}

// Read User Settings
var readUserSettings = function(user){

  var userRoles = document.getElementsByClassName("userRoles");
  for (index in userRoles) {
    if (userRoles.hasOwnProperty(index)) {
      userRoles[index].checked = false;
      userRoles[index].removeAttribute("disabled");
    }
  }

  if (user == "Add User") {
    document.getElementById("userName").value = "";
    document.getElementById("userName").removeAttribute("readonly");
    document.getElementById("userPassword").value = "";
    document.getElementById("userConfermaPassword").value = "";

    document.getElementById("userDeleteButton").style.display = "none";
    sendAction = "addMode";

  } else {
    var userName = document.getElementById("userName");
    userName.value = user;
    userName.setAttribute("readonly",true);
    document.getElementById("userPassword").value = "";
    document.getElementById("userConfermaPassword").value = "";

    var relationshipRoles = document.getElementById(user + "Roles").value;
    relationshipRoles = relationshipRoles.split("[")[1];
    relationshipRoles = relationshipRoles.split("]")[0];
      
    var checkIfArray = false;
    if (relationshipRoles.includes(" ")) {
      relationshipRoles = relationshipRoles.split(" ")
      checkIfArray = true;
    }
    
    var userRoles = document.getElementsByClassName("userRoles");
    for (index in userRoles) {
      if (userRoles.hasOwnProperty(index)) {
        if (user == "root") {
          userRoles[index].setAttribute("disabled",true);
        }
        if (checkIfArray == false) {
          if (relationshipRoles.trim() == userRoles[index].value) {           
            userRoles[index].checked = true;
          }
        } else {
          for (i in relationshipRoles) {
            if (relationshipRoles[i] == userRoles[index].value) {
              userRoles[index].checked = true;
            }
          }
        }
      }
    }

    if (user == "root") {
      document.getElementById("userDeleteButton").style.display = "none";
    } else {
      document.getElementById("userDeleteButton").style.display = "inline";
    }
    sendAction = "updateMode";
  }
  document.getElementById("userSendButton").style.display = "inline";
}

// Read Role Settings
var readRoleSettings = function(role){

  // Clean table Of Permissions Role
  cleanTableContents("tableOfPermissionsRole")

  document.getElementsByClassName("permission1")[1].value = "";
  document.getElementsByClassName("permission1")[3].checked = false;

  document.getElementsByClassName("permission1")[0].removeAttribute("disabled");
  document.getElementsByClassName("permission1")[1].removeAttribute("disabled");
  document.getElementsByClassName("permission1")[3].removeAttribute("disabled");

  if (role == "Add Role") {
    document.getElementById("roleName").value = "";
    document.getElementById("roleName").removeAttribute("readonly");

    document.getElementById("roleSendButton").style.display = "inline";
    document.getElementById("roleDeleteButton").style.display = "none";
    sendAction = "addMode";
  } else {
    var roleName = document.getElementById("roleName");
    roleName.value = role;
    roleName.setAttribute("readonly",true);

    var read = document.getElementById(role + "Read").value;
    read = read.split("[")[1];
    read = read.split("]")[0];
    read = read.split(" ");

    var write = document.getElementById(role + "Write").value;
    write = write.split("[")[1];
    write = write.split("]")[0];
    write = write.split(" ");

    var num = 1;
    for (var r in read) {
      
      if (read[r] > "") {
        document.getElementsByClassName("permission" + num)[1].value = read[r];
        for (var w in write) {
          if (write[w] == read[r]) {
            document.getElementsByClassName("permission" + num)[3].checked = true;
          }
        }
        marcatoreNuovaRiga = false;
        gestisciRiga("tableOfPermissionsRole","permission",num);

        num++;
      }
    }

    for (var w in write) {
      var found = false;

      if (write[w] > "") {
        for (var r in read) {
          if (write[w] == read[r]) {
            found = true;
          }
        }

        if (found == false) {
          marcatoreNuovaRiga = false;
          document.getElementsByClassName("permission" + num)[1].value = write[w];
          document.getElementsByClassName("permission" + num)[3].checked = true;
          gestisciRiga("tableOfPermissionsRole","permission",num);
          num++;
        } 
      }
    }

    if (role == "root") {
      document.getElementById("roleSendButton").style.display = "none";
      document.getElementById("roleDeleteButton").style.display = "none";

      document.getElementsByClassName("permission1")[0].setAttribute("disabled",true);
      document.getElementsByClassName("permission1")[1].setAttribute("disabled",true);
      document.getElementsByClassName("permission1")[3].setAttribute("disabled",true);
      cleanTableContents("tableOfPermissionsRole")
    
    }  else {
      document.getElementById("roleSendButton").style.display = "inline";
      document.getElementById("roleDeleteButton").style.display = "inline";
    }

    sendAction = "updateMode";
  }
}

// Function that load the Json agent configuration
// (saved on etcd) in the HTML page
var readAgentConfig = function(idAgente) {
  document.getElementById("clusterNameOfAgentToSend").value = "";
  document.getElementById("agentConfigurationString").value = "";
  document.getElementById("clusterNameOfAgentToDelete").value = "";

  clearAgentErrors();

  var a = document.getElementById(idAgente);

  if (idAgente == "" || a == null){
    // I'm adding a new agent for 
    // a target cluster
    // I set to blank the fields
    document.getElementById("agentDaemonUrl").value = "";
    document.getElementById("agentDaemonTimeout").value = "";
    document.getElementById("agentAutonomicLoopTimeInterval").value = "";
    document.getElementById("agentAutonomicPlannerStrategy").value = "Select PlannerStrategy";
    document.getElementById("agentAutonomicEnableLogReading").checked = true; 
    document.getElementById("agentCommunicationLoopTimeInterval").value = "";
    document.getElementById("agentCommunicationMaxFriends").value = "";
    document.getElementById("agentStorageService").value = "Select StorageService";
    document.getElementById("agentMetricService").value = "Select MetricService";

    document.getElementById("influxdbMetricService").style.display = "none";
    document.getElementById("agentUrl").value = "";
    document.getElementById("agentDbName").value = "";
    document.getElementById("agentUsername").value = "";
    document.getElementById("agentPassword").value = "";
    document.getElementById("agentAppRoot").value = "";
    document.getElementById("agentTTL").value = "";

    document.getElementById("exportAgentJson").style.display = "none";

    sendAction = "addMode";
    document.getElementById("sendAgentConfig").value = "send agent configuration";
    document.getElementById("deleteAgentConfig").type = "hidden";
  } else {
    // Load the values of selected agent
    var m = [];
    m = JSON.parse(document.getElementById(idAgente).value);
    document.getElementById("agentDaemonUrl").value = m.Docker.DaemonUrl;
    document.getElementById("agentDaemonTimeout").value = m.Docker.DaemonTimeout;
    document.getElementById("agentAutonomicLoopTimeInterval").value = m.Autonomic.LoopTimeInterval;
    document.getElementById("agentAutonomicPlannerStrategy").value = m.Autonomic.PlannerStrategy;  
    document.getElementById("agentAutonomicEnableLogReading").checked = m.Autonomic.EnableLogReading;
    document.getElementById("agentCommunicationLoopTimeInterval").value = m.Communication.LoopTimeInterval;
    document.getElementById("agentCommunicationMaxFriends").value = m.Communication.MaxFriends;
    document.getElementById("agentStorageService").value = m.Storage.StorageService;
    document.getElementById("agentMetricService").value = m.Metric.MetricService;
    switch(document.getElementById("agentMetricService").value){
      case "influxdb":
        document.getElementById("influxdbMetricService").style.display = "inline";
        document.getElementById("agentUrl").value = m.Metric.Configuration.Url;
        document.getElementById("agentDbName").value = m.Metric.Configuration.DbName;
        document.getElementById("agentUsername").value = m.Metric.Configuration.Username;
        document.getElementById("agentPassword").value = m.Metric.Configuration.Password;
      break;
      default:
        alert("Nothing metric service selected");
      break;
    }
    document.getElementById("agentAppRoot").value = m.Discovery.AppRoot;
    document.getElementById("agentTTL").value = m.Discovery.TTL;

    console.log(m.Docker.DaemonUrl);
    console.log(m.Docker.DaemonTimeout);
    console.log(m.Autonomic.LoopTimeInterval);
    console.log(m.Autonomic.PlannerStrategy);
    console.log(m.Autonomic.EnableLogReading);
    console.log(m.Communication.LoopTimeInterval);
    console.log(m.Communication.MaxFriends);
    console.log(m.Storage.StorageService);
    console.log(m.Metric.MetricService);
    looppa(m.Metric.Configuration);
    console.log(m.Discovery.AppRoot);
    console.log(m.Discovery.TTL);

    document.getElementById("exportAgentJson").style.display = "inline";

    sendAction = "updateMode";
    document.getElementById("sendAgentConfig").value = "update agent configuration";
    document.getElementById("deleteAgentConfig").type = "submit";
  }
}

// Function that load the correct fields to the 
// related metric service 
var selectAgentMetricService = function() {
  switch(document.getElementById("agentMetricService").value){
    case "influxdb":
      document.getElementById("influxdbMetricService").style.display = "inline";
    break;
    default:
      document.getElementById("influxdbMetricService").style.display = "none";
      document.getElementById("agentUrl").value = "";
      document.getElementById("agentDbName").value = "";
      document.getElementById("agentUsername").value = "";
      document.getElementById("agentPassword").value = "";
    break;
  }
}

// Function that load the Json service configuration
// (saved on etcd) in the HTML page
var readServiceConfig = function(nomeServizio, idServizio) {
  document.getElementById("clusterNameOfServiceToSend").value = "";
  document.getElementById("serviceNameToSend").value = "";
  document.getElementById("serviceConfigurationString").value = "";
  document.getElementById("clusterNameOfServiceToDelete").value = "";
  document.getElementById("serviceNameToDelete").value = "";
    
  // Clean table Of Environment Variables
  cleanTableContents("tableOfEnvironmentVariables")

  // Clean table Of Service Constraints
  cleanTableContents("tableOfServiceConstraints")

  var cluster = document.getElementById("dropbtnCluster").value;

  var analyticsList = document.getElementsByClassName("analyticsCheckbox");

  for (var index in analyticsList) {
    if (analyticsList.hasOwnProperty(index)) {
      document.getElementsByClassName("analyticsCheckbox")[index].style.display="none";
    }
  }

  var listaAnalitiche = document.getElementById("serviceAnalytics"+cluster);

  if (listaAnalitiche){
    document.getElementById("serviceAnalytics"+cluster).style.display="block";
    for (var i1 in listaAnalitiche.childNodes){
        var res = i1 % 2;
        if (res == 1){
          listaAnalitiche.childNodes[i1].childNodes[1].checked = false;
        }
    }
  } else {
    document.getElementById("serviceAnalytics").style.display="block";
  }

  clearServiceErrors();

  document.getElementsByClassName("tServCon1")[1].value = "";
  document.getElementsByClassName("tServCon1")[2].value = "";
  document.getElementsByClassName("tEnv1")[1].value = "";
  document.getElementsByClassName("tEnv1")[2].value = "";

  if (nomeServizio == "Add Service"){
    // I'm adding a new service for a target cluster
    // The fields will be empty
    document.getElementById("serviceName").value = "";
    document.getElementById("serviceType").value = "";
    document.getElementById("serviceImage").value = "";
    serviceRemote = "";
    portaGuest = "";
    porteHost = "";
    stringaCommand = [];
    document.getElementById("serviceDiscoveryPort").value = "";
    document.getElementById("serviceCpuNumber").value = "";
    document.getElementById("serviceStopTimeout").value = "";
    document.getElementById("servicePortaGuest").value = "";
    document.getElementById("servicePorteHostFrom").value = "";
    document.getElementById("servicePorteHostTo").value = "";
    document.getElementById("serviceCmd").value = "";

    document.getElementById("exportServiceJson").style.display = "none";

    sendAction = "addMode";
    document.getElementById("sendServiceConfig").value = "send service configuration";
    document.getElementById("deleteServiceConfig").type = "hidden";
  }else {
    // I Load the values of the selected service
    var m = [];
    m = JSON.parse(document.getElementById(idServizio).value);

    document.getElementById("serviceName").value = m.Name;
    document.getElementById("serviceType").value = m.Type;
    document.getElementById("serviceImage").value = m.Image;
    document.getElementById("serviceDiscoveryPort").value = m.DiscoveryPort;
    if (listaAnalitiche){
      for (var i1 in listaAnalitiche.childNodes){
          var res = i1 % 2;
          if (res == 1){
              for (var index in m["Analytics"]){
                  if (m["Analytics"][index] == listaAnalitiche.childNodes[i1].childNodes[1].value) {
                      listaAnalitiche.childNodes[i1].childNodes[1].checked = true;
                  }
              }
          }
      }
    }

    var num = 1;
    for (var envVar in m.Constraints){
      marcatoreNuovaRiga = false;
      document.getElementsByClassName("tServCon"+num)[1].value = envVar;
      gestisciRiga("tableOfServiceConstraints","tServCon",num);
      document.getElementsByClassName("tServCon"+num)[2].value = m.Constraints[envVar];
      num++;
    }
    document.getElementById("serviceCpuNumber").value = m.Configuration.cpunumber;
    document.getElementById("serviceStopTimeout").value = m.Configuration.StopTimeout;
    num = 1;
    for (var envVar in m.Configuration.Env){
      marcatoreNuovaRiga = false;
      document.getElementsByClassName("tEnv"+num)[1].value = envVar;
      gestisciRiga("tableOfEnvironmentVariables","tEnv",num);
      document.getElementsByClassName("tEnv"+num)[2].value = m.Configuration.Env[envVar];
      num++;
    }
    for (var porte in m.Configuration.Ports){
      document.getElementById("servicePortaGuest").value = porte;
      var c = m.Configuration.Ports[porte];
      var res = c.split("-");
      document.getElementById("servicePorteHostFrom").value = res[0];
      document.getElementById("servicePorteHostTo").value = res[1];
    } 
    var str = "";
    for (var command in m.Configuration.Cmd){
      if (command == m.Configuration.Cmd.length-1) {
        str = str + m.Configuration.Cmd[command];
      } else {
        str = str + m.Configuration.Cmd[command] + " ";
      }
    }
    document.getElementById("serviceCmd").value = str;

    console.log(m.Name);
    console.log(m.Type);
    console.log(m.Image);
    console.log(m.DiscoveryPort);
    looppa(m.Analytics);
    looppa(m.Constraints);
    console.log(m.Configuration.cpunumber);
    console.log(m.Configuration.StopTimeout);
    looppa(m.Configuration.Env);
    looppa(m.Configuration.Ports);
    looppa(m.Configuration.Cmd);

    document.getElementById("exportServiceJson").style.display = "inline";

    sendAction = "updateMode";
    document.getElementById("sendServiceConfig").value = "update service configuration";
    document.getElementById("deleteServiceConfig").type = "submit";
  }
}

// Function that load the Json policy configuration
// (saved on etcd) in the HTML page
var readPolicyConfig = function(idPolitica) {
  document.getElementById("clusterNameOfPolicyToSend").value = "";
  document.getElementById("policyConfigurationString").value = "";
  document.getElementById("clusterNameOfPolicyToDelete").value = "";

  var cluster = document.getElementById("dropbtnCluster").value;


  var analyticsList = document.getElementsByClassName("analyticsCheckbox");

  for (var index in analyticsList) {
    if (analyticsList.hasOwnProperty(index)) {
      document.getElementsByClassName("analyticsCheckbox")[index].style.display="none";
    }
  }

  var listaPolScaleIn = document.getElementById("policyScaleInAnalytics"+cluster);

  if (listaPolScaleIn){
    document.getElementById("policyScaleInAnalytics"+cluster).style.display="block";
    for (var i1 in listaPolScaleIn.childNodes){
        var res = i1 % 2;
        if (res == 1){
            listaPolScaleIn.childNodes[i1].childNodes[1].checked = false;
        }
    }
  } else {
    document.getElementById("policyScaleInAnalytics").style.display="block";
  }

  var listaPolScaleOut = document.getElementById("policyScaleOutAnalytics"+cluster);

  if (listaPolScaleOut){
    document.getElementById("policyScaleOutAnalytics"+cluster).style.display="block";
    for (var i1 in listaPolScaleOut.childNodes){
        var res = i1 % 2;
        if (res == 1){
            listaPolScaleOut.childNodes[i1].childNodes[1].checked = false;
        }
    }
  } else {
    document.getElementById("policyScaleOutAnalytics").style.display="block";
  }

  var listaPolScaleSwap = document.getElementById("policySwapAnalytics"+cluster);

  if (listaPolScaleSwap){
    document.getElementById("policySwapAnalytics"+cluster).style.display="block";
    for (var i1 in listaPolScaleSwap.childNodes){
        var res = i1 % 2;
        if (res == 1){
            listaPolScaleSwap.childNodes[i1].childNodes[1].checked = false;
        }
    }
  } else {
    document.getElementById("policySwapAnalytics").style.display="block";
  }

  clearPolicyErrors();

  var a = document.getElementById(idPolitica);

  if (idPolitica == "" || a == null){
    // I'm adding a new policy for a target cluster
    // The fields will be empty

    document.getElementById("policyScaleInEnable").checked = true;
    document.getElementById("policyScaleInThreshold").value = "";
    document.getElementById("policyScaleInMetrics").value = "Select Metrics";
    document.getElementById("policyScaleOutEnable").checked = true;
    document.getElementById("policyScaleOutThreshold").value = "";
    document.getElementById("policyScaleOutMetrics").value = "Select Metrics";
    document.getElementById("policySwapEnable").checked = true;
    document.getElementById("policySwapThreshold").value = "";
    document.getElementById("policySwapMetrics").value = "Select Metrics";

    document.getElementById("exportPolicyJson").style.display = "none";

    sendAction = "addMode";
    document.getElementById("sendPolicyConfig").value = "send policy configuration";
    document.getElementById("deletePolicyConfig").type = "hidden";
  } else {
    // I load the values of selected policy  
    var m = [];
    m = JSON.parse(document.getElementById(idPolitica).value);

    document.getElementById("policyScaleInEnable").checked = m.Scalein.Enable;
    document.getElementById("policyScaleInThreshold").value = m.Scalein.Threshold;
    document.getElementById("policyScaleInMetrics").value = m.Scalein.Metrics[0];
    if (listaPolScaleIn){
      for (var i1 in listaPolScaleIn.childNodes){
          var res = i1 % 2;
          if (res == 1){
              for (var index in m["Scalein"]["Analytics"]){
                  if (m["Scalein"]["Analytics"][index] == listaPolScaleIn.childNodes[i1].childNodes[1].value) {
                      listaPolScaleIn.childNodes[i1].childNodes[1].checked = true;
                  }
              }
          }
      }
    }
    document.getElementById("policyScaleOutEnable").checked = m.Scaleout.Enable;
    document.getElementById("policyScaleOutThreshold").value = m.Scaleout.Threshold;
    document.getElementById("policyScaleOutMetrics").value = m.Scaleout.Metrics[0];
    if (listaPolScaleOut){
      for (var i1 in listaPolScaleOut.childNodes){
          var res = i1 % 2;
          if (res == 1){
              for (var index in m["Scaleout"]["Analytics"]){
                  if (m["Scaleout"]["Analytics"][index] == listaPolScaleOut.childNodes[i1].childNodes[1].value) {
                      listaPolScaleOut.childNodes[i1].childNodes[1].checked = true;
                  }
              }
          }
      }
    }
    document.getElementById("policySwapEnable").checked = m.Swap.Enable;
    document.getElementById("policySwapThreshold").value = m.Swap.Threshold;
    document.getElementById("policySwapMetrics").value = m.Swap.Metrics[0];
    if (listaPolScaleSwap){
      for (var i1 in listaPolScaleSwap.childNodes){
          var res = i1 % 2;
          if (res == 1){
              for (var index in m["Swap"]["Analytics"]){
                  if (m["Swap"]["Analytics"][index] == listaPolScaleSwap.childNodes[i1].childNodes[1].value) {
                      listaPolScaleSwap.childNodes[i1].childNodes[1].checked = true;
                  }
              }
          }
      }
    }

    console.log(m.Scalein.Enable);
    console.log(m.Scalein.Threshold);
    looppa(m.Scalein.Metrics);
    looppa(m.Scalein.Analytics);
    console.log(m.Scaleout.Enable);
    console.log(m.Scaleout.Threshold);
    looppa(m.Scaleout.Metrics);
    looppa(m.Scaleout.Analytics);
    console.log(m.Swap.Enable);
    console.log(m.Swap.Threshold);
    looppa(m.Swap.Metrics);
    looppa(m.Swap.Analytics);

    document.getElementById("exportPolicyJson").style.display = "inline";

    sendAction = "updateMode";
    document.getElementById("sendPolicyConfig").value = "update policy configuration";
    document.getElementById("deletePolicyConfig").type = "submit";
  }    
}


// Function that load the Json analytics configuration
// (saved on etcd) in the HTML page
var readAnalyticsConfig = function(nomeAnalitica, idAnalitica) {
  document.getElementById("clusterNameOfAnalyticsToSend").value = "";
  document.getElementById("analyticsNameToSend").value = "";
  document.getElementById("analyticsConfigurationString").value = "";
  document.getElementById("clusterNameOfAnalyticsToDelete").value = "";
  document.getElementById("analyticsNameToDelete").value = "";
  
  // Clean table Of AnalitycsMetrics
  cleanTableContents("tableOfAnalitycsMetrics")

  // Clean table Of Analytics Constraints
  cleanTableContents("tableOfAnalyticsConstraints")

  clearAnalyticsErrors();

  if (nomeAnalitica == "Add Analytics"){
    // I'm adding a new analytics for a target cluster
    // The fields will be empty
    document.getElementById("analyticsName").value = "";
    document.getElementById("analyticsExpr").value = "";

    document.getElementsByClassName("tMet1")[1].value = "";

    document.getElementsByClassName("tCon1")[1].value = "";

    document.getElementById("exportAnalyticsJson").style.display = "none";

    sendAction = "addMode";
    document.getElementById("sendAnalyticsConfig").value = "send analytics configuration";
    document.getElementById("deleteAnalyticsConfig").type = "hidden";
  }else {
    // I load the values of selected analytics
    var m = [];
    m = JSON.parse(document.getElementById(idAnalitica).value);

    document.getElementById("analyticsName").value = m.Name;
    document.getElementById("analyticsExpr").value = m.Expr;

    var num = 1;
    for (var metVar in m.Metrics){
      marcatoreNuovaRiga = false;
      document.getElementsByClassName("tMet"+num)[1].value = m.Metrics[metVar];
      gestisciRiga("tableOfAnalitycsMetrics","tMet",num);
      num++;
    }

    num = 1;
    for (var conVar in m.Constraints){
      marcatoreNuovaRiga = false;
      document.getElementsByClassName("tCon"+num)[1].value = m.Constraints[conVar];
      gestisciRiga("tableOfAnalyticsConstraints","tCon",num);
      num++;
    }

    console.log(m.Name);
    console.log(m.Expr);
    looppa(m.Metrics);
    looppa(m.Constraints);

    document.getElementById("exportAnalyticsJson").style.display = "inline";

    sendAction = "updateMode";
    document.getElementById("sendAnalyticsConfig").value = "update analytics configuration";
    document.getElementById("deleteAnalyticsConfig").type = "submit";
  }
}

// Function that create the Json to add on etcd 
// retrieving the data form HTML input forms for the agent
var writeAgentConfig = function() {
  var m = [];
  switch(document.getElementById("agentMetricService").value){
    case "influxdb":
      m = {
        "Docker": {
          "DaemonUrl":document.getElementById("agentDaemonUrl").value,
          "DaemonTimeout":parseFloat( document.getElementById("agentDaemonTimeout").value)
        },
        "Autonomic": {
          "LoopTimeInterval":parseFloat(document.getElementById("agentAutonomicLoopTimeInterval").value),
          "PlannerStrategy":document.getElementById("agentAutonomicPlannerStrategy").value,
          "EnableLogReading":document.getElementById("agentAutonomicEnableLogReading").checked
        },
        "Communication":{
          "LoopTimeInterval":parseFloat(document.getElementById("agentCommunicationLoopTimeInterval").value),
          "MaxFriends":parseFloat(document.getElementById("agentCommunicationMaxFriends").value)
        },
        "Storage": {
          "StorageService":document.getElementById("agentStorageService").value
        },
        "Metric": {
          "MetricService":document.getElementById("agentMetricService").value,
          "Configuration": {
            "Url":document.getElementById("agentUrl").value,
            "DbName": document.getElementById("agentDbName").value,
            "Username": document.getElementById("agentUsername").value,
            "Password": document.getElementById("agentPassword").value
          }
        },
        "Discovery": {
          "AppRoot":document.getElementById("agentAppRoot").value,
          "TTL":parseFloat(document.getElementById("agentTTL").value)
        }
      };
      break;
    default:
        alert("Nothing metric service selected");
      break;
  }

  var b = JSON.stringify(m,null,"\t");

  document.getElementById("clusterNameOfAgentToSend").value = document.getElementById("dropbtnCluster").value;
  document.getElementById("agentConfigurationString").value = b;
}

// Function that create the Json to add on etcd 
// retrieving the data form HTML input forms for the services
var writeServiceConfig = function() {

  var m = {
      "Name":document.getElementById("serviceName").value,
      "Type":document.getElementById("serviceType").value,
      "Image":document.getElementById("serviceImage").value,
      "Remote":serviceRemote,
      "DiscoveryPort":document.getElementById("serviceDiscoveryPort").value,
      "Analytics": [],
      "Constraints": {},
      "Configuration":{
          "cpunumber":parseFloat(document.getElementById("serviceCpuNumber").value),
          "StopTimeout":parseFloat(document.getElementById("serviceStopTimeout").value),
          "Env": {},
          "Ports":{
              "50100":"50100-50104"
          },
          "Cmd": []
      }
  };

  var cluster = document.getElementById("dropbtnCluster").value;

  var listaAnalitiche = document.getElementById("serviceAnalytics"+cluster);
  if (listaAnalitiche){
    var index = 0;
    for (var i1 in listaAnalitiche.childNodes){
      var res = i1 % 2;
      if (res == 1){
        if (listaAnalitiche.childNodes[i1].childNodes[1].checked == true) {
          m["Analytics"][index] = listaAnalitiche.childNodes[i1].childNodes[1].value;
          index++;
        }
      }
    }
  }

  var conMap = {};

  m["Constraints"] = createMap("tableOfServiceConstraints",conMap,2);

  var envMap = {};

  m["Configuration"]["Env"] = createMap("tableOfEnvironmentVariables",envMap,2);

  var porteMap = {};
  porteMap[portaGuest] = porteHost;
  m["Configuration"]["Ports"] = porteMap;

  m["Configuration"]["Cmd"] = stringaCommand;

  document.getElementById("clusterNameOfServiceToSend").value = cluster;
  document.getElementById("serviceNameToSend").value = document.getElementById("serviceName").value;
  document.getElementById("serviceConfigurationString").value = JSON.stringify(m,null,"\t");
}

// Function that create the Json to add on etcd 
// retrieving the data form HTML input forms for the policy
var writePolicyConfig = function() {
  var m = {
      "Scalein": {
          "Enable": document.getElementById("policyScaleInEnable").checked,
          "Threshold": parseFloat(document.getElementById("policyScaleInThreshold").value),
          "Metrics": [
              document.getElementById("policyScaleInMetrics").value
          ],
          "Analytics": []
      },
      "Scaleout": {
          "Enable": document.getElementById("policyScaleOutEnable").checked,
          "Threshold": parseFloat(document.getElementById("policyScaleOutThreshold").value),
          "Metrics": [
              document.getElementById("policyScaleOutMetrics").value
          ],
          "Analytics": []
      },
      "Swap": {
          "Enable": document.getElementById("policySwapEnable").checked,
          "Threshold": parseFloat(document.getElementById("policySwapThreshold").value),
          "Metrics": [
              document.getElementById("policySwapMetrics").value
          ],
          "Analytics": []
      }
  };

  var cluster = document.getElementById("dropbtnCluster").value;

  var listaPolScaleIn = document.getElementById("policyScaleInAnalytics"+cluster);
  if (listaPolScaleIn){ 
    var index = 0;
    for (var i1 in listaPolScaleIn.childNodes){
      var res = i1 % 2;
      if (res == 1){
        if (listaPolScaleIn.childNodes[i1].childNodes[1].checked == true) {
          m["Scalein"]["Analytics"][index] = listaPolScaleIn.childNodes[i1].childNodes[1].value;
          index++;
        }
      }
    }
  }

  var listaPolScaleOut = document.getElementById("policyScaleOutAnalytics"+cluster);
  if (listaPolScaleOut){
    var index = 0;
    for (var i1 in listaPolScaleOut.childNodes){
      var res = i1 % 2;
      if (res == 1){
        if (listaPolScaleOut.childNodes[i1].childNodes[1].checked == true) {
          m["Scaleout"]["Analytics"][index] = listaPolScaleOut.childNodes[i1].childNodes[1].value;
          index++;
        }
      }
    }
  }

  var listaPolScaleSwap = document.getElementById("policySwapAnalytics"+cluster);
  if (listaPolScaleSwap){
    var index = 0;
    for (var i1 in listaPolScaleSwap.childNodes){
      var res = i1 % 2;
      if (res == 1){
        if (listaPolScaleSwap.childNodes[i1].childNodes[1].checked == true) {
          m["Swap"]["Analytics"][index] = listaPolScaleSwap.childNodes[i1].childNodes[1].value;
          index++;
        }
      }
    }
  }

  var b = JSON.stringify(m,null,"\t");

  document.getElementById("clusterNameOfPolicyToSend").value = cluster;
  document.getElementById("policyConfigurationString").value = b;
}

// Function that create the Json to add on etcd 
// retrieving the data form HTML input forms for the analytics
var writeAnalyticsConfig = function() {

  var m = {
      "Name": document.getElementById("analyticsName").value,
      "Expr": document.getElementById("analyticsExpr").value,
      "Metrics": [
          "execution_time"
      ],
      "Constraints": [
          "MAX_RESP_TIME",
          "MIN_RESP_TIME"
      ]
  };


  var metrics = [];
  m["Metrics"] = createMap("tableOfAnalitycsMetrics",metrics,1);

  var contraints = [];
  m["Constraints"] = createMap("tableOfAnalyticsConstraints",contraints,1);

  document.getElementById("clusterNameOfAnalyticsToSend").value = document.getElementById("dropbtnCluster").value;
  document.getElementById("analyticsNameToSend").value = document.getElementById("analyticsName").value;
  document.getElementById("analyticsConfigurationString").value = JSON.stringify(m,null,"\t");
}

// Function that create the link for delete a cluster
var deleteCluster = function(){

  var v = document.getElementById("dropbtnCluster");

  document.getElementById("dropDeleteBtn").href =
    document.getElementById("dropDeleteBtn").href
    + "?"
    + "actionObject=cluster"
    + "&"
    + "clusterNameToDelete="
    + v.value;
}

// Function that set a start path 
// after it was addes a configuration on etcd
// It returns a success message for configuration
// as soon as added
window.onload = function(){
  var temp = document.getElementsByClassName("pathCode")[0].value;
  if (temp > " ") { 
    location.href = temp; 

    var l = temp.split("#")[1].split("/").length;

    var clusterID = document.getElementById("dropbtnCluster");
    var typeID = document.getElementById("dropbtnConfigType");
    clusterID.value = temp.split("#")[1].split("/")[0];
    typeID.textContent = temp.split("#")[1].split("/")[1];

    document.getElementById("dropDeleteBtn").style.display = "inline";

    // Show ClusterID
    if (document.getElementById(clusterID.value + "ID")) {
      document.getElementById("valueOfClusterID").innerHTML = "ClusterID : "
        + document.getElementById(clusterID.value + "ID").value;
    }

    if (l == 3 || l == 2) {
      document.getElementById("dropdownConfigType").style.display = "block";

      var a1 = document.getElementsByClassName("configType");

      for (var index in a1) {
        if (a1.hasOwnProperty(index)) {
          var a2;
          if (a1[index].href.split("#")[1].split("/")[1]) {
            a2 = a1[index].href.split("#")[1].split("/")[1];
          } else {
            a2 = a1[index].href.split("#")[1];
          }
          a1[index].href = "#" + clusterID.value
            +  "/" +  a2;
        }
      }

      if (typeID.textContent == "service" || typeID.textContent == "analytics") {
        var a1;
        if (document.getElementsByClassName(typeID.textContent + clusterID.value).length > 0) {
          a1 = document.getElementsByClassName(typeID.textContent + clusterID.value);
        } else {
          a1 = document.getElementsByClassName(typeID.textContent);
        }

        for (var index in a1) {
          if (a1.hasOwnProperty(index)) {
            var a2;
            if (a1[index].href.split("#")[1].split("/")[2]) {
              a2 = a1[index].href.split("#")[1].split("/")[2];
            } else {
              a2 = a1[index].href.split("#")[1];
            }

            a1[index].href = "#" + clusterID.value
              + "/" + typeID.textContent + "/" + a2;
          }
        } 
      }
      
      if(l == 3) {
        if (typeID.textContent == "service") {
          var serviceID = document.getElementById("dropbtnService" + clusterID.value);
          serviceID.textContent = temp.split("#")[1].split("/")[2];
          document.getElementById("dropdownService" + clusterID.value).style.display = "block";
          document.getElementById("serviceConfigFields").style.display="inline";
          readServiceConfig(serviceID.textContent, serviceID.textContent + clusterID.value);
        } else if (typeID.textContent == "analytics"){
          var analyticsID = document.getElementById("dropbtnAnalytics" + clusterID.value);
          analyticsID.textContent = temp.split("#")[1].split("/")[2];
          document.getElementById("dropdownAnalytics" + clusterID.value).style.display = "block";
          document.getElementById("analyticsConfigFields").style.display="inline";
          readAnalyticsConfig(analyticsID.textContent, analyticsID.textContent + clusterID.value);
        }
      } else if (l == 2){
        if (typeID.textContent == "agent") {
          document.getElementById("agentConfigFields").style.display="inline";
          readAgentConfig("config" + clusterID.value);
        } else if (typeID.textContent == "service"){
          if (document.getElementById("dropdownService" + clusterID.value)) {
            document.getElementById("dropdownService" + clusterID.value).style.display = "block";
          } else {
            document.getElementById("dropdownService").style.display = "block";
          }
        } else if (typeID.textContent == "policy"){
          document.getElementById("policyConfigFields").style.display="inline";
          readPolicyConfig("policy" + clusterID.value);
        } else if (typeID.textContent == "analytics"){
          if (document.getElementById("dropdownAnalytics" + clusterID.value)) {
            document.getElementById("dropdownAnalytics" + clusterID.value).style.display = "block";
          } else {
            document.getElementById("dropdownAnalytics").style.display = "block";
          }
        }
      }
    }
  }
}

// Function that set the dropdown contents
window.onclick = function(event) {

  // Get the target cluster selected value
  var cluster = document.getElementById("dropbtnCluster").value;

  if (event.target.matches('.cluster')) {
    var mario = document.getElementsByClassName("cluster");
    for (var i in mario){
      if (mario.hasOwnProperty(i)) {
        if (event.target.textContent.trim() == mario[i].textContent) {

          if (cluster != event.target.textContent) {
            readAgentConfig("");
            document.getElementById("agentConfigFields").style.display="none";
            readServiceConfig("Add Service",null);
            document.getElementById("serviceConfigFields").style.display="none";
            readPolicyConfig("");
            document.getElementById("policyConfigFields").style.display="none";
            readAnalyticsConfig("Add Analytics",null);
            document.getElementById("analyticsConfigFields").style.display="none";
          }

          if (event.target.textContent.trim() == "Add Cluster")
          {   
              insertNewCluster();
              cluster = event.target.textContent;
              document.getElementById("dropDeleteBtn").style.display = "none";
          }else {
            if (cluster){
              document.getElementById("dropbtnCluster").value = event.target.textContent;
              cluster = event.target.textContent;

              document.getElementById("dropDeleteBtn").style.display = "inline";
            }
            else {
              document.getElementById("dropDeleteBtn").style.display = "none";
            }
          } 
        }
      }
    }

    if (event.target.textContent != "Add Cluster"
      && event.target.textContent != "Select a Cluster"
      && event.target.textContent > "") {

      var a1 = document.getElementsByClassName("configType");

      for (var index in a1) {
        if (a1.hasOwnProperty(index)) {
          var a2;
          if (a1[index].href.split("#")[1].split("/")[1]) {
            a2 = a1[index].href.split("#")[1].split("/")[1];
          } else {
            a2 = a1[index].href.split("#")[1];
          }
          a1[index].href = "#" + event.target.textContent 
            +  "/" +  a2;
        }
      }

      var type = document.getElementById("dropbtnConfigType").textContent;

      if (type != "Select a Type") {
        var a1 = document.getElementsByClassName("cluster");

        for (var index in a1) {
          if (a1.hasOwnProperty(index)) {
            if(a1[index].id != "dropDeleteBtn") {
              var a2;
              if (a1[index].href.split("#")[1].split("/")[0]) {
                a2 = a1[index].href.split("#")[1].split("/")[0];
              } else {
                a2 = a1[index].href.split("#")[1];
              }
              a1[index].href = "#" + a2
                +  "/" +  type;
            }
          }
        }
      }

      if (type == "service" || type == "analytics") {
        var a1;
        if (document.getElementsByClassName(type + event.target.textContent).length > 0) {
          a1 = document.getElementsByClassName(type + event.target.textContent);
        } else {
          a1 = document.getElementsByClassName(type);
        }

        for (var index in a1) {
          if (a1.hasOwnProperty(index)) {
            var a2;
            if (a1[index].href.split("#")[1].split("/")[2]) {
              a2 = a1[index].href.split("#")[1].split("/")[2];
            } else {
              a2 = a1[index].href.split("#")[1];
            }

            a1[index].href = "#" + event.target.textContent
              + "/" + type + "/" + a2;
          }
        } 
      }  


      // Show Config Type Dropdown menu
      if (document.getElementById("dropdownConfigType").style.display != "block") {
        document.getElementById("dropdownConfigType").style.display = "block";
      }

      // Show ClusterID if exist for cluster-k
      if (document.getElementById(event.target.textContent + "ID")) {
        document.getElementById("valueOfClusterID").innerHTML = "ClusterID : "
          + document.getElementById(event.target.textContent + "ID").value;
      } else {
        document.getElementById("valueOfClusterID").innerHTML = "ClusterID : ";
      }

    } else {
      document.getElementById("valueOfClusterID").innerHTML = "ClusterID : ";
    }
  }

  // Set the visualization of configType dropdown menu
  if (event.target.matches('.configType')) {
    var mario = document.getElementsByClassName("configType");
    for (var i in mario){
      if (mario.hasOwnProperty(i)) {
        if (event.target.textContent.trim() == mario[i].textContent) {
          document.getElementById("dropbtnConfigType").textContent = event.target.textContent;
        }
      }
    }
    if (cluster != "Add Cluster"
      && cluster != "Select a Cluster"
      && cluster > "") {
      if (event.target.textContent == "service" || event.target.textContent == "analytics") {
        var a1;
        if (document.getElementsByClassName(event.target.textContent+cluster).length > 0) {
          a1 = document.getElementsByClassName(event.target.textContent+cluster);
        } else {
          a1 = document.getElementsByClassName(event.target.textContent);
        }

        for (var index in a1) {
          if (a1.hasOwnProperty(index)) {
            var a2;
            if (a1[index].href.split("#")[1].split("/")[2]) {
              a2 = a1[index].href.split("#")[1].split("/")[2];
            } else {
              a2 = a1[index].href.split("#")[1];
            }

            a1[index].href = "#" + event.target.href.split("#")[1] 
              +  "/" +  a2;
          }
        }
      }
    }
  }

  // Set the visualization of agent, services, policy and analytics dropdown menu
  if ( cluster != "Add Cluster" && cluster != "Select a Cluster" && cluster > ""
    && document.getElementById("dropbtnConfigType").textContent != "Select a Type"){

      var bottoni = document.getElementsByClassName("dropdown-toggle");

      if (document.getElementById("dropbtnConfigType").textContent == "agent"){

        // Loop the show only the agent button
        // with the ID set before
        for (var index in bottoni){
          var s = bottoni[index];

          if (s.id) {
            var div = document.getElementById(s.id).parentNode.id;
            if (s.id != "dropbtnCluster" 
              && s.id != "dropbtnConfigType") {
                document.getElementById(s.id).style.display = "none";
                document.getElementById(div).style.display = "none";
            }
          }
        }

        if (event.target.textContent == "agent"
          || document.getElementById("dropbtnConfigType").textContent == "agent"
          && event.target.matches('.cluster')) {
          document.getElementById("agentConfigFields").style.display="inline";

          readAgentConfig("config" + cluster);
        }

        document.getElementById("serviceConfigFields").style.display="none";
        document.getElementById("policyConfigFields").style.display="none";
        document.getElementById("analyticsConfigFields").style.display="none";

      } else if(document.getElementById("dropbtnConfigType").textContent == "service"){
        var identifier = "";

        // Get the button ID of the services of a cluster
        for (var index in bottoni){
          var g = bottoni[index];
          if (g.id) {
            if (g.id != "dropbtnCluster" 
              && g.id != "dropbtnConfigType") {
              if (g.id == "dropbtnService" + cluster) {
                identifier = g.id;
              }
            }
          }
        }

        // Check that the services button exist
        // If this control does not have success
        // the cluster do not have services loaded on etcd
        // so i will visualize the default service button
        // for the insert of first service of the cluster
        if (!identifier) {
          identifier = "dropbtnService";
        }

        // Loop that visualize onli the service button
        // with the ID set before
        for (var index in bottoni){
          var s = bottoni[index];
          if (s.id) {
            var div = document.getElementById(s.id).parentNode.id;
            if (s.id != "dropbtnCluster" 
              && s.id != "dropbtnConfigType") {
              if (s.id == identifier) {
                document.getElementById(s.id).style.display="block";
                document.getElementById(div).style.display="block";
              } else {
                document.getElementById(s.id).style.display = "none";
                document.getElementById(div).style.display="none";
                if(s.id.substring(0,"dropbtnService".length)=="dropbtnService") {
                  document.getElementById(s.id).textContent = "Select a Service";
                } else if(s.id.substring(0,"dropbtnAnalytics".length)=="dropbtnAnalytics") {
                  document.getElementById(s.id).textContent = "Select an Analytics";
                }
              }
            }
          }
        }

        document.getElementById("agentConfigFields").style.display="none";
        document.getElementById("policyConfigFields").style.display="none";
        document.getElementById("analyticsConfigFields").style.display="none";

      } else if (document.getElementById("dropbtnConfigType").textContent == "policy"){

        // Loop the show only the policy button
        // with the ID set before
        for (var index in bottoni){
          var s = bottoni[index];
          if (s.id) {
            var div = document.getElementById(s.id).parentNode.id;
            if (s.id != "dropbtnCluster" 
              && s.id != "dropbtnConfigType") {
                document.getElementById(s.id).style.display = "none";
                document.getElementById(div).style.display="none";
            }
          }
        }

        if (event.target.textContent == "policy"
          || document.getElementById("dropbtnConfigType").textContent == "policy"
          && event.target.matches('.cluster')) {
          document.getElementById("policyConfigFields").style.display="inline";

          readPolicyConfig("policy" + cluster);
        }

        document.getElementById("agentConfigFields").style.display="none";
        document.getElementById("serviceConfigFields").style.display="none";
        document.getElementById("analyticsConfigFields").style.display="none";

      } else if(document.getElementById("dropbtnConfigType").textContent == "analytics"){

        var identifier = "";

        // Get the button ID of the services of a cluster
        for (var index in bottoni){
          var g = bottoni[index];
          if (g.id) {
            if (g.id != "dropbtnCluster" 
              && g.id != "dropbtnConfigType") {
              if (g.id == "dropbtnAnalytics" + cluster) {
                identifier = g.id;
              }
            }
          }
        }

        // Check that the analytics button exist
        // If this control does not have success
        // the cluster do not have analytics loaded on etcd
        // so i will visualize the default analytics button
        // for the insert of first analytics of the cluster
        if (!identifier) {
          identifier = "dropbtnAnalytics";
        }

        // Loop that visualize onli the analytics button
        // with the ID set before
        for (var index in bottoni){
          var s = bottoni[index];
          if (s.id) {
            var div = document.getElementById(s.id).parentNode.id;
            if (s.id != "dropbtnCluster" 
              && s.id != "dropbtnConfigType") {
              if (s.id == identifier) {
                document.getElementById(s.id).style.display="block";
                document.getElementById(div).style.display="block";
              } else {
                document.getElementById(s.id).style.display = "none";
                document.getElementById(div).style.display="none";
                if(s.id.substring(0,"dropbtnService".length)=="dropbtnService") {
                  document.getElementById(s.id).textContent = "Select a Service";
                } else if(s.id.substring(0,"dropbtnAnalytics".length)=="dropbtnAnalytics") {
                  document.getElementById(s.id).textContent = "Select an Analytics";
                }
              }
            }
          }
        }

        document.getElementById("agentConfigFields").style.display="none";
        document.getElementById("serviceConfigFields").style.display="none";
        document.getElementById("policyConfigFields").style.display="none";

      }else{
        // Hide all the button of agent, services, policy and analytics
        for (var index in bottoni){
          var b = bottoni[index];
          if (b.id) {
            if (b.id != "dropbtnCluster" 
              && b.id != "dropbtnConfigType") {
              document.getElementById(b.id).style.display = "none";
              var div = document.getElementById(b.id).parentNode.id;
              document.getElementById(div).style.display="none";
            }
          }
        }

        document.getElementById("agentConfigFields").style.display="none";
        document.getElementById("serviceConfigFields").style.display="none";
        document.getElementById("policyConfigFields").style.display="none";
        document.getElementById("analyticsConfigFields").style.display="none";
      }
  }else{
      // Hide all the button of agent, services, policy and analytics
      var bottoni = document.getElementsByClassName("dropdown-toggle");
      for (var index in bottoni){
        var b = bottoni[index];
        if (b.id) {
          if (b.id != "dropbtnCluster" 
            && b.id != "dropbtnConfigType") {
            document.getElementById(b.id).style.display = "none";
            var div = document.getElementById(b.id).parentNode.id;
            document.getElementById(div).style.display="none";
          }
        }
      }

      document.getElementById("agentConfigFields").style.display="none";
      document.getElementById("serviceConfigFields").style.display="none";
      document.getElementById("policyConfigFields").style.display="none";
      document.getElementById("analyticsConfigFields").style.display="none";
  }

  // Manage services configurations for a new cluster
  if (event.target.matches('.service')) {

    var mario = document.getElementsByClassName("service");
    for (var i in mario){
      if (mario.hasOwnProperty(i)) {
        if (event.target.textContent.trim() == mario[i].textContent) {
          document.getElementById("dropbtnService").textContent = event.target.textContent;
          document.getElementById("serviceConfigFields").style.display="inline";

          readServiceConfig(event.target.textContent, event.target.textContent);
        }
      }
    }
  }

  // Manage services configurations for an existence cluster
  if (event.target.matches('.service' + cluster)) {

    var mario = document.getElementsByClassName("service" + cluster);
    for (var i in mario){
      if (mario.hasOwnProperty(i)) {
        if (event.target.textContent.trim() == mario[i].textContent) {
          document.getElementById("dropbtnService" + cluster).textContent = event.target.textContent;
          document.getElementById("serviceConfigFields").style.display="inline";

          readServiceConfig(event.target.textContent, event.target.textContent + cluster);
        }
      }
    }
  }

  // Manage analytics configurations for a new cluster
  if (event.target.matches('.analytics')) {
    var mario = document.getElementsByClassName("analytics");
    for (var i in mario){
      if (mario.hasOwnProperty(i)) {
        if (event.target.textContent.trim() == mario[i].textContent) {
          document.getElementById("dropbtnAnalytics").textContent = event.target.textContent;
          document.getElementById("analyticsConfigFields").style.display="inline";

          readAnalyticsConfig(event.target.textContent, event.target.textContent);
        }
      }
    }
  }

  // Manage analytics configuration for an existence cluster
  if (event.target.matches('.analytics' + cluster)) {
    var mario = document.getElementsByClassName("analytics" + cluster);
    for (var i in mario){
      if (mario.hasOwnProperty(i)) {
        if (event.target.textContent.trim() == mario[i].textContent) {
          document.getElementById("dropbtnAnalytics" + cluster).textContent = event.target.textContent;
          document.getElementById("analyticsConfigFields").style.display="inline";

          readAnalyticsConfig(event.target.textContent, event.target.textContent + cluster);
        }
      }
    }
  }

  // Manage configurations of users
  if (event.target.matches('.user')) {
    document.getElementById("dropbtnUser").textContent = event.target.textContent;

    document.getElementById("userSettingsFields").style.display = "inline";

    readUserSettings(event.target.textContent);
  }

  // Manage configurations of roles
  if (event.target.matches('.role')) {
    document.getElementById("dropbtnRole").textContent = event.target.textContent;

    document.getElementById("roleSettingsFields").style.display = "inline";

    readRoleSettings(event.target.textContent);
  }
}

// Function that check duplicate cluster values
var checkDuplicateClusterName = function(newClusterName, availableClusters){
  for (var index in availableClusters) {
    if (newClusterName == availableClusters[index].textContent) {
      return true;
    }
  }
  return false;
}

// Function that check duplicate services name
var checkDuplicateServiceName = function(newServiceName, clusterName){

  var availableServices = document.getElementsByClassName("service" + clusterName);

  if (availableServices.length == 0) {
    return false;
  }

  var valueServiceButton = document.getElementById("dropbtnService" + clusterName).textContent;

  if (valueServiceButton == "Add Service") {
    for (index in availableServices) {
      if (availableServices[index].textContent == newServiceName) {
        return true;
      }
    }
  } else {
    for (index in availableServices) {
      if (availableServices[index].textContent == newServiceName
        && availableServices[index].textContent != valueServiceButton) {
        return true;
      }
    }
  }

  return false;
}

// Function that check duplicate analytics name
var checkDuplicateAnalyticsName = function(newAnalyticsName, clusterName){

  var availableAnalytics = document.getElementsByClassName("analytics" + clusterName);

  if (availableAnalytics.length == 0) {
    return false;
  }

  var valueAnalyticsButton = document.getElementById("dropbtnAnalytics" + clusterName).textContent;

  if (valueAnalyticsButton == "Add Analytics") {
    for (index in availableAnalytics) {
      if (availableAnalytics[index].textContent == newAnalyticsName) {
        return true;
      }
    }
  } else {
    for (index in availableAnalytics) {
      if (availableAnalytics[index].textContent == newAnalyticsName
        && availableAnalytics[index].textContent != valueAnalyticsButton) {
        return true;
      }
    }
  }

  return false;
}

// Function that check duplicate services discovery port  values
var checkDuplicateDiscoveryPort = function(newDiscoveryPort, clusterName){

  var availablePorts = document.getElementsByClassName("service" + clusterName);

  if (availablePorts.length == 0) {
    return false;
  }

  var valueServiceButton = document.getElementById("dropbtnService" + clusterName).textContent;

  if (valueServiceButton == "Add Service") {
    for (index in availablePorts) {
      if (index > 0) {
        var temp = document.getElementById(availablePorts[index].textContent + clusterName);

        if (temp.value > " ") {
          var m = JSON.parse(temp.value);

          if (newDiscoveryPort == m.DiscoveryPort) {
            return true;
          }
        }
      }
    }
  } else {
    for (index in availablePorts) {
      if (index > 0) {
        var temp = document.getElementById(availablePorts[index].textContent + clusterName);

        if (temp.value > " " ) {
          var m = JSON.parse(temp.value);

          if (newDiscoveryPort == m.DiscoveryPort 
            && valueServiceButton != m.Name) {
            return true;
          }
        }
      }
    }
  }
  return false;
}

// Function that check duplicate services porta host values
var checkDuplicatePortaGuest = function(newPortaGuest, clusterName){

  var availablePorts = document.getElementsByClassName("service" + clusterName);

  if (availablePorts.length == 0) {
    return false;
  }

  var valueServiceButton = document.getElementById("dropbtnService" + clusterName).textContent;

  if (valueServiceButton == "Add Service") {
    for (index in availablePorts) {
      if (index > 0) {
        var temp = document.getElementById(availablePorts[index].textContent + clusterName);

        if (temp.value > " ") {
          var m = JSON.parse(temp.value);

          for (i in m.Configuration.Ports) {
            if (newPortaGuest == i) {
              return true;
            }
          }
        }
      }
    }
  } else {
    for (index in availablePorts) {
      if (index > 0) {  
        var temp = document.getElementById(availablePorts[index].textContent + clusterName);

        if (temp.value > " ") {
          var m = JSON.parse(temp.value);

          for (i in m.Configuration.Ports) {
            if (newPortaGuest == i
              && valueServiceButton != m.Name) {
              return true;
            }
          }
        }
      }
    }
  }

  return false;
}

// Function that check duplicate services porte host values
var checkDuplicatePorteHost = function(newPortaHostFrom, newPortaHostTo, clusterName){

    var availablePorts = document.getElementsByClassName("service" + clusterName);

    if (availablePorts.length == 0) {
      return false;
    }

    var valueServiceButton = document.getElementById("dropbtnService" + clusterName).textContent;

    if (valueServiceButton == "Add Service") {
      for (index in availablePorts) {
        if (index > 0) {
          var temp = document.getElementById(availablePorts[index].textContent + clusterName);

          if (temp.value > " ") {
            var m = JSON.parse(temp.value);

            for (i in m.Configuration.Ports) {
              var beginPort = m.Configuration.Ports[i].split("-")[0];
              var endPort = m.Configuration.Ports[i].split("-")[1];

              if (parseInt(newPortaHostFrom) >= parseInt(beginPort) && parseInt(newPortaHostFrom) <= parseInt(endPort)
                || parseInt(newPortaHostTo) >= parseInt(beginPort) && parseInt(newPortaHostTo) <= parseInt(endPort)) {
                return true;
              }
            }
          }
        }
      }
    } else {
      for (index in availablePorts) {
        if (index > 0) {

          var temp = document.getElementById(availablePorts[index].textContent + clusterName);

          if (temp.value > " ") {
            var m = JSON.parse(temp.value);

            for (i in m.Configuration.Ports) {

              var beginPort = m.Configuration.Ports[i].split("-")[0];
              var endPort = m.Configuration.Ports[i].split("-")[1];
              
              if ((parseInt(newPortaHostFrom) >= parseInt(beginPort) && parseInt(newPortaHostFrom) <= parseInt(endPort)
                || parseInt(newPortaHostTo) >= parseInt(beginPort) && parseInt(newPortaHostTo) <= parseInt(endPort))
                && valueServiceButton != m.Name) {
                return true;
              }
            }
          }
        }
      }
    }

    return false;
  
}

// Function that check Portehost values
// The value of PorteHostFrom must be less than PorteHostTo
var validateValuesPorteHost = function(servicePorteHostFrom, servicePorteHostTo) {

  if (servicePorteHostFrom > servicePorteHostTo) {
    return "Valore portaHostFrom deve essere minore della portaHostTo !!!"
  }

  return ""
}

// Function that insert a new cluster in the dropdown menu
// for future creation on etcd at the first configuration send
var insertNewCluster = function(){

  var bottoni = document.getElementsByClassName("dropdown-toggle");

  for (var index in bottoni){
    var s = bottoni[index];
    if (s.id) {
      if (s.id != "dropbtnCluster" 
        && s.id != "dropbtnConfigType") {
        document.getElementById(s.id).style.display = "none";
        if(s.id.substring(0,"dropbtnService".length)=="dropbtnService") {
          document.getElementById(s.id).textContent = "Select a Service";
        } else if(s.id.substring(0,"dropbtnAnalytics".length)=="dropbtnAnalytics") {
          document.getElementById(s.id).textContent = "Select an Analytics";
        }
      }
    }
  }

  if(document.getElementById("dropbtnCluster").type != "text") {
     document.getElementById("dropbtnCluster").type = "text";
     document.getElementById("dropbtnCluster").setAttribute("onchange","insertNewCluster()");
     document.getElementById("dropbtnCluster").value="";
     document.getElementById("dropbtnCluster").focus();
     document.getElementById("dropbtnCluster").style.textAlign = "center";
  } else {
     document.getElementById("dropbtnCluster").type = "button"; 
     document.getElementById("dropbtnCluster").setAttribute("onchange","");

     var c = checkDuplicateClusterName(document.getElementById("dropbtnCluster").value, document.getElementsByClassName("cluster"));

    if (c == true) {
      alert("Cluster già esistente");
      document.getElementById("dropbtnCluster").value = "Select a Cluster";
      document.getElementById("dropDeleteBtn").style.display = "none";
    } else {
      var newCluster = document.createElement("a");
      newCluster.setAttribute("class","cluster");
      newCluster.href = "#"+document.getElementById("dropbtnCluster").value;
      newCluster.textContent=document.getElementById("dropbtnCluster").value;

      var type = document.getElementById("dropbtnConfigType").textContent;

      var a1 = document.getElementsByClassName("configType");

      for (var index in a1) {
        if (a1.hasOwnProperty(index)) {
          var a2;
          if (a1[index].href.split("#")[1].split("/")[1]) {
            a2 = a1[index].href.split("#")[1].split("/")[1];
          } else {
            a2 = a1[index].href.split("#")[1];
          }
          a1[index].href = "#" + newCluster.textContent 
            +  "/" +  a2;
        }
      }

      var type = document.getElementById("dropbtnConfigType").textContent;

      if (type == "Select a Type") {
        location.href = "#" + newCluster.textContent;
      } else {
        location.href = "#" + newCluster.textContent + "/" + type;

        var a1 = document.getElementsByClassName("cluster");

        for (var index in a1) {
          if (a1.hasOwnProperty(index)) {
            if(a1[index].id != "dropDeleteBtn") {
              var a2;
              if (a1[index].href.split("#")[1].split("/")[0]) {
                a2 = a1[index].href.split("#")[1].split("/")[0];
              } else {
                a2 = a1[index].href.split("#")[1];
              }
              a1[index].href = "#" + a2
                +  "/" +  type;
            }
          }
        }
      }

      if (type == "service" || type == "analytics") {
        var a1;
        if (document.getElementsByClassName(type + newCluster.textContent).length > 0) {
          a1 = document.getElementsByClassName(type + newCluster.textContent);
        } else {
          a1 = document.getElementsByClassName(type);
        }

        for (var index in a1) {
          if (a1.hasOwnProperty(index)) {
            var a2;
            if (a1[index].href.split("#")[1].split("/")[2]) {
              a2 = a1[index].href.split("#")[1].split("/")[2];
            } else {
              a2 = a1[index].href.split("#")[1];
            }

            a1[index].href = "#" + newCluster.textContent
              + "/" + type + "/" + a2;
          }
        } 
      } 

      var newEl = document.createElement("li");
      newEl.appendChild(newCluster);
      document.getElementById("myDropdownCluster").appendChild(newEl);

      document.getElementById("dropDeleteBtn").style.display = "inline";

      document.getElementById("dropdownConfigType").style.display = "block";
      
      if(document.getElementById("dropbtnConfigType").textContent == "agent"){
        document.getElementById("agentConfigFields").style.display="inline";
      } else if (document.getElementById("dropbtnConfigType").textContent == "service"){
        document.getElementById("dropdownService").style.display="block";
        document.getElementById("serviceConfigFields").style.display="none";
      } else if (document.getElementById("dropbtnConfigType").textContent == "policy"){
        document.getElementById("policyConfigFields").style.display="inline";
      }  else if (document.getElementById("dropbtnConfigType").textContent == "analytics"){
        document.getElementById("dropdownAnalytics").style.display="block";
        document.getElementById("analyticsConfigFields").style.display="none";
      }  
    }
  }
}

// Validate users input form values
var checkParametriUtente = function (){
  var error = 0;

  if (document.getElementById("userName").value == "") {
    error = 2;
    alert("Inserire un nome valido");
  }

  if (document.getElementById("userPassword").value > "" || document.getElementById("userConfermaPassword").value > "") {
    if (document.getElementById("userPassword").value != document.getElementById("userConfermaPassword").value) {
      error = 2;
      alert("Le password non corrispondono");
    }
  }

  if (error == 2) {
    document.getElementById("userSendButton").type = "button";
  } else {
    document.getElementById("userSendButton").type = "submit";

    var user = document.getElementById("userName");
    var str = "";
    if (document.getElementById(user.value + "Roles")) {
      str = document.getElementById(user.value + "Roles").value.split("[")[1];
      str = str.split("]")[0];
    }

    document.getElementById("ruoliUtenteBegin").value = str;

    var userRoles = document.getElementsByClassName("userRoles");
    var ur = [];
    var i = 0;
    for (index in userRoles) {
      if (userRoles.hasOwnProperty(index)) {
        if (Boolean(userRoles[index].checked) == true) {
          ur[i] = userRoles[index].value;
          i++;
        }
      }
    }

    document.getElementById("ruoliUtenteEnd").value = ur;
    document.getElementById("userForm").action = sendAction;
  }
}

// Validate roles input form values
var checkParametriRuolo = function (){
  var error = 0;

  if (document.getElementById("roleName").value == "") {
    error = 2;
    alert("Inserire un nome valido");
  }

  if (error == 2) {
    document.getElementById("roleSendButton").type = "button";
  } else {
    document.getElementById("roleSendButton").type = "submit";

    var role = document.getElementById("roleName");
    var str = "";
    if (document.getElementById(role.value + "Read")) {
      str = document.getElementById(role.value + "Read").value.split("[")[1];
      str = str.split("]")[0];      
    }
    document.getElementById("permessiRuoloReadBegin").value = str;

    str = "";
    if (document.getElementById(role.value + "Write")) {
      str = document.getElementById(role.value + "Write").value.split("[")[1];
      str = str.split("]")[0];      
    }
    document.getElementById("permessiRuoloWriteBegin").value = str;

    var table = document.getElementById("tableOfPermissionsRole");

    var read = [];
    var write = [];
    var r = 0;
    var w = 0;
    for (index in table.rows) {
      if (index > 0) {
        var t = table.rows[index].cells[0].children[1].value;
        if (t > "") {
          var readChecked = table.rows[index].cells[0].children[2].checked;
          var writeChecked = table.rows[index].cells[0].children[3].checked;

          if (Boolean(readChecked) == true) {
            read[r] = t;
            r++;
          }

          if (Boolean(writeChecked) == true) {
            write[w] = t;
            w++;
          }
        }
      }
    }

    document.getElementById("permessiRuoloReadEnd").value = read;
    document.getElementById("permessiRuoloWriteEnd").value = write;
    document.getElementById("roleForm").action = sendAction;
  }
}

// Validate agent input form values
var checkAgentValues = function() {
  var error = 0;

  if (document.getElementById("agentDaemonUrl").value > " " ) {
    document.getElementById("agentDaemonUrl").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per DaemonUrl");
    document.getElementById("agentDaemonUrl").style.backgroundColor = "#ff471a";
  }

  if (parseInt(document.getElementById("agentDaemonTimeout").value) > 0 ) {
    document.getElementById("agentDaemonTimeout").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per DaemonTimeout");
    document.getElementById("agentDaemonTimeout").style.backgroundColor = "#ff471a";
  }

  if (parseInt(document.getElementById("agentAutonomicLoopTimeInterval").value) > 0 ) {
    document.getElementById("agentAutonomicLoopTimeInterval").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per Autonomic LoopTimeInterval");
    document.getElementById("agentAutonomicLoopTimeInterval").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("agentAutonomicPlannerStrategy").value == "Select PlannerStrategy") {
    error = 2;
    alert("PlannerStrategy not selected");
  }

  if (parseInt(document.getElementById("agentCommunicationLoopTimeInterval").value) > 0 ) {
    document.getElementById("agentCommunicationLoopTimeInterval").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per Communication LoopTimeInterval");
    document.getElementById("agentCommunicationLoopTimeInterval").style.backgroundColor = "#ff471a";
  }

  if (parseInt(document.getElementById("agentCommunicationMaxFriends").value) > 0 ) {
    document.getElementById("agentCommunicationMaxFriends").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per Communication MaxFriends");
    document.getElementById("agentCommunicationMaxFriends").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("agentStorageService").value == "Select StorageService") {
    error = 2;
    alert("StorageService not selected");
  }

  switch(document.getElementById("agentMetricService").value){
    case "influxdb":
      if (document.getElementById("agentUrl").value > "") {
        document.getElementById("agentUrl").style.backgroundColor = "#fff";
      } else {
        error = 2;
        alert("Valore non valido per Agent Url");
        document.getElementById("agentUrl").style.backgroundColor = "#ff471a";
      }
      if (document.getElementById("agentDbName").value > "") {
        document.getElementById("agentDbName").style.backgroundColor = "#fff";
      } else {
        error = 2;
        alert("Valore non valido per Agent DbName");
        document.getElementById("agentDbName").style.backgroundColor = "#ff471a";
      }
      if (document.getElementById("agentUsername").value > "") {
        document.getElementById("agentUsername").style.backgroundColor = "#fff";
      } else {
        error = 2;
        alert("Valore non valido per Agent Username");
        document.getElementById("agentUsername").style.backgroundColor = "#ff471a";
      }
      if (document.getElementById("agentPassword").value > "") {
        document.getElementById("agentPassword").style.backgroundColor = "#fff";
      } else {
        error = 2;
        alert("Valore non valido per Agent Password");
        document.getElementById("agentPassword").style.backgroundColor = "#ff471a";
      }
    break;
    default:
      alert("Nothing metric service selected");
    break;
  }

  if (document.getElementById("agentAppRoot").value > " " ) {
    document.getElementById("agentAppRoot").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per AppRoot");
    document.getElementById("agentAppRoot").style.backgroundColor = "#ff471a";
  }

  if (parseInt(document.getElementById("agentTTL").value) > 0 ) {
    document.getElementById("agentTTL").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per TTL");
    document.getElementById("agentTTL").style.backgroundColor = "#ff471a";
  }
  
  if (error == 2) {
    document.getElementById("formSendAgent").action = "";
    document.getElementById("sendAgentConfig").type = "button";
  } else {
    writeAgentConfig();
    anchorQueryString("agent");
    document.getElementById("formSendAgent").action = sendAction;
    document.getElementById("sendAgentConfig").type = "submit";
  }
}

// Validate services input form values
var checkServiceValues = function(){

  var error = 0;
  var cluster = document.getElementById("dropbtnCluster").value;

  if (document.getElementById("serviceName").value > " " ) {
    var serviceName = document.getElementById("serviceName").value;
    var e = checkDuplicateServiceName(serviceName, cluster);

    if (e != true) {
      document.getElementById("serviceName").style.backgroundColor = "#fff";
    } else {
      error = 2;
      alert("Valore duplicato");
      document.getElementById("serviceName").style.backgroundColor = "#ff471a";
    }
  } else {
    error = 2;
    alert("Valore non valido per Name");
    document.getElementById("serviceName").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("serviceType").value > " " ) {
    document.getElementById("serviceType").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per Type");
    document.getElementById("serviceType").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("serviceImage").value > " " ) {
    document.getElementById("serviceImage").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per Image");
    document.getElementById("serviceImage").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("serviceName").value > " " ) {
    serviceRemote = "/gru/"
      + document.getElementById("dropbtnCluster").value
      + "/services/"
      + document.getElementById("serviceName").value;
  }

  if (document.getElementById("serviceDiscoveryPort").value > " " ) {
    var serviceDiscoveryPort = document.getElementById("serviceDiscoveryPort").value;
    var e = checkDuplicateDiscoveryPort(serviceDiscoveryPort, cluster);

    if (e != true) {
      document.getElementById("serviceDiscoveryPort").style.backgroundColor = "#fff";
    } else {
      error = 2;
      alert("Valore duplicato");
      document.getElementById("serviceDiscoveryPort").style.backgroundColor = "#ff471a";
    }
  } else {
    error = 2;
    alert("Valore non valido per DiscoveryPort");
    document.getElementById("serviceDiscoveryPort").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("serviceCmd").value > " " ) {
    var str = document.getElementById("serviceCmd").value;
    stringaCommand = str.split(" ");
    document.getElementById("serviceCmd").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per Cmd");
    document.getElementById("serviceCmd").style.backgroundColor = "#ff471a";
  }

  if (parseInt(document.getElementById("serviceCpuNumber").value) > 0 ) {
    document.getElementById("serviceCpuNumber").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per CpuNumber");
    document.getElementById("serviceCpuNumber").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("servicePortaGuest").value > " " ) {
    portaGuest = document.getElementById("servicePortaGuest").value;

    var e = checkDuplicatePortaGuest(portaGuest, cluster);

    if (e != true) {
      document.getElementById("servicePortaGuest").style.backgroundColor = "#fff";
    } else {
      error = 2;
      alert("Valore duplicato");
      document.getElementById("servicePortaGuest").style.backgroundColor = "#ff471a";
    }
  } else {
    error = 2;
    alert("Valore non valido per PortaGuest");
    document.getElementById("servicePortaGuest").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("servicePorteHostFrom").value > " " ) {
    document.getElementById("servicePorteHostFrom").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per PorteHostFrom");
    document.getElementById("servicePorteHostFrom").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("servicePorteHostTo").value > " " ) {
    document.getElementById("servicePorteHostTo").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per PorteHostTo");
    document.getElementById("servicePorteHostTo").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("servicePorteHostFrom").value > " " 
    && document.getElementById("servicePorteHostTo").value > " " ) {

    var servicePorteHostFrom = document.getElementById("servicePorteHostFrom").value;
    var servicePorteHostTo = document.getElementById("servicePorteHostTo").value;

    var e = checkDuplicatePorteHost(servicePorteHostFrom, servicePorteHostTo, cluster);

    if (e != true) {
      document.getElementById("servicePorteHostFrom").style.backgroundColor = "#fff";
      document.getElementById("servicePorteHostTo").style.backgroundColor = "#fff";
    } else {
      error = 2;
      alert("Valore duplicato");
      document.getElementById("servicePorteHostFrom").style.backgroundColor = "#ff471a";
      document.getElementById("servicePorteHostTo").style.backgroundColor = "#ff471a";
    }

    var errorMessage = validateValuesPorteHost(servicePorteHostFrom, servicePorteHostTo);

    if (errorMessage == "") {
      document.getElementById("servicePorteHostFrom").style.backgroundColor = "#fff";
      document.getElementById("servicePorteHostTo").style.backgroundColor = "#fff";
    } else {
      error = 2;
      alert(errorMessage);
      document.getElementById("servicePorteHostFrom").style.backgroundColor = "#ff471a";
      document.getElementById("servicePorteHostTo").style.backgroundColor = "#ff471a";
    }

    porteHost = servicePorteHostFrom + "-" + servicePorteHostTo;
  }

  if (parseInt(document.getElementById("serviceStopTimeout").value) > 0 ) {
    document.getElementById("serviceStopTimeout").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per StopTimeout");
    document.getElementById("serviceStopTimeout").style.backgroundColor = "#ff471a";
  }

  if (error == 2) {
    document.getElementById("formSendService").action = "";
    document.getElementById("sendServiceConfig").type = "button";
  } else {
    writeServiceConfig();
    anchorQueryString("service");
    document.getElementById("formSendService").action = sendAction;
    document.getElementById("sendServiceConfig").type = "submit";
  }

}

// Validate policy input form values
var checkPolicyValues = function() {
  var error = 0;

  if (parseFloat(document.getElementById("policyScaleInThreshold").value) >= 0.0
      &&  parseFloat(document.getElementById("policyScaleInThreshold").value) <= 1.0) {
    document.getElementById("policyScaleInThreshold").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per SCALEIN Threshold");
    document.getElementById("policyScaleInThreshold").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("policyScaleInMetrics").value == "Select Metrics") {
    error = 2;
    alert("SCALEIN Metrics not selected")
  }

  if (parseFloat(document.getElementById("policyScaleOutThreshold").value) >= 0.0
      &&  parseFloat(document.getElementById("policyScaleOutThreshold").value) <= 1.0) {
    document.getElementById("policyScaleOutThreshold").style.backgroundColor = "#fff"; 
  } else {
    error = 2;
    alert("Valore non valido per SCALEOUT Threshold");
    document.getElementById("policyScaleOutThreshold").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("policyScaleOutMetrics").value == "Select Metrics") {
    error = 2;
    alert("SCALEOUT Metrics not selected")
  }

  if (parseFloat(document.getElementById("policySwapThreshold").value) >= 0.0
      &&  parseFloat(document.getElementById("policySwapThreshold").value) <= 1.0) {
    document.getElementById("policySwapThreshold").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per SWAP Threshold");
    document.getElementById("policySwapThreshold").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("policySwapMetrics").value == "Select Metrics") {
    error = 2;
    alert("SWAP Metrics not selected")
  }

  if (error == 2) {
    document.getElementById("formSendPolicy").action = "";
    document.getElementById("sendPolicyConfig").type = "button";
  } else {
    writePolicyConfig();
    anchorQueryString("policy");
    document.getElementById("formSendPolicy").action = sendAction;
    document.getElementById("sendPolicyConfig").type = "submit";
  }

}

// Validate analytics input form values
var checkAnalyticsValues = function() {
  var error = 0;
  var cluster = document.getElementById("dropbtnCluster").value;

  if (document.getElementById("analyticsName").value > " " ) {
    var analyticsName = document.getElementById("analyticsName").value;
    var e = checkDuplicateAnalyticsName(analyticsName, cluster);

    if (e != true) {
      document.getElementById("analyticsName").style.backgroundColor = "#fff";
    } else {
      error = 2;
      alert("Valore duplicato");
      document.getElementById("analyticsName").style.backgroundColor = "#ff471a";
    }
  } else {
    error = 2;
    alert("Valore non valido per Name");
    document.getElementById("analyticsName").style.backgroundColor = "#ff471a";
  }

  if (document.getElementById("analyticsExpr").value > " " ) {
    document.getElementById("analyticsExpr").style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Valore non valido per Expr");
    document.getElementById("analyticsExpr").style.backgroundColor = "#ff471a";
  }

  var table = document.getElementById("tableOfAnalitycsMetrics");

  var keyCellID1 = table.rows[1].cells[0].className;
  var val1 = document.getElementsByClassName(keyCellID1)[1].value;

  table = document.getElementById("tableOfAnalyticsConstraints");
  var keyCellID2 = table.rows[1].cells[0].className;
  var val2 = document.getElementsByClassName(keyCellID2)[1].value;

  if (val1 > " " || val2 > " ") {
    document.getElementsByClassName(keyCellID1)[1].style.backgroundColor = "#fff";
    document.getElementsByClassName(keyCellID2)[1].style.backgroundColor = "#fff";
  } else {
    error = 2;
    alert("Inserire una variabile in uno dei due campi (Metrics o Constraints)");
    document.getElementsByClassName(keyCellID1)[1].style.backgroundColor = "#ff471a";
    document.getElementsByClassName(keyCellID2)[1].style.backgroundColor = "#ff471a";
  }

  if (error == 2) {
    document.getElementById("formSendAnalytics").action = "";
    document.getElementById("sendAnalyticsConfig").type = "button";
  } else {
    writeAnalyticsConfig();
    anchorQueryString("analytic");
    document.getElementById("formSendAnalytics").action = sendAction;
    document.getElementById("sendAnalyticsConfig").type = "submit";
  }

}

// Function that clean agent form input errors
var clearAgentErrors = function() {

  document.getElementById("agentDaemonUrl").style.backgroundColor = "#fff";

  document.getElementById("agentDaemonTimeout").style.backgroundColor = "#fff";

  document.getElementById("agentAutonomicLoopTimeInterval").style.backgroundColor = "#fff";

  document.getElementById("agentCommunicationLoopTimeInterval").style.backgroundColor = "#fff";

  document.getElementById("agentCommunicationMaxFriends").style.backgroundColor = "#fff";

  switch(document.getElementById("agentMetricService").value){
    case "influxdb":
      document.getElementById("agentUrl").style.backgroundColor = "#fff";
      document.getElementById("agentDbName").style.backgroundColor = "#fff";
      document.getElementById("agentUsername").style.backgroundColor = "#fff";
      document.getElementById("agentPassword").style.backgroundColor = "#fff";
    break;
  }

  document.getElementById("agentAppRoot").style.backgroundColor = "#fff";

  document.getElementById("agentTTL").style.backgroundColor = "#fff";
  
}

// Function that clean service form input errors
var clearServiceErrors = function (){

  document.getElementById("serviceName").style.backgroundColor = "#fff";

  document.getElementById("serviceType").style.backgroundColor = "#fff";

  document.getElementById("serviceImage").style.backgroundColor = "#fff";

  document.getElementById("serviceDiscoveryPort").style.backgroundColor = "#fff";

  document.getElementById("serviceCmd").style.backgroundColor = "#fff";

  document.getElementById("serviceCpuNumber").style.backgroundColor = "#fff";

  document.getElementById("servicePortaGuest").style.backgroundColor = "#fff";

  document.getElementById("servicePorteHostFrom").style.backgroundColor = "#fff";

  document.getElementById("servicePorteHostTo").style.backgroundColor = "#fff";

  document.getElementById("serviceStopTimeout").style.backgroundColor = "#fff";

}

// Function that clean policy form input errors
var clearPolicyErrors = function() {

  document.getElementById("policyScaleInThreshold").style.backgroundColor = "#fff";

  document.getElementById("policyScaleOutThreshold").style.backgroundColor = "#fff";

  document.getElementById("policySwapThreshold").style.backgroundColor = "#fff";
  
}

// Function that clean analytics form input errors
var clearAnalyticsErrors = function() {

  document.getElementById("analyticsName").style.backgroundColor = "#fff";
    
  document.getElementById("analyticsExpr").style.backgroundColor = "#fff";
  

  var table = document.getElementById("tableOfAnalitycsMetrics");

  var keyCellID1 = table.rows[1].cells[0].className;
  var val1 = document.getElementsByClassName(keyCellID1)[1].value;

  table = document.getElementById("tableOfAnalyticsConstraints");
  var keyCellID2 = table.rows[1].cells[0].className;
  var val2 = document.getElementsByClassName(keyCellID2)[1].value;

  document.getElementsByClassName(keyCellID1)[1].style.backgroundColor = "#fff";
  document.getElementsByClassName(keyCellID2)[1].style.backgroundColor = "#fff";

}

// Change action of form for delete user
var deleteParametriUtente = function(){
  document.getElementById("userForm").action = "deleteMode";
}

// Change action of form for delete role
var deleteParametriRuolo = function(){
  document.getElementById("roleForm").action = "deleteMode";
}

// Function that set parameters to send on etcd
// for delete a agent, service, policy or analytics
var addNameToInputValue = function(type){
  var cluster = document.getElementById("dropbtnCluster").value;

  anchorQueryString("delete");

  switch(type){
    case "agent":
      document.getElementById("clusterNameOfAgentToDelete").value = cluster;
    break;

    case "service":
      document.getElementById("serviceNameToDelete").value = document.getElementById("dropbtnService" + cluster).textContent;
      document.getElementById("clusterNameOfServiceToDelete").value = cluster;
    break;

    case "policy":
      document.getElementById("clusterNameOfPolicyToDelete").value = cluster;
    break;

    case "analytic":
      document.getElementById("analyticsNameToDelete").value = document.getElementById("dropbtnAnalytics" + cluster).textContent;
      document.getElementById("clusterNameOfAnalyticsToDelete").value = cluster;
    break;

    default:
      alert("HTTP 404 - input type invalid");
    break;

  }
}

// Function that create a map structure from HTML table
var createMap = function(tableID,structureInit,columnsNumber){
  var table = document.getElementById(tableID);

  var arrayIndex = 0;

  for (var index in table.rows) {
    if (index > 0 && index < table.rows.length-1) {

      var keyCellID = table.rows[index].cells[0].className;
      var key = document.getElementsByClassName(keyCellID)[1].value;

      if (key > "") {
        if (columnsNumber == 1){
          structureInit[arrayIndex] = key;
          arrayIndex++;
        } else {
          var value = document.getElementsByClassName(keyCellID)[2].value;

          var tempValue;

          if(parseFloat(value)) {   
            tempValue = parseFloat(value);
          } else {
            tempValue = value;
          }

          structureInit[key] = tempValue;
        }
      }
    }
  }

  return structureInit;
}

// Function for set the path of last operation
var anchorQueryString = function(values){
  var temp = document.getElementsByClassName("pathCode");

  for (index in temp){
    if (temp.hasOwnProperty(index)) {
      switch(values) {

        case "service":
          temp[index].value = "#"
            + location.hash.split("#")[1].split("/")[0]
            + "/"
            + location.hash.split("#")[1].split("/")[1]
            + "/"
            + document.getElementById("serviceName").value;
        break;

        case "analytic":
          temp[index].value = "#"
            + location.hash.split("#")[1].split("/")[0]
            + "/"
            + location.hash.split("#")[1].split("/")[1]
            + "/"
            + document.getElementById("analyticsName").value;
        break;

        case "agent":
          temp[index].value = location.hash;
        break;

        case "policy":
          temp[index].value = location.hash;
        break;

        case "delete":
          temp[index].value = "#"
            + location.hash.split("#")[1].split("/")[0]
            + "/"
            + location.hash.split("#")[1].split("/")[1];
        break;
        default:
          alert("HTTP 404 - Client Internal Error");
        break;
      }
    }
  }
}

// export function
var expo = function(type) {
  var cluster = document.getElementById("dropbtnCluster").value;
  switch(type) {
    case "agent":
      var filename = "config";
    break;
    case "service":
      var filename = document.getElementById("dropbtnService" + cluster).textContent;
    break;
    case "policy":
      var filename = "policy";
    break;
    case "analytics":
      var filename = document.getElementById("dropbtnAnalytics" + cluster).textContent;
    break;
    default:
      alert("HTTP 404 - input type invalid");
    break;
  }
  var text = document.getElementById(filename + cluster).value;
  var blob = new Blob([text], {
    type: "text/json;charset=utf-8"
  });
  saveAs(blob, filename + ".json");
}