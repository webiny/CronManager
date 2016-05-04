var assert = require('assert'),
	test = require('selenium-webdriver/testing');

var webdriver = require('selenium-webdriver'),
	By = require('selenium-webdriver').By,
	until = require('selenium-webdriver').until;

test.before(function () {
	this.timeout(15000);
	driver = new webdriver.Builder()
		.withCapabilities(webdriver.Capabilities.chrome())
		.build();
});

test.after(function () {
	driver.quit().then(this.done);
});

// tests
test.describe('Login Page', function () {
	it('should display the login form', function (done) {
		this.timeout(15000);

		// open login page
		driver.get('http://demo.app/admin/login').then(function () {
			driver.wait(until.elementLocated({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[3]/input'})).then(function () {
				done();
			});
		});
	});

	it('should populate the login form with invalid data and it should show the alert', function (done) {
		// populate email input
		emailInput = driver.findElement({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[3]/input'});
		emailInput.sendKeys('foobar@webiny.com');

		// populate password input
		passwordInput = driver.findElement({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[4]/input'});
		passwordInput.sendKeys('dev-password-123');

		// submit form
		driver.findElement({className: 'btn btn-lg btn-primary'}).click().then(function () {
			driver.wait(until.elementLocated({className: 'alert alert-danger alert-dismissable'})).then(function () {
				// reset the input fields
				emailInput.clear();
				passwordInput.clear();

				done();
			});
		});
	});

	it('should populate the form with valid data, submit the form and should redirect to the dashboard', function (done) {
		// populate email input
		emailInput.sendKeys('sven@webiny.com');

		// populate password input
		passwordInput.sendKeys('dev');

		// submit form
		driver.findElement({className: 'btn btn-lg btn-primary'}).click().then(function () {
			driver.wait(until.elementLocated({id: 'left-sidebar'})).then(function () {
				done();
			});
		});
	});
});