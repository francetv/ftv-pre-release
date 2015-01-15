FTV-prerelease tool
=========

This prerelease tool is a CLI tool that helps you bump the version of your libs.

This tool respect the Semantic Versioning v2 - http://semver.org/

How to use
----------------------------------------
There is 4 params availables patch, minor, major & pre-release.
By default no param given to the command mean a patch bump.

*(The pre-release param is not avaiblable for now)*

Just run ``./node_modules/.bin/prerelease [patch/minor/major/pre-release]`` and you're good !

Look the other tool **release** that help you with the next step (tag & push to repository).
