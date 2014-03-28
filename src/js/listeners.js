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

font_btn.onclick = function () { font_toggle.toggle(); };
mkdn_btn.onclick = function () { mkdn_toggle.toggle(); };
spell_btn.onclick = function () { spell_toggle.toggle(); };

// This event is triggered after you select a file
//  in the process started above.
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
