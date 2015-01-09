#!/usr/bin/env node

var program = require('commander');

var pkg = require('../package.json'),
    prerelease = require('../src/index.js');

program
    .version(pkg.version)
    .usage('[options]');

program
    .command('')
    .description('Prepare a patch release');

program
    .command('patch')
    .description('Prepare a patch release')
    .action(function() {
        prerelease.bump('patch');
    });

program
    .command('minor')
    .description('Prepare a minor release')
    .action(function() {
        prerelease.bump('minor');
    });

program
    .command('major')
    .description('Prepare a major release')
    .action(function() {
        prerelease.bump('major');
    });

program
    .command('pre-release')
    .description('Prepare a RC release')
    .action(function() {
        prerelease.bump('pre-release');
    });

program.parse(process.argv);

// Default command
if (program.args.length === 0) {
    prerelease.bump('patch');
}
