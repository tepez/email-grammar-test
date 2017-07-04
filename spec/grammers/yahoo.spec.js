'use strict';
const _ = require('lodash');
const Utils = require('../utils');


const domain = 'yahoo.com';


describe('Yahoo grammar', () => {
    let spec;

    afterEach(() => spec = null);

    beforeEach(function () {
        spec = this;
    });

    Utils.initFixtures();

    describe('primary addresses', () => {
        describe('valid emails', () => {
            it ('valid length', () => {
                _.range(4, 33).forEach((length) => {
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
                _.forEach(spec.letters + spec.digits + '_.', (char) => {
                    expect(`aa${char}a`).toPassValidation(domain);
                });
            });
        });

        describe('invalid emails', () => {
            it('invalid length', () => {
                _.range(0, 4).forEach((length) => {
                    expect(Utils.strOfLength(length)).not.toPassValidation(domain);
                });

                _.range(33, 40).forEach((length) => {
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
                _.forEach(spec.punction.replace(/[\._\-]/g,''), (char) => {
                    expect(`aa${char}aa`).not.toPassValidation(domain);
                });
            });

            it('more than one dots (.)', () => {
                expect('a.a.a').not.toPassValidation(domain);
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

    describe('disposable addresses', () => {
        describe('valid emails', () => {
            it ('valid length', () => {
                _.range(1, 32).forEach((length) => {
                    const base = Utils.strOfLength(length);
                    const keyword = Utils.strOfLength(length);
                    expect(`${base}-${keyword}`).toPassValidation(domain);
                });
            });

            it('base must be letter, number, underscore', () => {
                _.forEach(spec.letters + spec.number + '_', (char) => {
                    expect(`aa${char}-00`).toPassValidation(domain);
                    expect(`a${char}a-00`).toPassValidation(domain);
                });
            });

            it('keyword must be letter, number, underscore', () => {
                _.forEach(spec.letters + spec.number, (char) => {
                    expect(`aa-${char}00`).toPassValidation(domain);
                    expect(`aa-0${char}0`).toPassValidation(domain);
                    expect(`aa-00${char}`).toPassValidation(domain);
                });
            });
        });

        describe('invalid emails', () => {
            it('invalid base length', () => {
                _.range(33, 40).forEach((length) => {
                    const base = Utils.strOfLength(length);
                    const keyword = 'aa';
                    expect(`${base}-${keyword}`).not.toPassValidation(domain);
                });
            });

            it('invalid keyword length', () => {
                _.range(33, 40).forEach((length) => {
                    const base = 'aa';
                    const keyword = Utils.strOfLength(length);
                    expect(`${base}-${keyword}`).not.toPassValidation(domain);
                });
            });

            it('invalid base', () => {
                _.forEach(spec.punction.replace('_', ''), (char) => {
                    expect(`${char}aa-00`).not.toPassValidation(domain);
                    expect(`aa${char}aa-00`).not.toPassValidation(domain);
                    expect(`aa${char}-00`).not.toPassValidation(domain);
                });
            });

            it('invalid keyword', () => {
                _.forEach(spec.punction, (char) => {
                    expect(`aa-${char}00`).not.toPassValidation(domain);
                    expect(`aa-00${char}00`).not.toPassValidation(domain);
                    expect(`aa-00${char}`).not.toPassValidation(domain);
                });
            });
        });
    });
});

