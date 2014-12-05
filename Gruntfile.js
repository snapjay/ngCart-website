// grunt build
// grunt deploy

module.exports = function (grunt) {

    //  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        bower: grunt.file.readJSON('.bowerrc'),
        aws: grunt.file.readJSON('aws.json'),

//        useminPrepare: {
//            html: "<%= pkg.path.app %>/index.html",
//            options: {
//                dest: "<%= pkg.path.dist %>"
//            }
//        },
//
//        usemin: {
//            html: ["<%= pkg.path.dist  %>/**/*.html", "!<%=  pkg.path.dist  %>/bower_components/**"],
//            options: {
//                dirs: ["<%= pkg.path.dist  %>"]
//            }
//        },

        copy: {
            pre: {
                //files: [
                //    {
                //        expand: true,
                //        cwd: "<%= pkg.path.app  %>/bower_components/angular-phonecat/app/phones/",
                //        dest: "<%= pkg.path.app  %>/data",
                //        src: ['phones.json']
                //    },
                //    {
                //        expand: true,
                //        cwd: "<%= pkg.path.app  %>/bower_components/angular-phonecat/app/img/phones",
                //        dest: "<%= pkg.path.app  %>/img/phones",
                //        src: ['*.jpg']
                //    }
                //]
            } ,
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: "<%= pkg.path.app  %>",
                        dest: "<%= pkg.path.dist  %>",
                        src: ['index.html',
                            'img/**/*.*',
                            'data/**/*.*',
                            'template/**/*.*',
                            'partials/**/*.html',
                            'fonts/**/*.*' ] //'js/**/*.*', No JS as is already included with usemin
                    }
                ]
            }
        },


        aws_s3: {
            options: {
                accessKeyId: '<%= aws.key %>', // Use the variables
                secretAccessKey: '<%= aws.secret %>', // You can also use env variables
                region: '<%= aws.region %>',
                uploadConcurrency: 5, // 5 simultaneous uploads
                downloadConcurrency: 5, // 5 simultaneous downloads
                differential: true, // Only uploads the files that have changed
                displayChangesOnly: true, // Only uploads the files that have changed
                access:'public-read',
                params: {
                    CacheControl: 'max-age=630720000, public' // Two Year cache policy (1000 * 60 * 60 * 24 * 730)
                }

//                params: {
//                    "CacheControl": "max-age=630720000, public",
//                    "Expires": new Date(Date.now() + 63072000000),
//                    "ContentEncoding": 'gzip' // applies to all the files!
//                }
            },
            deploy: {
                options: {
                    bucket: "<%= aws.bucket %>"
                },
                files: [
                    {
                        cwd: "<%= pkg.path.dist %>",  //Start in this folder
                        dest: "/",
                        action: 'delete'
                    },
                    {
                        expand: true,
                        cwd: "<%= pkg.path.dist %>",  // Start in this folder
                        src: ["**/*.*"],                         // Read these files inside cwd
                        dest: ""
                    }
                ]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            }
        },

        htmlmin: {                                     // Task
            dist: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: false
                },

                src: ["**/*.html"],
                dest: '<%= pkg.path.dist %>',
                expand: true,
                cwd: '<%= pkg.path.dist %>'
            }
        },


        useminPrepare: {
            html: '<%= pkg.path.app %>/index.html',
            options: {
                dest: '<%= pkg.path.dist %>'
            }
        },

        usemin: {
            html: ["<%= pkg.path.dist %>/**/*.html", "!<%= pkg.path.dist %>/bower_components/**"],
            // html: '<%= pkg.path.dist %>/index.html',
            options: {
                dirs: ["<%= pkg.path.dist %>"]
            }
        }

    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-aws-s3');
    grunt.loadNpmTasks('grunt-replace');


    //grunt.registerTask('pre', ['copy:pre']);
    grunt.registerTask('build', ['useminPrepare', 'copy:dist', 'concat', 'uglify', 'cssmin', 'usemin']);
    grunt.registerTask('upload', ['aws_s3:deploy']);
    grunt.registerTask('deploy', ['build', 'upload']);

};