'use strict';
const _ = require('lodash');
const Utils = require('../utils');


const domain = 'icloud.com';


describe('iCloud grammar', () => {
    let spec;

    afterEach(() => spec = null);

    beforeEach(function () {
        spec = this;
    });

    Utils.initFixtures();

    describe('valid emails', () => {
        it ('valid length', () => {
            _.range(3, 21).forEach((length) => {
                expect(Utils.strOfLength(length)).toPassValidation(domain);
            });
        });

        it('allowed start char', () => {
            _.forEach(spec.letters, (letter) => {
                expect(`${letter}aa`).toPassValidation(domain);
            });
        });

        it('allowed end char', () => {
            _.forEach(spec.letters + spec.digits, (char) => {
                expect(`aa${char}`).toPassValidation(domain);
            });
        });

        it('allowed middle char', () => {
            _.forEach(spec.letters + spec.digits + '_', (char) => {
                expect(`a${char}a`).toPassValidation(domain);
            });
        });

        it('everything after + is ignored', () => {
            expect(`aaaaaa+${spec.punction}`).toPassValidation(domain);
            expect(`aaaaaa+${spec.digits}${spec.letters}`).toPassValidation(domain);
            expect(`aaaaaa+...`).toPassValidation(domain);
        });
    });

    describe('invalid emails', () => {
        it('invalid length', () => {
            _.range(0, 3).forEach((length) => {
                expect(Utils.strOfLength(length)).not.toPassValidation(domain);
            });

            _.range(21, 30).forEach((length) => {
                expect(Utils.strOfLength(length)).not.toPassValidation(domain);
            });
        });

        it('invalid start char', () => {
            _.forEach(spec.punction + spec.digits, (char) => {
                expect(`${char}a`).not.toPassValidation(domain);
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
        });

        it('consecutive underscore (_)', () => {
            expect('aa__aa').not.toPassValidation(domain);
        });

        it('ends in plus (+)', () => {
            expect('aaaa+').not.toPassValidation(domain);
        });
    });
});
