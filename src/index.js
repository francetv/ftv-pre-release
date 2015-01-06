var RSVP = require('rsvp'),
    ProgressBar = require('progress'),
    inquirer = require("inquirer");

var Version = require('./models/Version'),
    file = require('./file');

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
                version = new Version(currentVersion);
            })
            // Incremente version number depending on the mode
            .then(function() {
                version.increment(mode);
            })
            .then(function() {
                var deferred = RSVP.defer();

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
            // Catch all errors
            .catch(function(error) {
                process.stdout.write('\n\nERROR ' + error.message + ' ' + (error.parent ? "(" + error.parent.message + ")" : '') + '\n');
                process.exit(1);
            });
    }
};
