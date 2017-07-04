'use strict';
const EmailGrammarTest = require('..');


describe('.addGrammar()', () => {
    it('should disable validation when given null', () => {
        expect(EmailGrammarTest.validate('aaa', 'gmail.com')).toBe(false);
        EmailGrammarTest.addGrammar('gmail.com', null);
        expect(EmailGrammarTest.validate('aaa', 'gmail.com')).toBe(true);
    });

    it('should customize validation when given a function', () => {
        const validateFnTrue = jasmine.createSpy('validateFn').and.returnValue(true);
        const validateFnFalse = jasmine.createSpy('validateFn').and.returnValue(false);

        expect(EmailGrammarTest.validate('aaa', 'foo.bar')).toBe(true);

        EmailGrammarTest.addGrammar('foo.bar', validateFnFalse);
        expect(EmailGrammarTest.validate('aaa', 'foo.bar')).toBe(false);

        expect(validateFnFalse.calls.count()).toBe(1);
        expect(validateFnTrue.calls.count()).toBe(0);

        EmailGrammarTest.addGrammar('foo.bar', validateFnTrue);
        expect(EmailGrammarTest.validate('aaa', 'foo.bar')).toBe(true);

        expect(validateFnFalse.calls.count()).toBe(1);
        expect(validateFnTrue.calls.count()).toBe(1);
    });
});