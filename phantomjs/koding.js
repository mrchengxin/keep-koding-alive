var page = require('webpage').create(), system = require('system'), username, password;
var isFirstTimeEnterWorkspace = true;

if (system.args.length < 2) {
	console.log('Usage: koding.js <username> <password>');
	phantom.exit();
} else {
	username = system.args[1];
	password = system.args[2];
}

page.viewportSize = { width: 800, height: 600 };

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
						if (document.getElementsByClassName('content-container').length > 0) {
							return document.getElementsByClassName('content-container')[0].firstElementChild.textContent.indexOf('turned off') < 0;
						} else {
							return false;
						}
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
							document.getElementsByClassName('content-container')[0].children[1].click();
						});
					} else if (vmStatus === 'on') {
						console.log('[INFO] Running!!!');
						// close all sessions, and create a new session
						page.evaluate(function() {
							$('div[class*="plus"]').click();
							setTimeout(function() {
								var sessionMenu = $('li[class*="new-terminal"]').next();
								$(sessionMenu).removeClass('hidden');
								if ($('.terminate-all', $(sessionMenu)).length > 0) {
									$('.terminate-all', $(sessionMenu)).click();
									setTimeout(function() {
										$('div[class*="plus"]').click();
										setTimeout(function() {
											var newSessionMenu = $('li[class*="new-terminal"]').next();
											$(newSessionMenu).removeClass('hidden');
											$('.new-session', $(newSessionMenu)).click();
										}, 500);
									}, 500);
								} else {
									$('.new-session', $(sessionMenu)).click();
								}
							}, 500);
						});
						setTimeout(function() {
							console.log('[INFO] ' + new Date());
							phantom.exit();
						}, 5000);
					} else {
						checkVMStatus();
					}
				}, 500);
			};
			if (isFirstTimeEnterWorkspace) {
				page.reload();
				isFirstTimeEnterWorkspace = false;
			} else {
				checkVMStatus();
			}
		}
	}
};


console.log('[INFO] ' + new Date());
page.open('https://koding.com/Login', function(status) {
	if (status !== 'success') {
		console.log('FAIL to load https://koding.com/Login');
	}
});
