module.exports = function(grunt) {

  grunt.initConfig({

     jshint: {
      all: ['Gruntfile.js', 'hello.js']
    },
    

     compile: {
      ejs: ['jade', 'wiredep'],
      styles: ['concat:styles', 'sass', 'clean:compile'],
      js: ['concat:js']
    },

    compile: {
      css: ['jade', 'wiredep'],
      styles: ['concat:styles', 'sass', 'clean:compile'],
      js: ['concat:js']
    },

    wiredep: {
      task: {
        src: ['views/*.ejs', 'public/stylesheets/*.css']
      },
      options : {
       ignorePath : "../public" 
      }
    }

  });

  grunt.loadNpmTasks('grunt-wiredep');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', 'jshint');




};
