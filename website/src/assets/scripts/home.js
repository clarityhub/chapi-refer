var domain = $('#site-url').data().siteUrl;
var requestDomain = domain.split('.').pop();

$(document).ready(function () {
  // TODO set correct form action...
  $('#refer__email-form').attr('action', `api.clarityhub.${requestDomain}/refer`);

  var allCookies = document.cookie.concat('');
  var shortId = allCookies.replace(/(?:(?:^|.*;\s*)shortId\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  if (shortId) {
    // SET banner thingy
    alert('You already have a referral link:' + shortId);
  }
});

function success() {  
  if (this.status > 399) {
    $('#refer__error').text(JSON.parse(this.response).reason || this.statusText);
  } else {
    // set cookie
    var refId = JSON.parse(this.response).shortId;
    var cookieDom = domain.substring(0, domain.length-1).split('.');
    cookieDom.shift();
    var newCookie = ['shortId=', refId, ';domain=', '.'.concat(cookieDom.join('.')), ';path=/;'].join('');
    document.cookie = newCookie;

    // redirect to thingy
    var referUrl = ['https://www.clarityhub.', requestDomain, 'refer'].join('');
    location = referUrl;
  }
}

$('#refer__email-form').submit(function (event) {
  event.preventDefault();

  $('#refer__error').text('');
  // TODO set loading state

  var referrer = window.location.href.split('#').length > 1 ? window.location.href.split('#').pop() : null;

  data = {
    email: event.target[0].value,
    shortId: referrer,
  }

  var reqUrl = ['https://api.clarityhub.', requestDomain, 'refer'].join('');

  var oReq = new XMLHttpRequest();
  oReq.onload = success;
  oReq.open('POST', reqUrl, true);
  oReq.setRequestHeader('Content-Type', 'application/json');
  oReq.send(JSON.stringify(data));
});


