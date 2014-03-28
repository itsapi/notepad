var CLIENT_ID = '331834941851-br3a7jka7qlq4vrvhcte54do7ho031ut.apps.googleusercontent.com';
var SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

function checkAuth(cb) {
  gapi.auth.authorize(
      {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': true},
      cb);
}

function handleAuthResult(authResult) {
  if (authResult.error) {
    gapi.auth.authorize(
        {'client_id': CLIENT_ID, 'scope': SCOPES, 'immediate': false},
        handleAuthResult);
  } else {
    console.log('Successfully Authorized');
  }
}

function drive_upload(filename, filetype, filedata, cb) {
  const boundary = '-------314159265358979323846';
  const delimiter = "\r\n--" + boundary + "\r\n";
  const close_delim = "\r\n--" + boundary + "--";

  var metadata = {
    'title': filename,
    'mimeType': filetype
  };

  var base64Data = btoa(filedata);
  var multipartRequestBody =
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: ' + filetype + '\r\n' +
      'Content-Transfer-Encoding: base64\r\n' +
      '\r\n' +
      base64Data +
      close_delim;

  var request = gapi.client.request({
      'path': '/upload/drive/v2/files',
      'method': 'POST',
      'params': {'uploadType': 'multipart'},
      'headers': {
        'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
      },
      'body': multipartRequestBody});

  request.execute(cb);
}

function new_status(message) {
  status_bar.classList.remove('on');
  setTimeout(function () {
    console.log(message);
    status_bar.innerText = message;
    status_bar.classList.add('on');
    setTimeout(
      (function (old) {
        return function () {
          if (status_bar.innerText == old) {
            status_bar.classList.remove('on');
          }
        };
    })(message), 7000);
  }, 500)
}