function Version() {
    return this.init.apply(this, arguments);
}

Version.prototype = {
    init: function init(version) {
        if (version) {
            var parts = version.split('.');

            if (parts.length < 3) {
                throw new Error('The version structure seems to be incorrect, should be x.x.x(-x)');
            }

            var subparts = parts[2].split('-');

            this.major = parts[0];
            this.minor = parts[1];
            this.patch = subparts[0];
            this.prerelease = subparts[1] || undefined;
        } else {
            this.major = undefined;
            this.minor = undefined;
            this.patch = undefined;
            this.prerelease = undefined;
        }

    },
    increment: function increment(mode) {
        switch (mode) {
            case 'patch':
                this.patch++;
                break;
            case 'minor':
                this.patch = 0;
                this.minor++;
                break;
            case 'major':
                this.patch = 0;
                this.minor = 0;
                this.major++;
                break;
            case 'pre-release':
                console.log('TODO');
                break;
        }
    },
    toString: function() {
        return this.major + '.' + this.minor + '.' + this.patch + (this.prerelease ? this.prerelease : '');
    }
};

module.exports = Version;
