'use strict';
const Jasmine = require('jasmine');
const JasmineSpecReporter = require('jasmine-spec-reporter');
const JasmineReporters = require('jasmine-reporters');


const jasmine = new Jasmine();
jasmine.loadConfig({
    spec_dir: 'spec',
    spec_files: [
        '**/*.spec.js'
    ],
    helpers: [
        'helpers/**/*.js'
    ]
});
jasmine.addReporter(new JasmineReporters.JUnitXmlReporter({
    package: 'spec',
    useDotNotation: false,
    savePath: 'reports',
    filePrefix: 'spec'
}));
jasmine.addReporter(new JasmineSpecReporter.SpecReporter({
    spec: {
        displayDuration: true,
        displayStacktrace: true,
        displaySuccessful: true
    },
    summary: {
        displayFailed: true,
        displayPending: true
    }
}));

// Disable default dots reporter since we use jasmine-spec-reporter
jasmine.configureDefaultReporter({
    print: () => {}
});

jasmine.execute();



