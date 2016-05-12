import {TestSuite, By, until} from './../../../../Core/Js/Webiny/Modules/Core/TestLib/TestSuite';
var driver = TestSuite.getDriver();

describe('Login Page', function () {
	this.timeout(10000);

	it('should display the login form', function (done) {
		// open login page
		driver.get('http://selecto.app:8001/admin/login').then(function () {
			driver.wait(until.elementLocated({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[3]/div/input'})).then(function () {
				done();
			});
		});
	});

	it('should populate the login form with invalid data and it should show the alert', function (done) {
		// populate email input
		var emailInput = driver.findElement({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[3]/div/input'});
		emailInput.sendKeys('foobar@webiny.com');

		// populate password input
		var passwordInput = driver.findElement({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[4]/div/input'});
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
		var emailInput = driver.findElement({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[3]/div/input'});
		emailInput.sendKeys('pavel@webiny.com');

		// populate password input
		var passwordInput = driver.findElement({xpath: '/html/body/webiny-app/rad-placeholder/webiny-form-container/div/div/form/layout/div[4]/div/input'});
		passwordInput.sendKeys('dev');

		// submit form
		driver.findElement({className: 'btn btn-lg btn-primary'}).click().then(function () {
			driver.wait(until.elementLocated({id: 'left-sidebar'})).then(function () {
				done();
			});
		});
	});
});