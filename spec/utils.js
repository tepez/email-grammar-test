'use strict';
const _ = require('lodash');
const validate = require('..').validate;



exports.strOfLength = (length) => {
    return _.times(length, _.constant('a')).join('');
};

exports.initFixtures = () => {
    beforeEach(() => {
        jasmine.addMatchers({
            toPassValidation: () => {
                return {
                    compare: (localpart, domain) => {
                        const result = {
                            pass: validate(localpart, domain)
                        };
                        result.message = result.pass
                            ? `expected ${localpart} to be invalid for ${domain}`
                            : `expected ${localpart} to be valid for ${domain}`;
                        return result;
                    }
                }
            }
        });
    });

    beforeEach(function () {
        const spec = this;
        spec.punction = '!"#$%&\'()*+,-./:;<=>?@[\]^_`{|}~';
        spec.digits = '0123456789';
        spec.letters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    });
};