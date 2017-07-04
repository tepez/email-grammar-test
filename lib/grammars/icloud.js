'use strict';
const TokenStream = require('../tokenStream');


/**
    Email address validation plugin for icloud.com email addresses.

    Notes:
        3-20 characters
        must start with letter
        must end with letter or number
        must use letters, numbers, dot (.) or underscores (_)
        no consecutive dot (.) or underscores (_)
        case is ignored
        any number of plus (+) are allowed if followed by at least one alphanum

    Grammar:
        local-part -> icloud-prefix { [ dot | underscore ] icloud-root }
        icloud-suffix
        icloud-prefix = alpha
        icloud-root = alpha | num | plus
        icloud-suffix = alpha | num

    Other limitations:
        * Length of local-part must be no more than 20 characters, and no less than 3 characters.

    Open questions:
        * Are dot-underscore (._) or underscore-dot (_.) allowed?
        * Is name.@icloud.com allowed?
 */

const ALPHA = /^[A-Za-z]+/;
const ALPHANUM = /^[A-Za-z0-9]+/;
const ICLOUD_PREFIX = /^[A-Za-z]+/;
const ICLOUD_BASE = /^[A-Za-z0-9\+]+/;
const DOT = /^\./;
const UNDERSCORE = /^\_/;

const _validate = (localpart) => {
    const stream = new TokenStream(localpart);

    // localpart must start with alpha
    if (!stream.getToken(ICLOUD_PREFIX)) return false;

    while (true) {
        // optional dot or underscore
        stream.getToken(DOT) || stream.getToken(UNDERSCORE);

        if (!stream.getToken(ICLOUD_BASE)) break;
    }

    return stream.endOfStream();
};

exports.validate = (localpart) => {
    // check string exists and not empty
    if (!localpart) return false;

    const lparts = localpart.split('+');
    const real_localpart = lparts[0];

    // length check
    if (real_localpart.length < 3 || real_localpart.length > 20) return false;

    // can not end with +
    if (localpart[localpart.length - 1] === '+') return false;

    // must start with letter
    if (!ALPHA.test(real_localpart[0])) return false;

    // must end with letter or digit
    if (!ALPHANUM.test(real_localpart[real_localpart.length - 1])) return false;

    // check grammar
    return _validate(real_localpart);
};

exports.domain = 'icloud.com';