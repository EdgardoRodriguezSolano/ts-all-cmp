var textArea = document.getElementsByTagName('textarea')[0];

function setCheckedStatus(el) {
  if (el.checked) {
    el.closest('.toggle_container').setAttribute('data-checked', 'true')
  }
  else {
    el.closest('.toggle_container').setAttribute('data-checked', 'false')
  }
}


Array.from(document.querySelectorAll('input')).forEach(input => {
  input.addEventListener('keyup', () => {
    updateUrl();
  })
  input.addEventListener('change', (e) => {
    setCheckedStatus(e.target);
    updateUrl();
  })
})

textArea.addEventListener('keyup', () => {
  window.sessionStorage.setItem('didomi-config', JSON.stringify(getConfig(textArea.value.replace(/\s\s+/g, ' ')).json));
})




function updateUrl() {

  var params = Array.from(document.querySelectorAll('[type="text"][data-qp]')).map(el => {
    return el.getAttribute('data-qp') + '=' + el.value;
  }).join('&');

  params += '&' + Array.from(document.querySelectorAll('[type="checkbox"][data-qp]')).map(el => {
    return el.getAttribute('data-qp') + '=' + (el.checked ? '1' : '0');
  }).join('&');

  var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + params;
  window.history.pushState({ path: newurl }, '', newurl);

}

function updateInputs() {

  Array.from(document.querySelectorAll('[type="text"][data-qp]')).forEach(input => {
    input.value = new URL(document.location.href).searchParams.get(input.getAttribute('data-qp'))
  })

  Array.from(document.querySelectorAll('[type="checkbox"][data-qp]')).forEach(input => {
    input.checked = (parseInt(new URL(document.location.href).searchParams.get(input.getAttribute('data-qp'))) ? true : false);
  })


}

function makeNotice() {
  var apikey = new URL(document.location.href).searchParams.get('apiKey');
  var noticeid = new URL(document.location.href).searchParams.get('notice_id');
  var global = (parseInt(new URL(document.location.href).searchParams.get('global')) ? true : false);
  var staging = (parseInt(new URL(document.location.href).searchParams.get('staging')) ? true : false);


  writeSDK(apikey, noticeid, global, staging)
}

/* Custom JSON */

function prettyPrint() {
  var ugly = textArea.value;
  var obj = JSON.parse(ugly);
  var pretty = JSON.stringify(obj, undefined, 2);
  textArea.value = pretty;
}

function getConfig(text) {
  try {
    JSON.parse(text);
  } catch (e) {
    console.error("Specify a valid JSON value for didomiConfig, error:", e, "received string", { text });
    return { success: false, json: {} };
  }
  return { success: true, json: JSON.parse(text) };
}

textArea.addEventListener('keyup', function () {
  if (!getConfig(this.value).success) {
    this.setAttribute('class', 'invalid')
  }
  else {
    this.setAttribute('class', '')
  }
})


window.onload = function () {
  // Check if a didomiConfig exists in the session storage
  textArea.value = window.sessionStorage.getItem('didomi-config') || '{}';
  prettyPrint();

  if (new URL(document.location.href).searchParams.get('apiKey') && new URL(document.location.href).searchParams.get('notice_id')) {
    updateInputs()
    makeNotice()
  }


  if (!parseInt(new URL(document.location.href).searchParams.get('apply_conf'))) {
    window.sessionStorage.setItem('didomi-config', {});
  }

  Array.from(document.querySelectorAll('[type="checkbox"][data-qp]')).forEach(function (el) {
    setCheckedStatus(el)
  })
}
