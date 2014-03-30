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
  update_file_name()

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