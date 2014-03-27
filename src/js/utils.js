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