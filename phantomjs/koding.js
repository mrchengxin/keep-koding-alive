var page = require('webpage').create(), system = require('system'), username, password;
var isFirstTimeEnterWorkspace = true;
var isFirstTimeEnterRunning = true;

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
		console.log('[INFO] Reload page ' + currentUrl);
		page.reload();
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
						if (isFirstTimeEnterRunning) {
							isFirstTimeEnterRunning = false;
							console.log('[INFO] Running!!!');
							console.log('[INFO] Terminate old sessions and create a new session...');
							// close all sessions, and create a new session
							page.evaluateJavaScript(function() {
								setTimeout(function() {
									document.getElementsByClassName('plus')[0].click();
									setTimeout(function() {
										var sessionMenu = document.getElementsByClassName('new-terminal')[0].nextElementSibling;
										sessionMenu.className = sessionMenu.className.replace('hidden', '');
										if (document.getElementsByClassName('terminate-all').length > 0) {
											document.getElementsByClassName('terminate-all')[0].click();
											setTimeout(function() {
												document.getElementsByClassName('plus')[0].click();
												setTimeout(function() {
													var newSessionMenu = document.getElementsByClassName('new-terminal')[0].nextElementSibling;
													newSessionMenu.className = newSessionMenu.className.replace('hidden', '');
													setTimeout(function() {
														document.getElementsByClassName('new-session')[0].click();
													}, 1000);
												}, 1000);
											}, 5000);
										} else {
											document.getElementsByClassName('new-session')[0].click();
										}
									}, 1000);
								}, 5000);
							});
							setTimeout(function() {
								console.log('[INFO] ' + new Date());
								phantom.exit();
							}, 15000);
						} else {
							console.log('[WARN] Check running again.');
						}
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
		console.log('[FAIL] Fail to load page https://koding.com/Login');
		console.log('[INFO] Reload page https://koding.com/Login');
		page.reload();
	}
});

// force kill this phantomJS thread if it's still alive after 3 mins
setTimeout(function() {
	console.log('[WARN] Force killed!!!');
	phantom.exit();
}, 180000);
