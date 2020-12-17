/*
  jquery.ajax-retry
  TODO: DOCS
*/

(function(factory) {
    if (typeof define === 'function' && define.amd) {
      // AMD. Register as an anonymous module.
      define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node/CommonJS
        factory(require('jquery'));
    } else {
      // Browser globals
      factory(jQuery);
    }
})(function($) {
  $.ajax = (function ($oldAjax) {
    // on fail, retry by creating a new Ajax deferred
    function updateAttempts(opt) {
      this._attempts = (!this._attempts) ? 1 : this._attempts + 1;
    }
    return function (settings) {
      var a = $oldAjax(settings);
      return a.always(updateAttempts);
    };
  })($.ajax);
 // generates a fail pipe function that will retry `jqXHR` `times` more times
  function pipeFailRetry(jqXHR, opts) {
    var times = opts.times;
    var timeout = jqXHR.timeout;
    var onRetry = opts.onRetry;
    var nextAttemptIn = opts.timeout;

    // takes failure data as input, returns a new deferred
    return function(input, status, msg) {
      var ajaxOptions = this;
      var output = new $.Deferred();
      var retryAfter = jqXHR.getResponseHeader('Retry-After');
      var totalAttempts = (times - 1) + this._attempts;

      // whenever we do make this request, pipe its output to our deferred
      function nextRequest() {
        var selectedTimeout = (opts.exponential) ? timeout * 2 : opts.timeout;
        $.ajax(ajaxOptions)
          .retry({
            times: times - 1,
            exponential: opts.exponential,
            timeout: selectedTimeout,
            statusCodes: opts.statusCodes,
            onRetry: onRetry
          })
          .pipe(output.resolve, output.reject);
      }

      if (times > 1 && (!jqXHR.statusCodes || $.inArray(input.status, jqXHR.statusCodes) > -1)) {
        // implement Retry-After rfc
        // http://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.37
        if (retryAfter) {
          // it must be a date
          if (isNaN(retryAfter)) {
            timeout = new Date(retryAfter).getTime() - $.now();
          // its a number in seconds
          } else {
            timeout = parseInt(retryAfter, 10) * 1000;
          }
          // ensure timeout is a positive number
          if (isNaN(timeout) || timeout < 0) {
            timeout = jqXHR.timeout;
          }
        }
        // there is a timeout and we are going to retry again
        if (timeout !== undefined){
          if (onRetry) {
            onRetry(this._attempts, totalAttempts, nextAttemptIn);
          }
          setTimeout(nextRequest, timeout);
        } else {
          nextRequest();
        }
      } else {
        // no times left, reject our deferred with the current arguments
        if (onRetry) { onRetry(this._attempts, totalAttempts, null); }
        output.rejectWith(this, arguments);
      }

      return output;
    };
  }

  // enhance all ajax requests with our retry API
  $.ajaxPrefilter(function(options, originalOptions, jqXHR) {
    jqXHR.retry = function(opts) {
      if (opts.timeout) {
        this.timeout = opts.timeout;
      }
      if (opts.statusCodes) {
        this.statusCodes = opts.statusCodes;
      }
      return this.pipe(null, pipeFailRetry(this, opts)).done(function() {
        
      });
    };
  });

});
