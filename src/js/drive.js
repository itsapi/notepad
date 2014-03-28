var CLIENT_ID = '331834941851-br3a7jka7qlq4vrvhcte54do7ho031ut.apps.googleusercontent.com';
var SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

function checkAuth(cb) {
  gapi.auth.authorize(
    {'client_id': CLIENT_ID, 'scope': SCOPES.join(' '), 'immediate': true},
    cb);
}

drive_save_btn.onclick = function () {
  var filename = file_name.value;
  if (filename == '') {
    filename = 'untitled.txt';
  }

  function handleAuthResult(authResult) {
    if (authResult) {

      var request = new ajaxRequest()
      request.onreadystatechange = function() {
        if (request.readyState == 4) {
          if (request.status == 200 || window.location.href.indexOf("http") == -1) {
            console.log(request.responseText)
            alert('Added to Drive.')
          } else {
            console.log("An error occured while making the request")
          }
        }
      }
      request.open("POST", "https://www.googleapis.com/upload/drive/v2/files?uploadType=media", true)
      request.setRequestHeader("Content-Type", "text/plain")
      request.setRequestHeader("Authorization", "Bearer " + gapi.auth.getToken().access_token)
      request.send(edit_box.value)

    } else {
      // No access token could be retrieved, force the authorization flow.
      gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        handleAuthResult);
    }
  }

  checkAuth(handleAuthResult);
};