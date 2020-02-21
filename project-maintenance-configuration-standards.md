# Silvermine Project Maintenance Standards

It's our goal to perform certain tasks consitently between projects. Such tasks include,
publishing new versions to npm, upgrading dependencies, and from time-to-time, upgrading
versions of npm and Node.js. This document outlines our approach to these tasks and other
similar chores.

## Node/NPM Upgrade Process

### Current Versions

Node: `12.14.0`
NPM: `6.13.4`

### Prerequisites

   * Using `nvm`, ensure that you have the current version of Node and NPM
     (listed above) installed.

### Steps

#### Upgrade Node / NPM

   * Ensure that an `.nvmrc` file locking the Node.js version to our current accepted
     version exists in the project's root dir.
      * Ensure that your terminal session has switched to this version of Node by running
        `nvm use` (see Prerequisites section).
   * Remove the "engines" field from package.json, if it exists.
   * Ensure that package.json has a `test` script and that it begins with a call to
     `check-node-version --node x.x.x --npm x.x.x`
      * Ensure that this `test` script is called inside the "test" build step inside the
        project's [CI configuration file](#ci-configuration-file).
   * Run `npm ci && npm i` to update the project's package-lock.json file in case the
     format has changed after the update to the latest node version
   * Ensure that the project's [CI configuration file](#ci-configuration-file) calls
     `source ~/.nvm/nvm.sh --install` sometime before running `npm` and `node` commands.
      * If we are using a version of `npm` that is different from the version that comes
        packaged with the version of Node that we are using, ensure that
        `npm i -g npm@x.y.z` (where `x.y.z` is the version of NPM we are using)
        immediately after the `source ~/.nvm/nvm.sh --install` command.
   * Commit these changes:
     `git commit -m "chore: update Node to x.x.x and NPM to x.x.x"`
   * Update the project's dependencies, where practical, to the latest minor
     version available
      * Updates to major versions are also encouraged when they do not result in large
        code changes for the code base, or loss of support for browsers that we 
        need support for, etc.
         * NOTE: If the project uses TypeScript, please do not update the TypeScript
           version. TypeScript does not follow semver and updating even minor versions
           often introduces breaking changes.
         * NOTE: Do not update `class.extend`, if it exists. The latest version of
           `class.extend` contains an issue that violates Content Security Policies
           that block the use of `eval` and `eval`-like code
      * Run `npm audit` to verify any package vulnerabilites are addressed. Where
        upgrading certain packages are not possible, for instance requiring extensive
        code changes, open an issue to address the vulnerability.
      * Commit these dependencies upgrades to their own commit.

## Configuring Commitlint

   * Install Commitlint `npm i -DE @commitlint/cli@8`
   * Ensure that `@silvermine/eslint-config` is installed and is at least version `2.3.0`,
     but **preferably the latest version**
      * If you notice that it's not possible to upgrade to the latest version because
        doing so would involve fixing a lot of linting issues, please open an issue for
        ugprading eslint to the latest version and fixing the linting issues (be sure to
        see if an issue already exists first).
   * Add a file called `commitlint.config.js` with the content specified in the "Files"
     section below.
   * Use `git log --oneline` to find the short hash of the previous commit and take
     note of it.
   * Add the following NPM script to `package.json`:
      * `"commitlint": "commitlint --from deadbeef",` where `deadbeef` is the short
        hash from the previous step
   * Configure `.gitlab-ci.yml` or `.travis.yml` to run `npm run commitlint` before
     running `npm test`
   * Add this config to `package.json`:
   
   ```json
   "config": {
      "commitizen": {
         "path": "./node_modules/cz-conventional-changelog"
      }
   },
  ```

## Files

### commitlint.config.js

```javascript
'use strict';

module.exports = {
   extends: [ '@silvermine/eslint-config/commitlint.js' ],
};
```

## Glossary/Footnotes

### CI Configuration File
Typically, `.travis.yml` for Github projects. Other examples of
these types of files are Gitlab's `.gitlab-ci.yml`, or Bitbuckets's
`bitbucket-pipelines.yml`.