# email-grammar-test [![Build Status](https://travis-ci.org/tepez/email-grammar-test.svg?branch=master)](https://travis-ci.org/tepez/email-grammar-test)

> Check email address against known restrictions of popular email providers

Many major email service providers have their own custom grammars.
If an email address does not follow those grammars than it cannot possibly be a valid email address.
For example "aaa@gmail.com" is not a valid email address because gmail requires the localpart of the address
to be at least 6 characters.

Currently supported ESPs:
* AOL
* Gmail
* Google.com
* Hotmail
* iCloud
* Yahoo

PRs for more ESPs are welcomed!

## Install

```
$ npm install email-grammar-test
```


## Usage

```js
const EmailGrammarTest = require('email-grammar-test');

// aaa is too short to be a gmail address
EmailGrammarTest.validate('aaa', 'gmail.com')
//=> false

// aaabbb is fine
EmailGrammarTest.validate('aaabbb', 'gmail.com')
//=> true

// we don't know nothing about foo.bar, so return true
EmailGrammarTest.validate('aaabbb', 'foo.bar')
```


## API

### validate(localpart, domain)

#### localpart
Type: `string`

The localpart part of the address, i.e. what's before the @

#### domain
Type: `domain`

The domain part of the address, i.e. what's after the @

### addGrammar(domain, validationFn)

#### domain
Type: `string`

The domain to add custom validation for.

#### validationFn
Type: `function` / `null`

A function that gets a localpart and returns true/false if it's valid/invalid for that domain.
Or null - to turn off the validation for that domain.

## License

MIT © [tepez](https://tepez.co.il)

Based on [https://github.com/mailgun/flanker](mailgun/flanker).