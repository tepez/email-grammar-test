'use strict';
const _ = require('lodash');
const Utils = require('../utils');


const domain = 'hotmail.com';


describe('Hotmail grammar', () => {
    let spec;

    afterEach(() => spec = null);

    beforeEach(function () {
        spec = this;
    });

    Utils.initFixtures();

    describe('valid emails', () => {
        it ('valid length', () => {
            _.range(1, 65).forEach((length) => {
                expect(Utils.strOfLength(length)).toPassValidation(domain);
            });
        });

        it('allowed start char', () => {
            _.forEach(spec.letters + spec.digits, (letter) => {
                expect(`${letter}a`).toPassValidation(domain);
            });
        });

        it('allowed end char', () => {
            _.forEach(spec.letters + spec.digits + '-_+', (char) => {
                expect(`a${char}`).toPassValidation(domain);
            });
        });

        it('allowed middle char', () => {
            _.forEach(spec.letters + spec.digits + '.-_', (char) => {
                expect(`a${char}a`).toPassValidation(domain);
            });
        });

        it('multiple non-consecutive dots', () => {
            expect('a.a.a').toPassValidation(domain);
            expect('a.a.a.a').toPassValidation(domain);
        });

        it('one plus (+)', () => {
            expect('a+a').toPassValidation(domain);
            expect('aa+').toPassValidation(domain);
        });
    });

    describe('invalid emails', () => {
        it('invalid length', () => {
            _.range(65, 70).forEach((length) => {
                expect(Utils.strOfLength(length)).not.toPassValidation(domain);
            });
        });

        it('invalid start char', () => {
            _.forEach(spec.punction, (char) => {
                expect(`${char}a`).not.toPassValidation(domain);
            });
        });

        it('invalid end char', () => {
            _.forEach(spec.punction.replace(/[\+_\-]/g, ''), (char) => {
                expect(`aa${char}`).not.toPassValidation(domain);
            });
        });

        it('invalid middle char', () => {
            _.forEach(spec.punction.replace(/[\.\-_\+]/g,''), (char) => {
                expect(`aa${char}aa`).not.toPassValidation(domain);
            });
        });

        it('consecutive dot (.)', () => {
            expect('aa..aa').not.toPassValidation(domain);
            expect('aa...aa').not.toPassValidation(domain);
        });

        it('consecutive plus (+)', () => {
            expect('aa++aa').not.toPassValidation(domain);
            expect('aa+++aa').not.toPassValidation(domain);
        });
    });
});
