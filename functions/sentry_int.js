// or use es6 import statements
// import * as Sentry from '@sentry/node';

// or use es6 import statements
// import * as Tracing from '@sentry/tracing';





setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);