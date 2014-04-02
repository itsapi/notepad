module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // JS
    uglify: {
      combine: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today() %> */\n\n'
        },
        files: {
          'build/js/main.min.js': [
            'src/js/utils.js',
            'src/js/resources.js',
            'src/js/selectors.js',
            'src/js/controls.js',
            'src/js/settings.js',
            'src/js/drive.js',
            'src/js/listeners.js'
          ]
        }
      }
    },

    // CSS
    autoprefixer: {
      main: {
        src: 'src/css/main.css',
        dest: 'tmp/main.css'
      }
    },
    cssmin: {
      main: {
        options: {
          banner: '/*! <%= pkg.name %> <%= grunt.template.today() %> */\n'
        },
        src: 'tmp/main.css',
        dest: 'build/css/main.css'
      }
    },

    // HTML
    processhtml: {
      main: {
        expand: true,
        cwd: 'src',
        src: ['**/*.html'],
        dest: 'tmp/'
      }
    },
    htmlmin: {
      main: {
        options: {
          banner: '<!--! <%= pkg.name %> <%= grunt.template.today() %> -->\n',
          removeComments: true,
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true
        },
        expand: true,
        cwd: 'tmp',
        src: ['**/*.html'],
        dest: 'build/'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('default', [
    'uglify',
    'autoprefixer',
    'cssmin',
    'processhtml',
    'htmlmin'
  ]);
};