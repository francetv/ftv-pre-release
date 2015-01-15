var fs = require('fs'),
    RSVP = require('rsvp'),
    inquirer = require('inquirer'),
    extend = require('util')._extend;

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
    },
    write: function(names, attributes) {
        var promises = [];

        names.forEach(function(name) {
            promises.push(new RSVP.Promise(function(resolve, reject) {
                fs.exists(baseDir + '/' + name, function(exists) {
                    if (exists) {
                        var fileContent = extend(require(baseDir + '/' + name), attributes);

                        fs.writeFile(baseDir + '/' + name, JSON.stringify(fileContent), function(err) {
                            if (err) {
                                return reject(new Error('Failed wirting new attributes in ' + name + ' file'));
                            }

                            resolve();
                        });
                    }

                    resolve();
                });
            }));
        });

        return RSVP.all(promises);
    }
};
