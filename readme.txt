The goal of this project is to create a simple UI that can:

1. read from PLM
2. Allow the user to enter data
3. Send an email that contains the user entered data and data from PLM


TODO:
: TEST 1
	: Create a new Wine via the UI
	: Add a comment to the wine
	: Add a Todo, that ToDo should populate into Asana
	: That Todo should be linked to the Wine and be visible in /todos
	: Default Assignee of Task is [NULL]
	: Click "reassign" and have a form that lets me select assignees
	: Select Kjiel, this should update to [KJIEL]
	: /:wine page should have a summary
		: Number of comments
		: Number of Todos (with closest due date
		

: AUTH

: TEST
	: Build test cases to ensure all "restricted" endpoints require a user to be logged in
: Update workspace controller and other controllers to have router only control the routes
: Build error handling helper that will pass support messages
	: If PLM gives Error 500, give ability to 
		: Check for Ping
		: Re-Authorize
: List the date created next to the comments

ADAM - Asana ID: 51033105522142

Requirements
- When a user goes to the site, it will prompt for wines 
- The user will enter data into a text box
- An email will be generated to kjiel@clubw.com with the wine info and the data entered
- Wines, and their details will require authentication to access
- To get authorization, a passcode is required (which limits who can signup)

I have added and changed this file.