addEvent(edit_box, 'input', function () {
  update_mkdn();
  save_settings();
});

addEvent(window, 'unload', save_settings);

addEvent(save_btn, 'click', function () {
  var filename = file_name.value;
  if (filename == '') {
    filename = 'untitled.txt';
  }
  save_btn.download = filename;
  save_btn.href = 'data:text/octet-stream,' + escape(edit_box.value);
});

addEvent(open_btn, 'click', function () {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    open_dilg.click();
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
  return false;
});

addEvent(print_btn, 'click', function() {
  window.print();
});

// This event is triggered after you select a file
//  in the process started above.
addEvent(open_dilg, 'change', open_file);

addEvent(drive_save_btn, 'click', function () {
  var filename = file_name.value;
  if (filename == '') {
    filename = 'untitled.txt';
  }

  checkAuth(function (authResult) {
    handleAuthResult(authResult);
    new_status('Uploading...')
    drive_upload(
      filename,
      'text/plain',
      edit_box.value,
      function (response) {
        if (!response.error) {
          message = 'File uploaded to Drive successfully.';
        } else {
          message = 'Failed to upload to Drive, please try again.';
        }
        new_status(message);
      });
  });
});

addEvent(font_btn, 'click', function () { font_toggle.toggle(); });
addEvent(mkdn_btn, 'click', function () { mkdn_toggle.toggle(); });
addEvent(spell_btn, 'click', function () { spell_toggle.toggle(); });
addEvent(file_name, 'input', function () { update_file_name(); });

addEvent(document, 'keydown', function(e) {
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
});

addEvent(edit_box, 'keydown', function (e) {
  if (e.keyCode === 9) {
    var start = this.selectionStart;
    var end = this.selectionEnd;
    var value = e.target.value;

    e.target.value = value.substring(0, start) + '\t' + value.substring(end);
    this.selectionStart = this.selectionEnd = start + 1;

    e.preventDefault();
  }
});
