function ToggleBtn(element, name, cb, _default) {
  this.cb = cb;
  this.element = element;

  this.on = name + ': On';
  this.off = name + ': Off';
  this.value = _default;

  if (_default) {
    this.element.innerHTML = this.on;
  } else {
    this.element.innerHTML = this.off;
  }

  this.toggle = function () {
    if (this.value) {
      this.element.innerHTML = this.off;
      this.value = false;
    } else {
      this.element.innerHTML = this.on;
      this.value = true;
    }
    this.cb(this.value);
  };

  this.set = function (value) {
    this.value = value;
    if (this.value) {
      this.element.innerHTML = this.on;
    } else {
      this.element.innerHTML = this.off;
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

var mkdn_toggle = new ToggleBtn(
  mkdn_btn,
  'Markdown',
  function (value) {
    save_settings();
    update_mkdn();
  },
  false);

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

    mkdn_box.innerText = edit_box.value;

  }
}

function update_file_name() {
  title.innerHTML = 'Notepad - ' + file_name.value;
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

function new_status(message) {
  status_bar.classList.remove('on');
  setTimeout(function () {
    console.log(message);
    status_bar.innerHTML = message;
    status_bar.classList.add('on');
    setTimeout(
      (function (old) {
        return function () {
          if (status_bar.innerHTML == old) {
            status_bar.classList.remove('on');
          }
        };
    })(message), 7000);
  }, 500)
}