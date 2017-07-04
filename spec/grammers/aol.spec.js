'use strict';
const _ = require('lodash');
const Utils = require('../utils');


const domain = 'aol.com';


describe('AOL grammar', () => {
    let spec;

    afterEach(() => spec = null);

    beforeEach(function () {
        spec = this;
    });

    Utils.initFixtures();

    describe('valid emails', () => {
        it ('valid length', () => {
            _.range(3, 33).forEach((length) => {
                expect(Utils.strOfLength(length)).toPassValidation(domain);
            });
        });

        it('allowed start char', () => {
            _.forEach(spec.letters, (letter) => {
                expect(`${letter}aaa`).toPassValidation(domain);
            });
        });

        it('allowed end char', () => {
            _.forEach(spec.letters + spec.digits, (char) => {
                expect(`aaa${char}`).toPassValidation(domain);
            });
        });

        it('allowed middle char', () => {
            _.forEach(spec.letters + spec.digits + '._', (char) => {
                expect(`aa${char}aa`).toPassValidation(domain);
            });
        });

        it('multiple non-consecutive dots', () => {
            expect('a.a.a').toPassValidation(domain);
            expect('a.a.a.a').toPassValidation(domain);
        });

        it('multiple non-consecutive underscores', () => {
            expect('a_a_a').toPassValidation(domain);
            expect('a_a_a_a').toPassValidation(domain);
        });

        it('non-consecutive underscore and dot', () => {
            expect('a_a.a').toPassValidation(domain);
            expect('a.a_a').toPassValidation(domain);
        });
    });

    describe('invalid emails', () => {
        it('invalid length', () => {
            _.range(0, 3).forEach((length) => {
                expect(Utils.strOfLength(length)).not.toPassValidation(domain);
            });

            _.range(34, 40).forEach((length) => {
                expect(Utils.strOfLength(length)).not.toPassValidation(domain);
            });
        });

        it('invalid start char', () => {
            _.forEach(spec.punction + spec.digits, (char) => {
                expect(`${char}aa`).not.toPassValidation(domain);
            });
        });

        it('invalid end char', () => {
            _.forEach(spec.punction, (char) => {
                expect(`aa${char}`).not.toPassValidation(domain);
            });
        });

        it('invalid middle char', () => {
            _.forEach(spec.punction.replace(/[\._]/g,''), (char) => {
                expect(`aa${char}aa`).not.toPassValidation(domain);
            });
        });

        it('consecutive dots (.)', () => {
            expect('aa..aa').not.toPassValidation(domain);
            expect('aa...aa').not.toPassValidation(domain);
        });

        it('consecutive underscores (_)', () => {
            expect('aa__aa').not.toPassValidation(domain);
            expect('aa___aa').not.toPassValidation(domain);
        });

        it(' dot-underscore (._) or underscore-dot (_.)', () => {
            expect('aa._aa').not.toPassValidation(domain);
            expect('aa_.aa').not.toPassValidation(domain);
        });
    });
});
