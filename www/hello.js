var auth;
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  var keycloakAuth = new Keycloak('keycloak.json');
  keycloakAuth.init({
    onLoad: 'login-required'
  })
  .success(function() {
    if(keycloakAuth.authenticated) {
      auth = keycloakAuth;
    }
    else {
      alert('Not authenticated');
    }
  })
  .error(function() {
    alert('Error in auth init');
  });
}

document.getElementById('say_hello').onclick = function () {
  document.getElementById('cloudResponse').innerHTML = '<p>Calling Cloud.....</p>';
  $fh.cloud(
      {
        path: 'keycloak-demo/needs-authentication',
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
        alert('An error occured: ' + code + ' : ' + errorprops);
      }
  );
};
