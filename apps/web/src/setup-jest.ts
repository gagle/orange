import 'jest-preset-angular/setup-jest';

// Monkey-patch console.error messages like:
//
// > NG0304: Can't bind to 'property-X' since it isn't a known property of 'component-Y'
//
// Check issue https://github.com/angular/angular/issues/36430
//
// These errors were logged but the tests were passing. With this monkey-path
// the error now is displayed as follows and the tests will fail:
//
// > NG0304: 'component-Y' is not a known element

// eslint-disable-next-line @typescript-eslint/unbound-method
const originalConsoleError = window.console.error;

const regExp = /^(NG0303|NG0304)/;

// eslint-disable-next-line no-console
// eslint-disable-next-line @typescript-eslint/no-explicit-any
console.error = (...args: any[]): void => {
  const message = args[0]?.toString();
  if (message?.match(regExp)) {
    const err = new Error(message);
    // eslint-disable-next-line no-console
    Error.captureStackTrace(err, console.error);
    throw err;
  }

  originalConsoleError(...args);
};
