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
