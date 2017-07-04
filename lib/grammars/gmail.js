'use strict';
const TokenStream = require('../tokenStream');


/**
    Email address validation plugin for gmail.com email addresses.

    Notes:
        must be between 6-30 characters
        must start with letter or number
        must end with letter or number
        must use letters, numbers, or dots (.)
        consecutive dots (..) are not permitted
        dots (.) at the beginning or end are not permitted
        case is ignored
        plus (+) is allowed, everything after + is ignored

    1. All characters prefixing the plus symbol (+) and stripping all dot
    symbol (.) must be between 6-30 characters.

    Grammar:
        local-part       ->      main-part [ tags ]
        main-part        ->      alphanum { [dot] alphanum }
        tags             ->      { + [ dot-atom ] }
        dot-atom    	 ->      atom { [ dot   atom ] }
        atom             ->      { A-Za-z0-9!#$%&'*+\-/=?^_`{|}~ }
        alphanum         ->      alpha | num
        dot              ->      .
 */

const ATOM = /[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+/;
const GMAIL_BASE = /[A-Za-z0-9\.]+/;
const ALPHANUM = /[A-Za-z0-9]+/;
const PLUS = /[\+]/;
const DOT = /[\.]/;

function _validate(localpart) {
    const stream = new TokenStream(localpart);

    while (true) {
        // get alphanumeric portion
        if (!stream.getToken(ALPHANUM)) return false;

        // get optional dot, must be followed by more alphanumerics
        if (!stream.getToken(DOT)) break;
    }

    // optional tags
    _tags(stream);

    return stream.endOfStream();
}

function _tags(stream) {
    while (true) {
        // plus sign
        if (!stream.getToken(PLUS)) break;

        // optional atom
        stream.getToken(ATOM);
    }

    return true;
}

exports.validate = (localpart) => {
    // check string exists and not empty
    if (!localpart) return false;

    const lparts = localpart.split('+');
    const real_localpart = lparts[0];
    const stripped_localpart = real_localpart.replace(/\./g, '');

    // length check
    if (stripped_localpart.length < 6 || stripped_localpart.length > 30) return false;

    // must start with letter or num
    if (!ALPHANUM.test(real_localpart[0])) return false;

    // must end with letter or num
    if (!ALPHANUM.test(real_localpart[real_localpart.length - 1])) return false;

    // grammar check
    return _validate(real_localpart);
};

exports.domain = 'gmail.com';