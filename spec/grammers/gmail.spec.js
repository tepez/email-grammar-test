'use strict';
const _ = require('lodash');
const Utils = require('../utils');


const domain = 'gmail.com';


describe('Gmail grammar', () => {
    let spec;

    afterEach(() => spec = null);

    beforeEach(function () {
        spec = this;
    });

    Utils.initFixtures();

    describe('valid emails', () => {
        it ('valid length', () => {
            _.range(6, 31).forEach((length) => {
                expect(Utils.strOfLength(length)).toPassValidation(domain);
            });
        });

        it('allowed start char', () => {
            _.forEach(spec.letters + spec.digits, (letter) => {
                expect(`${letter}aaaaa`).toPassValidation(domain);
            });
        });

        it('allowed end char', () => {
            _.forEach(spec.letters + spec.digits, (char) => {
                expect(`aaaaa${char}`).toPassValidation(domain);
            });
        });

        it('allowed middle char', () => {
            _.forEach(spec.letters + spec.digits + '.', (char) => {
                expect(`aaa${char}aaa`).toPassValidation(domain);
            });
        });

        it('multiple non-consecutive dots', () => {
            expect('aa.aa.aa').toPassValidation(domain);
            expect('aa.aa.aa.aa').toPassValidation(domain);
        });

        it('everything after + is ignored', () => {
            expect(`aaaaaa+${spec.punction}`).toPassValidation(domain);
            expect(`aaaaaa+...`).toPassValidation(domain);
        });
    });

    describe('invalid emails', () => {
        it('invalid length', () => {
            _.range(0, 6).forEach((length) => {
                expect(Utils.strOfLength(length)).not.toPassValidation(domain);
            });

            _.range(31, 40).forEach((length) => {
                expect(Utils.strOfLength(length)).not.toPassValidation(domain);
            });
        });

        it('invalid length after stripping dots', () => {
            expect('a.a.a.a.a').not.toPassValidation(domain);
        });

        it('invalid start char', () => {
            _.forEach(spec.punction, (char) => {
                expect(`${char}aa`).not.toPassValidation(domain);
            });
        });

        it('invalid end char', () => {
            _.forEach(spec.punction, (char) => {
                expect(`aa${char}`).not.toPassValidation(domain);
            });
        });

        it('invalid middle char', () => {
            _.forEach(spec.punction.replace('.',''), (char) => {
                expect(`aa${char}aaa`).not.toPassValidation(domain);
            });
        });

        it('consecutive dots (.)', () => {
            expect('aaa...aaa').not.toPassValidation(domain);
            expect('aaa..aaa').not.toPassValidation(domain);
        });

        it('invalid part before plus (+)', () => {
            expect('+t1').not.toPassValidation(domain);
            expect('a+t1').not.toPassValidation(domain);
            expect('aa+').not.toPassValidation(domain);
            expect('aaa+t1').not.toPassValidation(domain);
            expect('aaaaa++t1').not.toPassValidation(domain);
        })
    });
});
