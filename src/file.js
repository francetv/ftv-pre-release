var fs = require('fs'),
    RSVP = require('rsvp'),
    inquirer = require('inquirer');

var baseDir = process.cwd();

module.exports = {
    exists: function(name) {
        var deferred = RSVP.defer();

        fs.exists(baseDir + '/' + name, function(exists) {
            if (exists) {
                return deferred.resolve(require(baseDir + '/' + name));
            }

            inquirer.prompt([{
                type: 'confirm',
                name: 'exists',
                message: 'No ' + name + ' file found, is that normal?',
                default: false
            }], function(answers) {
                if (!answers.exists) {
                    return deferred.reject(new Error('Stop prerelease process without a ' + name + ' file '));
                }

                deferred.resolve();
            });
        });

        return deferred.promise;
    }
};
