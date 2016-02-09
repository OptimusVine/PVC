The goal of this project is to create a simple UI that can:

1. read from PLM
2. Allow the user to enter data
3. Send an email that contains the user entered data and data from PLM


TODO:
: AUTH
	: Maintain Logged in Status through all sessions on browser
		: Get a JWT into $window.localstorage
		: Once logged in, with token, refreshing a page should not take you back to login
		: Logging out should remove the JWT from the browser
		: routes/index isLoggedIn will return false if the user has logged out
: TEST
	: Build test cases to ensure all "restricted" endpoints require a user to be logged in
: Update workspace controller and other controllers to have router only control the routes
: Build error handling helper that will pass support messages
	: If PLM gives Error 500, give ability to 
		: Check for Ping
		: Re-Authorize
: List the date created next to the comments


HOW JWT WILL WORK
	: A successful authentication via passport will create a Token
		var myToken = jwt.sign({ payload: ????}, secret);
	: Payload will be the USER with Google, Facebook and Local Auth
	: That token will be sent via the request to angularApp.js


Requirements
- When a user goes to the site, it will prompt for wines 
- The user will enter data into a text box
- An email will be generated to kjiel@clubw.com with the wine info and the data entered
- Wines, and their details will require authentication to access
- To get authorization, a passcode is required (which limits who can signup)

I have added and changed this file.