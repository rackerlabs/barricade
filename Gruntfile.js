// Copyright 2014 Rackspace
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module.exports = function (grunt) {
    var apache_license = [
            '// Copyright 2014 Rackspace',
            '//',
            '// Licensed under the Apache License, Version 2.0 (the "License");',
            '// you may not use this file except in compliance with the License.',
            '// You may obtain a copy of the License at',
            '//',
            '//     http://www.apache.org/licenses/LICENSE-2.0',
            '//',
            '// Unless required by applicable law or agreed to in writing, software',
            '// distributed under the License is distributed on an "AS IS" BASIS,',
            '// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.',
            '// See the License for the specific language governing permissions and',
            '// limitations under the License.',
            '',
            ''
        ].join('\n');

    var srcFiles = [{
                file: 'src/intro.js'
            }, {
                file: 'src/util/blueprint.js',
                jshint: {globals: {'Blueprint': true}}
            }, {
                file: 'src/mixin/extendable.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'Extendable': true,
                        'getType': false
                    }
                }
            }, {
                file: 'src/mixin/instanceof.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'InstanceofMixin': true
                    }
                }
            }, {
                file: 'src/mixin/identifiable.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'Identifiable': true
                    }
                }
            }, {
                file: 'src/mixin/omittable.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'Omittable': true
                    }
                }
            }, {
                file: 'src/mixin/deferrable.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'Container': false,
                        'Deferrable': true,
                        'Deferred': false,
                        'logError': false
                    }
                }
            }, {
                file: 'src/mixin/validatable.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'getType': false,
                        'Validatable': true
                    }
                }
            }, {
                file: 'src/mixin/enumerated.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'Enumerated': true,
                        'getType': false
                    }
                }
            }, {
                file: 'src/mixin/observable.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'Observable': true
                    }
                }
            }, {
                file: 'src/util/deferred.js',
                jshint: {globals: {'Deferred': true}}
            }, {
                file: 'src/base.js',
                jshint: {
                    globals: {
                        'Base': true,
                        'Blueprint': false,
                        'Deferrable': false,
                        'Enumerated': false,
                        'Extendable': false,
                        'getType': false,
                        'Identifiable': false,
                        'InstanceofMixin': false,
                        'logError': false,
                        'Observable': false,
                        'Omittable': false,
                        'Validatable': false
                    }
                }
            }, {
                file: 'src/container.js',
                jshint: {
                    globals: {
                        'BarricadeMain': false,
                        'Base': false,
                        'Blueprint': false,
                        'Container': true,
                        'Extendable': false
                    }
                }
            }, {
                file: 'src/arraylike.js',
                jshint: {
                    globals: {
                        'Arraylike': true,
                        'Blueprint': false,
                        'Container': false,
                        'Extendable': false
                    }
                }
            }, {
                file: 'src/array.js',
                jshint: {
                    globals: {
                        'Array_': true,
                        'Arraylike': false,
                        'Blueprint': false
                    }
                }
            }, {
                file: 'src/immutable_object.js',
                jshint: {
                    globals: {
                        'Blueprint': false,
                        'Container': false,
                        'Extendable': false,
                        'ImmutableObject': true,
                        'logError': false,
                    }
                }
            }, {
                file: 'src/mutable_object.js',
                jshint: {
                    globals: {
                        'Arraylike': false,
                        'getType': false,
                        'logError': false,
                        'MutableObject': true
                    }
                }
            }, {
                file: 'src/primitive.js',
                jshint: {
                    globals: {
                        'Base': false,
                        'getType': false,
                        'logError': false,
                        'Primitive': true
                    }
                }
            }, {
                file: 'src/core.js',
                jshint: {
                    exported: [
                        'logError',
                    ],
                    globals: {
                        'Array_': false,
                        'Arraylike': false,
                        'BarricadeMain': true,
                        'Base': false,
                        'Blueprint': false,
                        'console': false,
                        'Container': false,
                        'Deferrable': false,
                        'Enumerated': false,
                        'Extendable': false,
                        'Identifiable': false,
                        'ImmutableObject': false,
                        'InstanceofMixin': false,
                        'MutableObject': false,
                        'Observable': false,
                        'Omittable': false,
                        'Primitive': false
                    }
                }
            }, {
                file: 'src/outro.js',
            }];

    var gruntConfig = {
            pkg: grunt.file.readJSON('package.json'),
            concat: {
                barricade: {
                    src: srcFiles.map(function (f) { return f.file; }),
                    dest: 'barricade.js',
                    options: {
                        banner: apache_license,
                        // Removes leading line comments and blank lines. Needed
                        // because stripBanners eats tabs on first code line...
                        process: function removeBanner(src) {
                            // Matches lines '' or '//...', and the \n after
                            // them one or more times until it cannot match
                            return src.replace(/((^$|^\/\/.*)\n)*/m, '');
                        }
                    }
                }
            },
            jshint: {
                options: {
                    curly: true,
                    debug: true,
                    eqeqeq: true,
                    immed: true,
                    indent: true,
                    latedef: 'nofunc',
                    noempty: true,
                    nonbsp: true,
                    undef: true,
                    unused: true,
                    maxlen: 80,
                    validthis: true,
                    laxbreak: true,
                },
                barricade: {
                    files: {src: 'barricade.js'},
                    options: {
                        globals: {
                            'console': false
                        },
                        exported: ['Barricade']
                    }
                },
                global_state_check: {
                    files: {src: 'test/global_state_check.js'},
                    options: {
                        exported: [
                            'SAVE_GLOBAL_STATE',
                            'ENSURE_GLOBAL_OBJECT_UNPOLLUTED'
                        ],
                        globals: {'window': false}
                    }
                },
                test: {
                    files: {
                        src: ['test/**/*.js', '!test/global_state_check.js']
                    },
                    options: {
                        globals: {
                            'Barricade': false,
                            'describe': false,
                            'xdescribe': false,
                            'it': false,
                            'xit': false,
                            'expect': false,
                            'beforeEach': false,
                            'afterEach': false,
                            'SAVE_GLOBAL_STATE': false,
                            'ENSURE_GLOBAL_OBJECT_UNPOLLUTED': false,
                        }
                    }
                }
            },
            jasmine: {
                src: [
                    'test/global_state_check.js',
                    'barricade.js',
                ],
                options: {
                    specs: [
                        'test/core_spec.js',
                        'test/util/blueprint_spec.js',
                        'test/mixin/extendable_spec.js',
                        'test/mixin/instanceof_spec.js',
                        'test/primitive_spec.js',
                        'test/array_spec.js',
                        'test/immutable_object_spec.js',
                        'test/mutable_object_spec.js',
                        'test/mixin/identifiable_spec.js',
                        'test/mixin/observable_spec.js',
                        'test/mixin/omittable_spec.js',
                        'test/tag/required_spec.js',
                        'test/tag/constraints_spec.js',
                        'test/tag/enum_spec.js',
                        'test/tag/ref_spec.js',
                        'test/tag/default_spec.js',
                    ],
                    keepRunner: true
                }
            },
            jsdoc: {
                barricade: {
                    src: ['barricade.js'], 
                    dest: 'doc',
                    options: {
                        template: 'jsdoc/template',
                        config: 'jsdoc/conf.json'
                    }
                }
            }
        };

    grunt.initConfig(gruntConfig);

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('lintsrc', 'Lint individual source files', function (i) {
        i = +i;

        if (srcFiles[i].file.search(/intro|outro/) === -1) {
            grunt.log.writeln('Preparing to lint ' + srcFiles[i].file);
            grunt.config('jshint.src', {
                files: {src: srcFiles[i].file},
                options: srcFiles[i].jshint
            });

            grunt.task.run('jshint:src');
        } else {
            grunt.log.writeln('Skipping ' + srcFiles[i].file);
        }

        if (i < srcFiles.length - 1) {
            grunt.task.run('lintsrc:' + (i + 1));
        }
    });

    grunt.registerTask('default', [
        'lintsrc:0',
        'concat:barricade',
        'jshint:barricade',
        'jshint:global_state_check',
        'jshint:test',
        'jasmine'
    ]);

    grunt.registerTask('unit', ['jasmine']);
    grunt.registerTask('doc', ['concat:barricade', 'jsdoc']);
};
