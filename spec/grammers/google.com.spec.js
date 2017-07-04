'use strict';
const _ = require('lodash');
const Utils = require('../utils');


const domain = 'google.com';


describe('Google.com grammar', () => {
    let spec;

    afterEach(() => spec = null);

    beforeEach(function () {
        spec = this;
    });

    Utils.initFixtures();

    describe('valid emails', () => {
        it('valid single character', () => {
            _.forEach(spec.letters + spec.digits + '_\'', (char) => {
                expect(`${char}`).toPassValidation(domain);
            });
        });

        it('valid length', () => {
            _.range(1, 65).forEach((length) => {
                expect(Utils.strOfLength(length)).toPassValidation(domain);
            });
        });

        it('allowed start char', () => {
            _.forEach(spec.letters + spec.digits + '_-\'', (char) => {
                expect(`${char}aaaaa`).toPassValidation(domain);
            });
        });

        it('allowed end char', () => {
            _.forEach(spec.letters + spec.digits +  + '_-\'', (char) => {
                expect(`aaaaa${char}`).toPassValidation(domain);
            });
        });

        it('allowed middle char', () => {
            _.forEach(spec.letters + spec.digits + '_-\'.', (char) => {
                expect(`aaa${char}aaa`).toPassValidation(domain);
            });
        });

        it('everything after + is ignored', () => {
            expect(`aaaaaa+${spec.punction}`).toPassValidation(domain);
            expect(`aaaaaa+...`).toPassValidation(domain);
        });
    });

    describe('invalid emails', () => {
        it('invalid single character', () => {
            _.forEach(spec.punction.replace(/[_']/g,''), (char) => {
                expect(char).not.toPassValidation(domain);
            });
        });

        it('invalid length', () => {
            _.range(65, 70).forEach((length) => {
                expect(Utils.strOfLength(length)).not.toPassValidation(domain);
            });
        });

        it('invalid start char', () => {
            _.forEach(spec.punction.replace(/[_\-']/g, ''), (char) => {
                expect(`${char}aa`).not.toPassValidation(domain);
            });
        });

        it('invalid end char', () => {
            _.forEach(spec.punction.replace(/[_\-'\+]/g, ''), (char) => {
                expect(`aa${char}`).not.toPassValidation(domain);
            });
        });

        it('invalid middle char', () => {
            _.forEach(spec.punction.replace(/[_\-'\+\.]/g, ''), (char) => {
                expect(`aa${char}aaa`).not.toPassValidation(domain);
            });
        });

        it('invalid part before plus (+)', () => {
            expect('+t1').not.toPassValidation(domain);
            expect('<+t1').not.toPassValidation(domain);
        })
    });
});
