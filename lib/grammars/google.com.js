'use strict';
const TokenStream = require('../tokenStream');


/**
    Email address validation plugin for Google Apps email addresses.

    Notes:
        must be between 1-64 characters
        must use letters, numbers, dash (-), underscore (_), apostrophes ('), and dots (.)
        if one character, must be alphanum, underscore (_) or apostrophes (')
        otherwise must start with: alphanum, underscore (_), dash (-), or apostrophes(')
        otherwise must end with: alphanum, underscore(_), dash(-), or apostrophes(')
        plus (+) is allowed, everything after + is ignored
        case is ignored

    Grammar:
        local-part      ->      main-part [ tags ]
        main-part       ->      google-prefix google-root google-suffix
        tags            ->      { + [ atom ] }
        google-prefix    ->     alphanum | underscore | dash | apostrophe
        google-root      ->     alphanum | underscore | dash | apostrophe | dots
        google-suffix    ->     alphanum | underscore | dash | apostrophe

    Other limitations:
        1. All characters prefixing the plus symbol (+) must be between 1-64 characters.
 */

const ATOM = /^[A-Za-z0-9!#$%&'*+\-/=?^_`{|}~]+/;
const GOOGLE_BASE = /^[A-Za-z0-9_\-'\.]+/;
const ALPHANUM = /^[A-Za-z0-9]+/;
const UNDERSCORE = /^_+/;
const APOSTROPHES = /^'+/;
const PLUS = /^\++/;

const _validate = (localpart) => {
    const stream = new TokenStream(localpart);

    // get the google base
    if (!stream.getToken(GOOGLE_BASE)) return false;

    // optional tags
    _tags(stream);

    return stream.endOfStream();
};

const _tags = (stream) => {
    while (true) {
        // plus sign
        if (!stream.getToken(PLUS)) break;

        // optional atom
        stream.getToken(ATOM);
    }

    return true;
};

exports.validate = (localpart) => {
    // check string exists and not empty
    if (!localpart) return false;

    const lparts = localpart.split('+');
    const real_localpart = lparts[0];

    // length check
    if (real_localpart.length < 1 || real_localpart.length > 64) return false;

    // if only one character, must be alphanum, underscore (_), or apostrophe (')
    if (real_localpart.length === 1) {
        return ALPHANUM.test(localpart) || UNDERSCORE.test(localpart) || APOSTROPHES.test(localpart);
    }

    // must start with: alphanum, underscore (_), dash (-), or apostrophes(')
    const start = real_localpart[0];
    if (!ALPHANUM.test(start) && start !== '_' && start !== '-' && start !== '\'') return false;

    // must end with: alphanum, underscore(_), dash(-), or apostrophes(')
    const end = real_localpart[real_localpart.length - 1];
    if (!ALPHANUM.test(end) && end !== '_' && end !== '-' && end !== '\'') return false;

    // grammar check
    return _validate(real_localpart);
};

exports.domain = 'google.com';