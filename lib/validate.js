'use strict';
const grammars = {};

const loadDefaultGrammars = () => {
    [
        'aol',
        'gmail',
        'google.com',
        'hotmail',
        'icloud',
        'yahoo'
    ].forEach((provider) => {
        const grammar = require(`./grammars/${provider}`);
        exports.addGrammar(grammar.domain, grammar.validate);
    });
};

exports.addGrammar = (domain, validationFn) => {
    domain = domain.toLocaleString();
    grammars[domain] = validationFn;
};

exports.validate = (localpart, domain) => {
    domain = domain.toLocaleString();
    return !grammars[domain] || grammars[domain](localpart);
};

loadDefaultGrammars();