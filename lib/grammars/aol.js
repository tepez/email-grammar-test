'use strict';
const TokenStream = require('../tokenStream');


/**
    Email address validation plugin for aol.com email addresses.

    Notes:
        3-32 characters
        must start with letter
        must end with letter or number
        must use letters, numbers, dot (.) or underscores (_)
        no consecutive dot (.) or underscores (_)
        no dot-underscore (._) or underscore-dot (_.)
        case is ignored

    Grammar:
        local-part  ->  alpha { [ dot | underscore ] ( alpha | num ) }
 */

const ALPHA = /^[A-Za-z]+/;
const ALPHANUM = /^[A-Za-z0-9]+/;
const DOT = /^\./;
const UNDERSCORE = /^_/;


const _validate = (localpart) => {
    // Grammar: local-part -> alpha  { [ dot | underscore ] ( alpha | num ) }
    const stream = new TokenStream(localpart);

    // local-part must being with alpha
    if (!stream.getToken(ALPHA)) return false;

    while (true) {
        stream.getToken(DOT) || stream.getToken(UNDERSCORE);

        if (!stream.getToken(ALPHANUM)) break;
    }

    // alpha or numeric must be end of stream
    return stream.endOfStream();
};

exports.validate = (localpart) => {
    // check string exists and not empty
    if (!localpart) return false;

    // length check
    if (localpart.length < 3 || localpart.length > 32) return false;

    // must start with letter
    if (!ALPHA.test(localpart[0])) return false;

    // must end with letter or digit
    if (!ALPHANUM.test(localpart[localpart.length - 1])) return false;

    // grammar check
    return _validate(localpart);
};

exports.domain = 'aol.com';
