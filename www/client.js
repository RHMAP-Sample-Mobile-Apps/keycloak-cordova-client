'use strict';
var auth;
//Instantiate Keycloak instance, the .json file is our config object.
var keycloakAuth = new Keycloak('keycloak.json');

//Add Event Listener for Device Ready so we can redirect to the login page hosted by the Keycloak server
document.addEventListener('deviceready', onDeviceReady, false);

//Funciton to handle all Cloud Requests
function callCloud(route) {
  //We update our token if it is set to expire within 30 seconds of this request
  keycloakAuth.updateToken(30)
    .success(function() {
      if(keycloakAuth && keycloakAuth.token) {
        auth.token = keycloakAuth.token;
        //Once we've updated our token we make our cloud request using the updated token in a header property named Authorization.
        //The keycloak express authorization module will use this property to determine authorization.
        $fh.cloud(
            {
              path: 'keycloak-demo/' + route,
              method: 'GET',
              headers: {
                'Authorization': 'Bearer ' + auth.token
              },
              timeout: 25000
            },
            function (res) {
              document.getElementById('cloudResponse').innerHTML = '<p>' + res.msg + '</p>';
            },
            function (code, errorprops, params) {
              document.getElementById('cloudResponse').innerHTML = '<p class="auth_error">' + code + '</p>';
            }
        );
      }
    })
    .error(function() {
        document.getElementById('cloudResponse').innerHTML = '<p class="auth_error">Error updating token.</p>';
    });


}

//When the devce is Ready we'll redirect to the login page hosted by our Keycloak server
function onDeviceReady() {
  keycloakAuth.init({
    onLoad: 'login-required'
  })
  .success(function() {
    if(keycloakAuth.authenticated) {
      auth = keycloakAuth;
      //Alert with token received from Keycloak Server for demonstration purposes only
      alert('Token:' + JSON.stringify(auth, null, 4));
    }
    else {
      alert('Not authenticated');
    }
  })
  .error(function() {
    alert('Error in auth init');
  });
}

//Functions to run on button clicks
document.getElementById('noAuthentication').onclick = function () {
  callCloud('no-authentication-needed');
};

document.getElementById('authentication').onclick = function () {
  callCloud('needs-authentication');
};

document.getElementById('userRole').onclick = function () {
  callCloud('needs-user-role');
};

document.getElementById('supervisorRole').onclick = function () {
  callCloud('needs-supervisor-role');
};

document.getElementById('adminRole').onclick = function () {
  callCloud('needs-admin-role');
};

document.getElementById('logout').onclick = function () {
  keycloakAuth.logout();
  onDeviceReady();
  //document.window.location.reload();
  //onDeviceReady();
};
