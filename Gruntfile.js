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
            html: 'index.html'
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
            "globbing": true,
            options: {
                sourceMap: true
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'styles',
                    src: ['<%= config.source%>/sass/main.scss'],
                    dest: 'assets/css',
                    ext: '.css'
                }]
            }
        },

        sass_globbing: {
            main: {
                files: {
                    '<%= config.source%>/_libs.scss': '<%= config.source%>/libs/**/*.scss',
                    '<%= config.source%>/_modules.scss': '<%= config.source%>/modules/**/*.scss',
                    '<%= config.source%>/_components.scss': '<%= config.source%>/components/**/*.scss'
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
                destCss: '<%= config.source%>/less/libs/sprite.less',
                cssFormat: 'less',
                imgPath: '../images/sprite.png',
                algorithm: 'top-down'
            }
        },

        concurrent: {
            dist: [
                'sprite',
                'newer:imagemin',
                'newer:sass',
                'copy:html'
            ]
        },

        copy: {
            html: {
                files: [
                    {
                        expand: true,
                        src: [
                            './*.{html,php}'
                        ],
                        dest: '<%= config.dist %>/',
                        filter: 'isFile'
                    },

                    {expand: true, src: ['./assets/images/**/*'], dest: '<%= config.dist %>'},

                    {expand: true, src: ['./assets/fonts/**/*'], dest: '<%= config.dist %>'}
                ]
            }
        },

        clean: ['<%= config.dist %>', '.tmp'],

        'ftp-deploy': {

            test: {
                auth: {
                    host: 'ftp.estudiotouch.net',
                    port: 21,
                    authKey: 'key1'
                },
                src: '<%= config.dist %>',
                dest: '/public_html/clientes/kohler/microsites/wp-content/themes/<%= config.dist %>'
            }
        },

        wiredep: {
            task: {
                src: [
                    './**/*.php'
                ]
            },
            options: {
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
                task: ['imagemin'],
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