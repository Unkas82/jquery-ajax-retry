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

Usage:

```
  // $.ajax options
  var options = {
    url: 'https://httpstat.us/200'
  };
  $.ajax(options).retry({
    times: 5, // total number of network calls
    timeout: 1000,
    exponential: true,
    onRetry: function(retries, timeRemaining) {
      console.log('onRetry', retries, timeRemaining);
    }
  })
```

## Downloads
Download the [production version][min] or the [development version][max].

[min]: https://raw.githubusercontent.com/membean/jquery-ajax-retry/master/dist/jquery.ajax-retry.min.js
[max]: https://raw.githubusercontent.com/membean/jquery-ajax-retry/master/dist/jquery.ajax-retry.js


## Release History

## License
Forked https://github.com/johnkpaul/jquery-ajax-retry  
Licensed under the MIT license.
