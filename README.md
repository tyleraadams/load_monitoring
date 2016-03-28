# Load Monitoring

This is a load monitoring app. It runs the `uptime` command every ten seconds and displays that data in a chart that is updated live. It creates alerts when the two-minute average load exceeds 1.

Uses node v5.7.1 (npm v3.6.0).

Make sure MongoDB is running. `mongod` command.

Run `npm i`, and `gulp` to get started

Works best in Chrome browser.

Optimal display of data happens when we have ten minutes worth of data. Must wait 20 seconds for enough data to exist to display a line. (This was improved upon based on feedback.)

The main logic for the application live in the `app/managers` directory for the server, and then in `app/src/alerts.js` and `app/src/uptimes.js` for the client.

##Areas to improve

Need to handle the first ten minutes before enough data has accumulated more elegantly.

I would prefer to use sockets to eliminate AJAX polling.

The src scripts could be divided up into views and models for a cleaner separation of concerns.

I would love to have indiviudal data points appear with more statistics when you hover over them on the chart.

Definitely need to expand error handling. The problem where there was no line being drawn without a refresh upon starting the application could have easily been caught with proper error messages.

##Tests
To run tests, make sure you have mocha installed. `npm install -g mocha` and run `mocha` from inside the directory.
