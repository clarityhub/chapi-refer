var domain = $('#site-url').data().siteUrl;
var requestDomain = domain.split('.').pop();

function getReferStats() {
  console.log(this.response);
  var count = JSON.parse(this.response).count;

  $('#invite-count').text(count);
}

$(document).ready(function () {
  // TODO read the cookie, build the url
  var shortId =  document.cookie.replace(/(?:(?:^|.*;\s*)shortId\s*\=\s*([^;]*).*$)|^.*$/, "$1");

  var id = window.location.href.split('&').length > 1 ? window.location.href.split('&').pop().split('=').pop() : null;
  var realId = shortId || id;
  
  if (!realId) {
    // Sorry, you don't have a referral page :/
  } else {
    // TODO populate the page with data

    $('#share-link').text(realId);
  
    var reqUrl = ['https://api.clarityhub.', requestDomain, 'refer/', realId].join('');
    var oReq = new XMLHttpRequest();
    oReq.onload = getReferStats;
    oReq.open('GET', reqUrl, true);
    oReq.send();
  }
});