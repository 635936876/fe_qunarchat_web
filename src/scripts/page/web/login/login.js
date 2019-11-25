var dayjs = require('../../../lib/dayjs/index.js')
require('../../../lib/jsEncrypt/index.js')

var pubKeyFullkey;
$.ajax({
	url: '/package/qtapi/nck/rsa/get_public_key.do',
	type: 'GET',
	success: function (res) {
		pubKeyFullkey = res.data.pub_key_fullkey;
	}
});

var username;
var password;
$(document).keyup(function (event) {
	if (event.keyCode == 13) {
		$("#submit").trigger("click");
	}
});
$("#submit").click(function () {
	var logname = document.getElementById("logname").value;
	var logpass = document.getElementById("logpass").value;
	var jsencrypt = new JSEncrypt();
	jsencrypt.setPublicKey(pubKeyFullkey);
	if (window.nav_igator.Login.loginType === 'password') {
		var uinfo = {
			p: logpass,
			a: 'testapp',
			u: logname,
			d: dayjs().format('YYYY-MM-DD HH:mm:ss')
		};
		username = logname;
		password = jsencrypt.encrypt(JSON.stringify(uinfo)).toString('base64');
		document.cookie = 'username=' + username + '; path=/;'
		document.cookie = 'password=' + password + '; path=/;'
		var phone = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
		if (!phone) {
		  window.location.href = '/webchat/web/?shopId=shop_1&strid=admin'
		} else {
		  window.location.href = '/webchat/touch/?shopId=shop_1&strid=admin'
		} 
	} else if (window.nav_igator.Login.loginType === 'newpassword') {
		var newEncrypted = jsencrypt.encrypt(logpass);
		var requestData = {
			p: newEncrypted,
			h: window.nav_igator.baseaddess.domain,
			u: logname,
			mk: generateUUID(),
			plat: "web"
		};
		$.ajax({
			url: '/newapi/nck/qtlogin.qunar',
			type: 'POST',
			dataType: 'json',
			data: JSON.stringify(requestData),
			contentType: 'application/json',
			success: function (res) {
				var token = res.data.t;
				var uinfo = {
					nauth: {
					  p: token,
					  u: logname + '@' + window.nav_igator.baseaddess.domain,
					  mk: requestData.mk
					}
				  };
				username = logname;
				password = JSON.stringify(uinfo);
				document.cookie = 'username=' + username + '; path=/;'
				document.cookie = 'password=' + password + '; path=/;'
				var phone = /Android|webOS|iPhone|iPod|BlackBerry/i.test(navigator.userAgent);
				if (!phone) {
				  window.location.href = '/webchat/web/?shopId=shop_1&strid=admin'
				} else {
				  window.location.href = '/webchat/touch/?shopId=shop_1&strid=admin'
				} 
			}
		});
	}
})

function generateUUID() {
	var d = new Date().getTime();
	var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = (d + Math.random() * 16) % 16 | 0;
		d = Math.floor(d / 16);
		return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
	});
	return uuid;
};