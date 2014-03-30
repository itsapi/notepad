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

function addEvent(elem, type, eventHandle) {
    if (elem == null || typeof(elem) == 'undefined') return
    if (elem.addEventListener) {
        elem.addEventListener(type, eventHandle, false)
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + type, eventHandle)
    } else {
        elem["on" + type] = eventHandle
    }
}
