# Membean - jQuery Ajax Retry

Retry ajax calls using the deferred API

## Development

cd into working directory

`cd ~/jquery-ajax-retry`

install deps

`npm install`

run grunt, this will lint, concat and uglify into ./dist

`./node_modules/grunt/bin/grunt`

## In Production

include minified version of plugin in page

```
<script src="dist/jquery.ajax-retry.min.js"></script>
```

## Usage

The `retry` function is chained to an `$.ajax` call and receives the following arguments:

- `exponential` – Whether or not to do exponential backoff when retrying requests (Defaults to `false`).
- `onRetry` - A callback function that will be called on each failure, prior to the delay and subsequent retry. Receives `currentAttempt`, `totalAttempts`, and `msUntilNextAttempt` when triggered.
- `statusCodes` - A list of HTTP status codes that will trigger retries.
- `times` - The total number of Ajax requests to attempt.
- `timeout` - When in normal mode, the number of milliseconds to delay before retrying. In exponential mode, the number of milliseconds of the first delay. For example, in normal mode a value of `1000` will wait one second between each Ajax request. In exponential mode, a value of `1000` will wait 1 second before the first retry, 2 seconds before the second retry, 4 seconds before the third retry, and so on...

```javascript
/* Normal Mode */

$.ajax({
  url: "https://httpstat.us/408?sleep=2000",
  timeout: 1000,
})
  .retry({
    statusCodes: [408],
    times: 3, // This will try the request a total of 3 times.
    timeout: 500,
  })
  .fail(function (jqxhr, textStatus, errorThrown) {
    console.log("Status: ", textStatus);
    console.log("StatusCode: ", jqxhr.status);
    console.log("Error: ", errorThrown);
  });
```

```javascript
/* Exponential Mode */

var retryCallback = function (
  currentAttempt,
  totalAttempts,
  msUnitlNextAttempt
) {
  console.log("Current Attempt: ", currentAttempt);
  console.log("Total Attempts: ", totalAttempts);
  console.log("Will try again in " + msUnitlNextAttempt + "milliseconds");
};

$.ajax({
  url: "https://httpstat.us/408?sleep=2000",
  timeout: 1000,
})
  .retry({
    exponential: true,
    onRetry: retryCallback,
    statusCodes: [408],
    times: 3,
    timeout: 1000, // Will retry exponentially (1s, 2s, 4s, 8s...)
  })
  .fail(function (jqxhr, textStatus, errorThrown) {
    console.log("Status: ", textStatus);
    console.log("StatusCode: ", jqxhr.status);
    console.log("Error: ", errorThrown);
  });
```

## Downloads

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/membean/jquery-ajax-retry/master/dist/jquery.ajax-retry.min.js
[max]: https://raw.githubusercontent.com/membean/jquery-ajax-retry/master/dist/jquery.ajax-retry.js

## License

Forked https://github.com/johnkpaul/jquery-ajax-retry  
Licensed under the MIT license.
