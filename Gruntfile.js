'use strict';

var markdownlint = require('markdownlint');

module.exports = function(grunt) {
   var config;

   config = {
      js: {
         all: [
            'Gruntfile.js',
         ],
      },
   };

   grunt.initConfig({

      pkg: grunt.file.readJSON('package.json'),

      eslint: {
         target: config.js.all,
      },

      markdownlint: {
         all: {
            // Adjust `src` depending on how many files need to be linted:
            src: [ '*.md' ],
            options: {
               // eslint-disable-next-line no-sync
               config: markdownlint.readConfigSync('.markdownlint.json'),
            },
         },
      },

   });

   grunt.loadNpmTasks('grunt-eslint');
   grunt.loadNpmTasks('grunt-markdownlint');

   grunt.registerTask('standards', [ 'eslint', 'markdownlint' ]);
   grunt.registerTask('default', [ 'standards' ]);

};
