The goal of this project is to create a simple UI that can:

1. read from PLM
2. Allow the user to enter data
3. Send an email that contains the user entered data and data from PLM


TODO:
: Figure out how to break out Controllers based on controllers/index.js
	: For now, call each object's controller on the routes/index page and call them as var's
: Update Obj model to be able to store a generic large object for offline work
: Build error handling helper that will pass support messages
	: If PLM gives Error 500, give ability to 
		: Check for Ping
		: Re-Authorize
: When completeing a wine's todo --- hit Wine/:id/Todos/Incomplete with a get and return all outstanding To-Dos
: List the date created next to the comments


Requirements
- When a user goes to the site, it will prompt for wines 
- The user will enter data into a text box
- An email will be generated to kjiel@clubw.com with the wine info and the data entered

I have added and changed this file.