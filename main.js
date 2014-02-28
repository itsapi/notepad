var buttons = document.getElementById('buttons');
var open_btn = document.getElementById('open-btn');
var save_btn = document.getElementById('save-btn');
var file_name = document.getElementById('file-name');
var font_btn = document.getElementById('font-btn');
var mkdn_btn = document.getElementById('mkdn-btn');
var edit_box = document.getElementById('edit-box');
var open_dilg = document.getElementById('open-dilg');
var mkdn_box = document.getElementById('mkdn-box');

var mkdn_on = 'Markdown: On';
var mkdn_off = 'Markdown: Off';
var mkdn = false;
mkdn_btn.innerText = mkdn_off;

var mono = 'monospace';
var prop = 'sans-serif';
var font = prop;

function get_edit_text() {
  return edit_box.innerText.replace(/\u00a0/g, ' ');
}

save_btn.onclick = function () {
  var filename = file_name.value;
  if (filename == '') {
    filename = "untitled.txt";
  }
  save_btn.download = filename;
  save_btn.href = 'data:application/octet-stream,' + escape(get_edit_text());
};

open_btn.onclick = function () {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    open_dilg.click();
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
  return false;
};

open_dilg.addEventListener('change', open_file, false);

function open_file(e) {
  var file = e.target.files;

  var reader = new FileReader();
  reader.file = file[0]
  reader.onload = function(e) {

    // For some reason it wont set the value while it's a text input...
    file_name.type = 'hidden';
    file_name.value = this.file.name;
    file_name.type = 'text';

    edit_box.innerText = e.target.result.replace(/ /g, '\u00a0');

    buttons.reset();
    update_mkdn();
  };

  reader.readAsText(file[0]);
}

font_btn.onclick = function () {
  if (font == prop) {
    font = mono;
  } else {
    font = prop;
  }
  update_font();
  save_settings();
  return false;
};

function update_font() {
  if (font == mono) {
    font_btn.classList.remove('prop');
    font_btn.classList.add('mono');
  } else {
    font_btn.classList.remove('mono');
    font_btn.classList.add('prop');
  }
  edit_box.style.fontFamily = font;
}

mkdn_btn.onclick = function () {
  if (mkdn) {
    mkdn = false;
  } else {
    mkdn = true;
  }
  update_mkdn();
  save_settings();
  return false;
};

function update_mkdn() {
  if (mkdn) {
    // Turned on
    mkdn_btn.innerText = mkdn_on;
    mkdn_box.style.display = 'inline-block';
    edit_box.classList.add('mkdn-on');

    var text = get_edit_text();
    mkdn_box.innerHTML = markdown.toHTML(text);

  } else {
    // Turned off
    mkdn_btn.innerText = mkdn_off;
    mkdn_box.style.display = 'none';
    edit_box.classList.remove('mkdn-on');
  }
}

function save_settings() {
  localStorage.setItem('file-name', file_name.value);
  localStorage.setItem('edit-box', edit_box.innerText);
  localStorage.setItem('font', font);
  localStorage.setItem('mkdn', mkdn);
}

function load_settings(argument) {
  file_name.value = localStorage.getItem('file-name');
  edit_box.innerText = localStorage.getItem('edit-box');

  font = localStorage.getItem('font');
  if (font == mono) {
    font = mono;
  } else {
    font = prop;
  }
  update_font();

  mkdn = localStorage.getItem('mkdn');
  if (mkdn == 'true') {
    mkdn = true;
  } else {
    mkdn = false;
  }
  update_mkdn();
}

if (window.localStorage) {
  load_settings()
}

edit_box.addEventListener('input', function () {
  update_mkdn();
  save_settings();
}, false);
window.addEventListener('unload', save_settings, false);
