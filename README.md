# Membean - jQuery Ajax Retry

Retry ajax calls using the deferred API

## Development

cd into working directory
```cd ~/jquery-ajax-retry```

install deps
```npm install```

run grunt, this will lint, concat and uglify into ./dist
```./node_modules/grunt/bin/grunt```


## In Production

Load plugin into page:

[min]: https://raw.githubusercontent.com/membean/jquery-ajax-retry/master/dist/jquery.ajax-retry.min.js

## Usage in exponential mode:

```
  // Total number of network attempts
  var TOTAL_ATTEMPTS = 5;

  // $.ajax options
  var options = {
    url: 'https://httpstat.us/200'
  };

  /*
    times [number] - total number of network attempts.

    timeout [number] - if exponential, this will be the first base timeout, otherwise it will be the timeout between each netwrok call.

    exponential [boolean] - enable or disable exponential backoff strategy

    onRetry [function] - Callback function that provides to params. This gets called after each network call.
      params
        currentAttempt [number] - number of total network calls that has been attempted.
        msUntilNextAttempt [number] - ms until the next network call attempt.
  */

  $.ajax(options).retry({
    times: TOTAL_ATTEMPTS, // total number of network attempts, can be variable or set.
    timeout: 1000, //
    exponential: true,
    onRetry: function (currentAttempt, msUntilNextAttempt) {
      console.log('currentAttempt', currentAttempt)
      console.log('msUntilNextAttempt', msUntilNextAttempt);
      console.log('Attempt ' + currentAttempt + ' of ' + TOTAL_ATTEMPTS + ' failed. Retrying again in ' + (msUntilNextAttempt/1000) + ' seconds...')
    }
  })
```

## Usage in regular mode
```
  $.ajax(options).retry({times:3}).then(function(){
    alert("success!");
  });  

  //this has the same sematics as above, except will wait 3 seconds between attempts
  $.ajax(options).retry({times:3, timeout:3000}).then(function(){
    alert("success!");
  });  

  //this will only retry if the response status code matches the ones we specify
  $.ajax(options).retry({times:3, statusCodes: [503, 504]}).then(function(){
    alert("success!");
  });
```

## Downloads

Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/membean/jquery-ajax-retry/master/dist/jquery.ajax-retry.min.js
[max]: https://raw.githubusercontent.com/membean/jquery-ajax-retry/master/dist/jquery.ajax-retry.js


## Release History

## License
Forked https://github.com/johnkpaul/jquery-ajax-retry  
Licensed under the MIT license.
