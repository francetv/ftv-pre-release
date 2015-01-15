var RSVP = require('rsvp'),
    ProgressBar = require('progress'),
    inquirer = require("inquirer"),
    ProgressBar = require('progress');

var Version = require('./models/Version'),
    file = require('./file'),
    git = require('./git'),
    bar = new ProgressBar(':bar', {
        total: 60
    });



module.exports = {
    bump: function(mode) {
        var versions = {};

        RSVP.Promise.resolve()
            // Check if package.json file exists
            .then(function() {
                return file.exists('package.json')
                    .then(function(content) {
                        if (content) {
                            versions.npm = content.version || undefined;
                        }
                    });
            })
            // Check if bower.json file exists
            .then(function() {
                return file.exists('bower.json')
                    .then(function(content) {
                        if (content) {
                            versions.bower = content.version || undefined;
                        }
                    });
            })
            // Set the version to release (error if npm & bower versions are different)
            .then(function() {
                if (!Object.keys(versions).length) {
                    throw new Error('Stop release process without any bower.json or package.json file');
                }

                if (versions.npm && versions.bower && versions.npm != versions.bower) {
                    throw new Error('Stop release process, npm and bower version number are different');
                }

                return versions.npm ? versions.npm : versions.bower;
            })
            // Create a version object
            .then(function(currentVersion) {
                bar.tick(10);
                version = new Version(currentVersion);
            })
            // Incremente version number depending on the mode
            .then(function() {
                bar.tick(10);
                version.increment(mode);
            })
            // Ask for confirmation
            .then(function() {
                bar.tick(10);
                var deferred = RSVP.defer();

                process.stdout.write('\n');
                inquirer.prompt([{
                    type: 'confirm',
                    name: 'newVersion',
                    message: 'Here\'s the new version number (' + version.toString() + '), do you confirm?',
                    default: false
                }], function(answers) {
                    if (!answers.newVersion) {
                        return deferred.reject(new Error('New version rejected'));
                    }

                    deferred.resolve();
                });

                return deferred.promise;
            })
            // Check for unstaged or changed files
            .then(function() {
                bar.tick(10);

                return git.exec('diff', ['--exit-code'])
                    .then(function() {
                        return git.exec('diff', ['--cached', '--exit-code']);
                    })
                    .catch(function(error) {
                        var stepError = new Error('GIT - Please, commit your changes or stash them first');
                        throw stepError;
                    });
            })
            // Write version files
            .then(function() {
                bar.tick(10);

                return file.write(['package.json', 'bower.json'], {
                    version: version.toString()
                });
            })
            // Commit the prepare release commit
            .then(function() {
                bar.tick(10);

                return git.exec('commit', ['-am', '"Prepare release ' + version.toString() + '"'])
                    .catch(function(error) {
                        var stepError = new Error('GIT - failed exec the prepare release commit');
                        throw stepError;
                    });
            })
            // Catch all errors
            .catch(function(error) {
                process.stdout.write('\n\nERROR ' + error.message + ' ' + (error.parent ? "(" + error.parent.message + ")" : '') + '\n');
                process.exit(1);
            });
    }
};
