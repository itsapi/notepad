var buttons   = document.getElementById('buttons');
var new_btn  = document.getElementById('new-btn');
var open_btn  = document.getElementById('open-btn');
var save_btn  = document.getElementById('save-btn');
var drive_save_btn  = document.getElementById('drive-save-btn');
var file_name = document.getElementById('file-name');
var files_list = document.getElementById('files-list');
var font_btn  = document.getElementById('font-btn');
var mkdn_btn  = document.getElementById('mkdn-btn');
var spell_btn = document.getElementById('spell-btn');
var edit_box  = document.getElementById('edit-box');
var open_dilg = document.getElementById('open-dilg');
var mkdn_box  = document.getElementById('mkdn-box');

var CLIENT_ID = '331834941851-br3a7jka7qlq4vrvhcte54do7ho031ut.apps.googleusercontent.com';
var SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

function ToggleBtn(element, name, cb, _default) {
  this.cb = cb;
  this.element = element;

  this.on = name + ': On';
  this.off = name + ': Off';
  this.value = _default;

  if (_default) {
    this.element.innerText = this.on;
  } else {
    this.element.innerText = this.off;
  }

  this.toggle = function () {
    if (this.value) {
      this.element.innerText = this.off;
      this.value = false;
    } else {
      this.element.innerText = this.on;
      this.value = true;
    }
    this.cb(this.value);
  };

  this.set = function (value) {
    this.value = value;
    if (this.value) {
      this.element.innerText = this.on;
    } else {
      this.element.innerText = this.off;
    }
    this.cb(this.value);
  };
}

var font_toggle = new ToggleBtn(
  font_btn,
  'Mono-space',
  function (value) {
    save_settings();
    if (value) {
      edit_box.style.fontFamily = 'monospace';
    } else {
      edit_box.style.fontFamily = 'sans-serif';
    }
  },
  false);
font_btn.onclick = function () { font_toggle.toggle(); };

var mkdn_toggle = new ToggleBtn(
  mkdn_btn,
  'Markdown',
  function (value) {
    save_settings();
    update_mkdn();
  },
  false);
mkdn_btn.onclick = function () { mkdn_toggle.toggle(); };

var spell_toggle = new ToggleBtn(
  spell_btn,
  'Spell Check',
  function (value) {
    save_settings();
    edit_box.spellcheck = value;
    text = edit_box.value, edit_box.value = '', edit_box.value = text;
    edit_box.focus();
  },
  true);
spell_btn.onclick = function () { spell_toggle.toggle(); };


function ajaxRequest() {
  var activexmodes = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]
  if (window.ActiveXObject) {
    for (var i = 0; i < activexmodes.length; i++) {
      try {
        return new ActiveXObject(activexmodes[i])
      } catch(e) {
        console.log('No HttpRequest object.')
      }
    }
  } else if (window.XMLHttpRequest) {
    return new XMLHttpRequest()
  } else {
    return false
  }
}

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

  checkAuth(
    function (authResult) {
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
  );
};

function save_settings() {
  localStorage.setItem('file-name', file_name.value);
  localStorage.setItem('edit-box', edit_box.value);
  localStorage.setItem('font', font_toggle.value);
  localStorage.setItem('mkdn', mkdn_toggle.value);
  localStorage.setItem('spell', spell_toggle.value);
}

function load_settings() {
  file_name.value = localStorage.getItem('file-name');
  edit_box.value = localStorage.getItem('edit-box');

  var store_font = localStorage.getItem('font');
  var font = (store_font == 'true') ? true : false

  var store_mkdn = localStorage.getItem('mkdn');
  mkdn = (store_mkdn == 'true') ? true : false

  var store_spell = localStorage.getItem('spell');
  spell = (store_spell == 'true') ? true : false

  if (store_font != undefined) {
    font_toggle.set(font);
  }
  if (store_mkdn != undefined) {
    mkdn_toggle.set(mkdn);
  }
  if (store_spell != undefined) {
    spell_toggle.set(spell);
  }
}

if (window.localStorage) {
  load_settings()
}
font_toggle.cb(font_toggle.value);
mkdn_toggle.cb(mkdn_toggle.value);
spell_toggle.cb(spell_toggle.value);

function update_mkdn() {
  if (mkdn_toggle.value) {
    // Turned on
    mkdn_box.style.display = 'inline-block';
    edit_box.classList.add('mkdn-on');

    mkdn_box.innerHTML = markdown.toHTML(edit_box.value);

  } else {
    // Turned off
    mkdn_box.style.display = 'none';
    edit_box.classList.remove('mkdn-on');
  }
}

edit_box.addEventListener('input', function () {
  update_mkdn();
  save_settings();
}, false);
window.addEventListener('unload', save_settings, false);

save_btn.onclick = function () {
  var filename = file_name.value;
  if (filename == '') {
    filename = 'untitled.txt';
  }
  save_btn.download = filename;
  save_btn.href = 'data:text/octet-stream,' + escape(edit_box.value);
};

open_btn.onclick = function () {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    open_dilg.click();
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
  return false;
};

function open_file(e) {
  var file = e.target.files;

  var reader = new FileReader();
  reader.file = file[0]
  reader.onload = function(e) {

    // For some reason it wont set the value while it's a text input...
    file_name.type = 'hidden';
    file_name.value = this.file.name;
    file_name.type = 'text';

    edit_box.value = e.target.result;

    buttons.reset();
    update_mkdn();
  };

  reader.readAsText(file[0]);
}

open_dilg.addEventListener('change', open_file, false);

document.onkeydown = function(e) {
  if (e.ctrlKey) {
    if (e.keyCode === 83) {
      console.log('ctrl-s');
      save_btn.click();
      return false;
    } else if (e.keyCode === 79) {
      console.log('ctrl-o');
      open_btn.click();
      return false;
    }
  };
};
