var page = require('webpage').create(), system = require('system'), username, password;

if (system.args.length < 2) {
	console.log('Usage: koding.js <username> <password>');
	phantom.exit();
} else {
	username = system.args[1];
	password = system.args[2];
}

page.onLoadStarted = function() {
	var currentUrl = page.evaluate(function() {
		return window.location.href;
	});
	console.log('[INFO] Current page ' + currentUrl + ' will gone...');
	console.log('[INFO] Now loading a new page...');
};

page.onLoadFinished = function(status) {
	var currentUrl = page.evaluate(function() {
		return window.location.href;
	});
	if (status !== 'success') {
		console.log('[FAIL] Fail to load page ' + currentUrl);
		phantom.exit();
	} else {
		console.log('[INFO] Page ' + currentUrl + ' loaded...');
		if (currentUrl == 'https://koding.com/Login') {
			console.log('[INFO] Login now!!!');
			page.evaluate(function(username, password) {
				$('[name="username"]').val(username);
				$('[name="password"]').val(password);
				$('[testpath="login-button"]').submit();
			}, username, password);
		} else if (currentUrl == 'https://koding.com/IDE/koding-vm-0/my-workspace') {
			function checkVMStatus() {
				setTimeout(function() {
					var isDialogDisplayed = page.evaluateJavaScript(function() {
						return document.getElementsByClassName('kdmodal-shadow').length > 0;
					});
					var isLoadingStatus = page.evaluateJavaScript(function() {
						return document.getElementsByClassName('content-container')[0].firstElementChild.textContent.indexOf('turned off') < 0;
					});
					var vmStatus = 'checking';
					if (isDialogDisplayed) {
						if (!isLoadingStatus) {
							vmStatus = 'off';
						}
					} else {
						vmStatus = 'on';
					}
					if (vmStatus === 'off') {
						console.log('[INFO] Turn it on now!!!');
						page.evaluateJavaScript(function() {
							document.getElementsByClassName('content-container')[0].children[1].click()
						});
					} else if (vmStatus === 'on') {
						console.log('[INFO] Running!!!');
						console.log('[INFO] ' + new Date());
						phantom.exit();
					} else {
						checkVMStatus();
					}
				}, 500);
			};
			checkVMStatus();
		}
	}
};

page.open('https://koding.com/Login', function(status) {
	if (status !== 'success') {
		console.log('FAIL to load https://koding.com/Login');
	}
});
