var auth;
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
  var keycloakAuth = new Keycloak('keycloak.json');
  keycloakAuth.init({
    onLoad: 'login-required'
  })
  .success(function() {
    auth = keycloakAuth;
  })
  .error(function() {
      //document.location.reload();
  });
}

document.getElementById('say_hello').onclick = function () {
  document.getElementById('cloudResponse').innerHTML = "<p>Calling Cloud.....</p>";
  $fh.cloud(
      {
        path: 'keycloak-demo/needs-authentication',
        data: {},
        headers: {
          'Authorization': 'Bearer ' + auth.token
        }
      },
      function (res) {
        document.getElementById('cloudResponse').innerHTML = "<p>" + res.msg + "</p>";
      },
      function (code, errorprops, params) {
        alert('An error occured: ' + code + ' : ' + errorprops);
      }
  );
};
