# google-analytics-sales-reports
Generates monthly printable sales reports from Google Analytics for your web shop

1. You will need a Google Analytics account 

2. Create the project in the Google API Console, enable the API, and create credentials. 
https://developers.google.com/analytics/devguides/reporting/core/v3/quickstart/web-js
The Oauth client ID credentials should look like this: {unique-id}.apps.googleusercontent.com

3. Paste the credentials into settings.js variable var CLIENT_ID = '{YOUR ID HERE}';

4. Make sure the account name(s) in settings.js match the websites you want to create reports for.
The google account where we ran this had identical names for the account == property == profile for each website.
You may need to edit a bit in scripts.js in functions handleAccounts(); handleProperties() and handleProfiles, if your google account structure looks differently
Look at the info folder and the images there for more info

5. Host the website locally at port :8080, or any other port, but remember that the Google API project should be configured with the same port

6. Open AnalyticsWeb2019.html in your browser, choose an account, year and month and click Authorize and log into the Google Analytics account that you want to generate reports for

7. Once the report is generated, you can print it - example pdf report in the /info folder

SPECIAL THANKS TO BLINDMAN67 for the timedqueue.js

### FUTURE UPDATES PLANNED ###

*Create a more flexible accounts/properties/profiles selection for potential different account structure

*Use promises instead of timedqueue
