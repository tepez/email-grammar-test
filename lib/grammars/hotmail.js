'use strict';
const TokenStream = require('../tokenStream');


/**
    Email address validation plugin for hotmail.com email addresses.

    Notes:
        1-64 characters
        must start with letter or number
        must end with letter, number, hyphen (-), or underscore (_)
        must use letters, numbers, periods (.), hypens (-), or underscores (_)
        only one plus (+) is allowed
        case is ignored

    Grammar:
        local-part      ->  main-part [ tags ]
        main-part       ->  hotmail-prefix hotmail-root hotmail-suffix
        hotmail-prefix  ->  alpha | number
        hotmail-root    ->  alpha | number | period | hyphen | underscore
        hotmail-suffix  ->  alpha | number | hyphen | underscore
        tags            ->  + [ hotmail-root ]

    Other limitations:
        1. Only one consecutive period (.) is allowed in the local-part
        2. Length of local-part must be no more than 64 characters, and no
        less than 1 characters.
**/

const HOTMAIL_PREFIX = /^[A-Za-z0-9]+/;
const HOTMAIL_BASE = /^[A-Za-z0-9\.\-\_]+/;
const HOTMAIL_SUFFIX = /^[A-Za-z0-9\-\_]+/;
const PLUS = /^\+/;
const PERIODS = /\.\./;

const _validate = (localpart) => {
    const stream = new TokenStream(localpart);

    // get the hotmail base
    if (!stream.getToken(HOTMAIL_BASE)) return false;

    // optional tags
    _tags(stream);

    return stream.endOfStream();
};

const _tags = (stream) => {
    return stream.getToken(PLUS) || stream.getToken(HOTMAIL_BASE);
};

exports.validate = (localpart) => {
    // check string exists and not empty
    if (!localpart) return false;

    // remove tag if it exists
    const lparts = localpart.split('+');
    const real_localpart = lparts[0];

    // no more than one plus (+)
    if (lparts.length > 2) return false;

    // length check
    if (real_localpart.length < 1 || real_localpart.length > 64) return false;

    // start can only be alphanumeric
    if (!HOTMAIL_PREFIX.test(real_localpart[0])) return false;

    // can not end with dot
    if (!HOTMAIL_SUFFIX.test(real_localpart[real_localpart.length - 1])) return false;

    // no consecutive periods (..)
    if (PERIODS.test(localpart)) return false;

    // grammar check
    return _validate(real_localpart);
};

exports.domain = 'hotmail.com';