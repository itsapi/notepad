var buttons   = document.getElementById('buttons');
var open_btn  = document.getElementById('open-btn');
var save_btn  = document.getElementById('save-btn');
var file_name = document.getElementById('file-name');
var font_btn  = document.getElementById('font-btn');
var mkdn_btn  = document.getElementById('mkdn-btn');
var spell_btn = document.getElementById('spell-btn');
var edit_box  = document.getElementById('edit-box');
var open_dilg = document.getElementById('open-dilg');
var mkdn_box  = document.getElementById('mkdn-box');

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
    edit_box.innerText = edit_box.innerText;
    edit_box.focus();
  },
  true);
spell_btn.onclick = function () { spell_toggle.toggle(); };

function save_settings() {
  localStorage.setItem('file-name', file_name.value);
  localStorage.setItem('edit-box', edit_box.innerText);
  localStorage.setItem('font', font_toggle.value);
  localStorage.setItem('mkdn', mkdn_toggle.value);
  localStorage.setItem('spell', spell_toggle.value);
}

function load_settings() {
  file_name.value = localStorage.getItem('file-name');
  edit_box.innerText = localStorage.getItem('edit-box');

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

    var text = get_edit_text();
    mkdn_box.innerHTML = markdown.toHTML(text);

  } else {
    // Turned off
    mkdn_box.style.display = 'none';
    edit_box.classList.remove('mkdn-on');
  }
}

edit_box.addEventListener('input', function () {
  edit_box.innerText = get_edit_text();
  update_mkdn();
  save_settings();
}, false);
window.addEventListener('unload', save_settings, false);

function get_edit_text() {
  return edit_box.innerText.replace(/\u00a0/g, ' ');
}

save_btn.onclick = function () {
  var filename = file_name.value;
  if (filename == '') {
    filename = 'untitled.txt';
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

function open_file(e) {
  var file = e.target.files;

  var reader = new FileReader();
  reader.file = file[0]
  reader.onload = function(e) {

    // For some reason it wont set the value while it's a text input...
    file_name.type = 'hidden';
    file_name.value = this.file.name;
    file_name.type = 'text';

    edit_box.innerText = e.target.result;

    buttons.reset();
    update_mkdn();
  };

  reader.readAsText(file[0]);
}

open_dilg.addEventListener('change', open_file, false);