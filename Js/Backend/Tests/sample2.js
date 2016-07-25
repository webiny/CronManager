/* eslint-disable */
import {TestSuite, By, until} from 'Webiny/TestSuite';
var driver = TestSuite.getDriver();

// Load optional test data
var data = TestSuite.loadData(__dirname + '/data.json');

// Prepare element selectors
var emailSelector = By.css('input[type="text"]');
var passwordSelector = By.css('input[type="password"]');

describe('Login Page', function () {
    this.timeout(10000);

    it('should display the login form', function (done) {
        // open login page
        driver.get(TestSuite.getConfig('webPath') + '/admin/login').then(function () {
            driver.wait(until.elementLocated(emailSelector)).then(function () {
                done();
            });
        });
    });

    it('should populate the login form with invalid data and it should show the alert', function (done) {
        // populate email input
        var emailInput = driver.findElement(emailSelector);
        emailInput.sendKeys('foobar@webiny.com');

        // populate password input
        var passwordInput = driver.findElement(passwordSelector);
        passwordInput.sendKeys('dev-password-123');

        // submit form
        driver.findElement({className: 'btn btn-lg btn-primary'}).click().then(function () {
            driver.wait(until.elementLocated({className: 'alert alert-error'})).then(function () {
                // reset the input fields
                emailInput.clear();
                passwordInput.clear();

                done();
            });
        });
    });

    it('should populate the form with valid data, submit the form and should redirect to the dashboard', function (done) {
        // populate email input
        var emailInput = driver.findElement(emailSelector);
        emailInput.sendKeys(data.login.username);

        // populate password input
        var passwordInput = driver.findElement(passwordSelector);
        passwordInput.sendKeys(data.login.password);

        // submit form
        driver.findElement({className: 'btn btn-lg btn-primary'}).click().then(function () {
            driver.wait(until.elementLocated({id: 'left-sidebar'})).then(function () {
                done();
            });
        });
    });
});