'use strict';
const TokenStream = require('../tokenStream');


/**
    Email address validation plugin for yahoo.com email addresses.

    Notes for primary e-mail:
        4-32 characters
        must start with letter
        must end with letter or number
        must use letters, numbers, underscores (_)
        only one dot (.) allowed
        no consecutive dot (.) or underscore (_)
        no dot-underscore (._) or underscore-dot (_.)
        case is ignored
        tags not supported

    Grammar:
        local-part  ->  alpha  { [ dot | underscore ] ( alpha | num ) }

    Other limitations:
        1. No more than a single dot (.) is allowed in the local-part
        2. Length of local-part must be no more than 32 characters, and no less than 4 characters.

    Notes for disposable e-mails using "AddressGuard":
        example: base-keyword@yahoo.com
        base and keyword may each be up to 32 characters
        base may contain letters, numbers, underscores
        base must start with a letter
        keyword may contain letters and numbers
        a single hyphen (-) connects the base and keyword

    Grammar:
        local-part  ->  alpha { [ alpha | num | underscore ] } hyphen { [ alpha | num ] }
 */

const ALPHA = /^[A-Za-z]+/;
const ALPHANUM = /^[A-Za-z0-9]+/;
const DOT = /^\./;
const UNDERSCORE = /^\_/;
const HYPHEN = /^\-/;

const _validate_disposable = (localpart) => {

    // length check (base + hyphen + keyword)
    if (localpart.length < 3 || localpart.length > 65) return false;

    const parts = localpart.split('-');

    // single hyphen
    if (parts.length > 2) return false;

    // base and keyword length limit
    if (parts.some((part) => part.length < 1 || part.length > 32)) return false;

    // Grammar: local-part  ->  alpha { [ alpha | num | underscore ] } hyphen { [ alpha | num ] }
    const stream = new TokenStream(localpart);

    // must being with alpha
    if (!stream.getToken(ALPHA)) return false;

    while (true) {
        // alpha, num, underscore
        if (!stream.getToken(ALPHANUM) && !stream.getToken(UNDERSCORE)) break;
    }

    // hyphen
    if (!stream.getToken(HYPHEN)) return false;

    // keyword must be alpha, num
    stream.getToken(ALPHANUM);

    return stream.endOfStream();
};

const _validate_primary = (localpart) => {
    // length check
    if (localpart.length < 4 || localpart.length > 32) return false;

    // no more than one dot (.)
    if ((localpart.match(/\./g) || []).length > 1) return false;

    // Grammar: local-part -> alpha  { [ dot | underscore ] ( alpha | num ) }"
    const stream = new TokenStream(localpart);

    // local-part must being with alpha
    if (!stream.getToken(ALPHA)) return false;

    while (true) {
        // optional dot or underscore token
        stream.getToken(DOT) || stream.getToken(UNDERSCORE);

        // alpha or numeric
        if (!stream.getToken(ALPHANUM)) break;
    }

    // alpha or numeric must be end of stream
    return stream.endOfStream();
};

exports.validate = (localpart) => {
    // check string exists and not empty
    if (!localpart) return false;

    // must start with letter
    if (localpart.length < 1 || !ALPHA.test(localpart[0])) return false;

    // must end with letter or digit
    if (!ALPHANUM.test(localpart[localpart.length - 1])) return false;

    // only disposable addresses may contain hyphens
    if (/-/.test(localpart))
        return _validate_disposable(localpart);

    // otherwise, normal validation
    return _validate_primary(localpart)
};

exports.domain = 'yahoo.com';
