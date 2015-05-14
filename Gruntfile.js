'use strict';

module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    var config = {
        source: 'source',
        dist: 'dist'
    };

    grunt.initConfig({

        config: config,

        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: 'page-base.php'
        },

        usemin: {
            html: ['<%= config.dist %>/*.{html,php}']
        },

        newer: {
            options: {
                override: function (details, include) {
                    include(true);
                }
            }
        },

        imagemin: {
            dynamic: {
                options: {
                    optimizationLevel: 3
                },

                files: [{
                    expand: true,
                    cwd: '<%= config.source%>/images',
                    src: ['**/*.{png,jpg,gif}'],
                    dest: 'assets/images'
                }]
            }
        },

        jshint: {
            frontend: {
                files: [{
                    src: '<%= config.source%>/scripts/frontend.js'
                }]
            }
        },

        sass: {
            dist: {
                options: {
                    sourceMap: true,
                    outputStyle: 'expanded'
                },
                files: {
                    'assets/css/main.css': '<%= config.source%>/sass/main.scss'
                }
            }
        },

        sass_globbing: {
            main: {
                files: {
                    '<%= config.source%>/sass/_libs.scss': '<%= config.source%>/sass/libs/**/*.scss',
                    '<%= config.source%>/sass/_modules.scss': '<%= config.source%>/sass/modules/**/*.scss',
                    '<%= config.source%>/sass/_components.scss': '<%= config.source%>/sass/components/**/*.scss'
                },
                options: {
                    useSingleQuotes: false
                }
            }
        },

        sprite: {
            all: {
                src: '<%= config.source%>/sprites/*.png',
                dest: 'assets/images/sprite.png',
                destCss: '<%= config.source%>/sass/libs/sprite.scss',
                cssFormat: 'scss',
                imgPath: '../images/sprite.png',
                algorithm: 'top-down'
            }
        },

        concurrent: {
            dist: [
                'sprite',
                'imagemin',
                'sass',
                'copy:html',
                'wiredep'
            ]
        },

        copy: {
            html: {
                files: [
                    {
                        expand: true,
                        src: [
                            './*.{html,php}',
                            '!./index.php'
                        ],
                        dest: '<%= config.dist %>/',
                        filter: 'isFile'
                    },

                    {expand: true, src: ['./assets/images/**/*'], dest: '<%= config.dist %>'},

                    {expand: true, src: ['./assets/fonts/**/*'], dest: '<%= config.dist %>'},

                    {expand: true, src: ['./assets/vendor/**/*'], dest: '<%= config.dist %>'}
                ]
            }
        },

        clean: ['<%= config.dist %>', '.sass-cache', '.tmp'],

        'ftp-deploy': {

            test: {
                auth: {
                    host: 'ftp.host.com',
                    port: 21,
                    authKey: 'key1'
                },
                src: '<%= config.dist %>',
                dest: 'DESTINATION PATH ON HOST'
            }
        },

        wiredep: {
            task: {
                src: [
                    './**/*.php'
                ]
            },
            options: {
                overrides: {
                    "jquery": {
                        "main": "assets/vendor/jquery.min.js"
                    }
                },
                exclude: [
                    'bower_components/modernizr/modernizr.js',
                    'bower_components/bootstrap/dist/css/bootstrap.css'
                ],
                devDependencies: true
            }
        },

        watch: {
            options: {
                livereload: true
            },
            bower: {
                files: ['bower.json'],
                tasks: ['wiredep']
            },
            scripts: {
                files: ['<%= config.source%>/scripts/frontend.js'],
                tasks: ['jshint:frontend'],
                options: {
                    spawn: false
                }
            },
            sass: {
                files: ['<%= config.source%>/sass/**/*.scss'],
                tasks: ['newer:sass'],
                options: {
                    spawn: false
                }
            },
            images: {
                files: ['<%= config.source%>/images/**/*.{png,jpg,gif}'],
                task: ['newer:imagemin'],
                options: {
                    spawn: false
                }
            },
            sprite: {
                files: ['<%= config.source%>/sprites/*.{png,jpg,gif}'],
                tasks: ['sprite'],
                options: {
                    spawn: false
                }
            },
            html: {
                files: ['./**/*.{html,php}'],
                tasks: [],
                options: {
                    spawn: false
                }
            }
        }
    });

    // Compila e minifica os arquivos

    grunt.registerTask('build', [
        'jshint:frontend',
        'clean',
        'sass_globbing:main',
        'concurrent:dist',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin'
    ]);

    grunt.registerTask('default', [
        'watch'
    ]);

};