'use strict';

module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('jit-grunt')(grunt, {
        //Don't change this or it will break Grunt process
        sprite: 'grunt-spritesmith',
        useminPrepare: 'grunt-usemin'
    });

    //Edit the file Gruntconfig-sampe.js for
    var config = require('./Gruntconfig.js');

    grunt.initConfig({

        config: config,

        newer: {
            options: {
                override: function (details, include) {
                    include(true);
                }
            }
        },

        clean: [
            '<%= config.dist %>',
            '<%= config.assets %>/css',
            '<%= config.assets %>/images',
            '.scss-cache',
            '.tmp'
        ],

        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            //Don't change this file or it will break Grunt process
            //If you want to delete this file, you will need to add another HTML with comment tags for the build process
            html: 'page-base.php'
        },

        usemin: {
            html: ['<%= config.dist %>/*.{html,php}']
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
                    '<%= config.assets%>/css/main.css': '<%= config.source%>/scss/main.scss'
                }
            }
        },

        sass_globbing: {
            main: {
                files: {
                    //Globbing all the SCSS files -- Just create new files inside these folders and let Grunt do the hard work :)
                    '<%= config.source%>/sass/_libs.scss': '<%= config.source%>/scss/libs/**/*.scss',
                    '<%= config.source%>/sass/_modules.scss': '<%= config.source%>/scss/modules/**/*.scss',
                    '<%= config.source%>/sass/_components.scss': '<%= config.source%>/scss/components/**/*.scss',
                    '<%= config.source%>/sass/_views.scss': '<%= config.source%>/scss/views/**/*.scss'
                },
                options: {
                    useSingleQuotes: false
                }
            }
        },

        //Bower dependencies HTML auto injection
        //If the bower dependency does not have the "main" reference on it' bower.json, the depedency files need to be added manually
        wiredep: {
            task: {
                src: [
                    './**/*.{html,php}'
                ]
            },
            options: {
                overrides: {
                    "jquery": {
                        "main": '<%= config.assets%>/vendor/jquery.min.js'
                    }
                },
                exclude: [
                    'bower_components/modernizr/modernizr.js',
                    'bower_components/bootstrap/dist/css/bootstrap.css'
                ],
                devDependencies: true
            }
        },

        sprite: {
            all: {
                src: '<%= config.source%>/sprites/*.png',
                dest: '<%= config.assets%>/images/sprite.png',
                destCss: '<%= config.source%>/scss/libs/_sprite.scss',
                cssFormat: 'scss',
                imgPath: '../images/sprite.png',
                algorithm: 'top-down'
            }
        },

        imagemin: {

            jpgDev: {
                options: {
                    optimizationLevel: 1,
                    progressive: true
                },

                files: [
                    {
                        expand: true,
                        cwd: '<%= config.source%>/images',
                        src: ['**/*.{jpg,jpeg}'],
                        dest: '<%= config.assets%>/images'
                    }
                ]
            },
            pngDev: {
                options: {
                    optimizationLevel: 1
                },

                files: [
                    {
                        expand: true,
                        cwd: '<%= config.source%>/images',
                        src: ['**/*.png'],
                        dest: '<%= config.assets%>/images'
                    }
                ]
            },

            jpgDist: {
                options: {
                    optimizationLevel: 7,
                    progressive: true
                },

                files: [
                    {
                        expand: true,
                        cwd: '<%= config.source%>/images',
                        src: ['**/*.{jpg,jpeg}'],
                        dest: '<%= config.assets%>/images'
                    }
                ]
            },
            pngDist: {
                options: {
                    optimizationLevel: 7
                },

                files: [
                    {
                        expand: true,
                        cwd: '<%= config.source%>/images',
                        src: ['**/*.png'],
                        dest: '<%= config.assets%>/images'
                    }
                ]
            }
        },

        svgmin: {
            options: {
                plugins: [
                    {removeViewBox: false},
                    {removeUselessStrokeAndFill: false}
                ]
            },
            dist: {
                expand: true,
                cwd: '<%= config.source%>/images/svg',
                src: ['*.svg'],
                dest: '<%= config.assets%>/images/svg'
            }
        },

        concurrent: {
            first: [
                'sass_globbing:main',
                'wiredep'
            ],
            imagesDev: [
                'sprite',
                'imagemin:jpgDev',
                'imagemin:pngDev',
                'svgmin'
            ],
            imagesDist: [
                'sprite',
                'imagemin:jpgDist',
                'imagemin:pngDist',
                'svgmin'
            ]
        },

        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        src: [
                            './*.{html,php}'
                        ],
                        dest: '<%= config.dist %>/',
                        filter: 'isFile'
                    },

                    {expand: true, src: ['./<%= config.assets%>/images/**/*'], dest: '<%= config.dist %>'},

                    {expand: true, src: ['./<%= config.assets%>/fonts/**/*'], dest: '<%= config.dist %>'},

                    {expand: true, src: ['./<%= config.assets%>/vendor/**/*'], dest: '<%= config.dist %>'}
                ]
            },

            dev: {
                files: [
                    {
                        expand: true,
                        src: ['<%= config.dist %>/**/*'],
                        dest: '<%= config.wpThemesPath %>',
                        filter: 'isFile'
                    }
                ]
            }
        },

        'ftp-deploy': {

            dev: {
                auth: {
                    host: 'ftp.host.com',
                    port: 21,
                    authKey: 'dev'
                },
                src: '<%= config.dist %>',
                dest: 'DESTINATION PATH ON HOST'
            },

            prod: {
                auth: {
                    host: 'ftp.host.com',
                    port: 21,
                    authKey: 'prod'
                },
                src: '<%= config.dist %>',
                dest: 'DESTINATION PATH ON HOST'
            }
        },

        //In case of SFTP deploy
        // You will need to replace this task on grunt:deploy task > Line 326
        'sftp-deploy': {

            dev: {
                auth: {
                    host: 'ftp.host.com',
                    port: 22,
                    authKey: 'dev'
                },
                src: '<%= config.dist %>',
                dest: 'DESTINATION PATH ON HOST',
                serverSep: '/',
                concurrency: 4,
                progress: true
            },

            prod: {
                auth: {
                    host: 'ftp.host.com',
                    port: 22,
                    authKey: 'prod'
                },
                src: '<%= config.dist %>',
                dest: 'DESTINATION PATH ON HOST',
                serverSep: '/',
                concurrency: 4,
                progress: true
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
                files: ['<%= config.source%>/scss/**/*.scss'],
                tasks: ['newer:scss'],
                options: {
                    spawn: false
                }
            },
            images: {
                files: ['<%= config.source%>/images/**/*.{png,jpg,gif,svg}'],
                tasks: ['newer:imagemin:jpgDev', 'newer:imagemin:pngDev', 'newer:svgmin'],
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

    // Compilation and minification of files + Creates Dist folder (Development Version)
    grunt.registerTask('build', [
        'clean',
        'jshint:frontend',
        'concurrent:first',
        'concurrent:imagesDev',
        'sass',
        'copy:dist',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin'
    ]);

    // Compilation and minification of files + Creates Dist folder (Production Version)
    grunt.registerTask('build:dist', [
        'clean',
        'jshint:frontend',
        'concurrent:first',
        'concurrent:imagesDist',
        'sass',
        'copy:dist',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
        'usemin'
    ]);

    // Task that sends the dist folder to WP config path
    grunt.registerTask('build:dev', [
        'build',
        'copy:dev'
    ]);

    // Deploy Dist folder to development server (Need to configure FTP Deploy task)
    grunt.registerTask('deploy:dev', [
        'build',
        'ftp-deploy:dev'
    ]);

    // Deploy Dist folder to production server (Need to configure FTP Deploy task)
    grunt.registerTask('deploy:prod', [
        'build:dist',
        'ftp-deploy:prod'
    ]);

    //Watch task for SCSS compilation, JSHINT, sprite generation, image minification, Wiredep dependencies injection and livereload on project
    grunt.registerTask('default', [
        'build',
        'watch'
    ]);

};