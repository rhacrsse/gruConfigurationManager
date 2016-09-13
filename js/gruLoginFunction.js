var checkPassword = function (){
  var pw = document.getElementById("password").value;
  var npw = document.getElementById("nuovaPassword").value;

  if (pw > "" && npw > "" && pw == npw) {
    if (document.getElementById("submit").type != "submit") {
      document.getElementById("submit").type = "submit";
    }
  } else {
    document.getElementById("submit").type = "button";
    alert("Le password non corrispondono");
  }
}