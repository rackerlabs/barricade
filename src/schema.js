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

    Schema = InstanceofMixin.call({
        /**
        * @memberof Barricade.Schema
        * @private
        */
        _applyBlueprintIfNeeded: function (class_, blueprint) {
            if (!class_.instanceof(blueprint)) {
                blueprint.call(class_);
            }
        },

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _handlers: {
            '@type': function (type) {
                this._type = type;
            },
            '@ref': function (ref) {
                this._ref = ref;
            },
            '@toJSON': function (toJSON) {
                this._toJSON = toJSON;
            },
            '@enum': function (enum_) {
                this._enum = enum_;
            },
            '@default': function (default_) {
                this._default = default_;
            },
            '@inputMassager': function (inputMassager) {
                this._inputMassager = inputMassager;
            },
            '@constraints': function (constraints) {
                this._constraints = constraints;
            },
            '@required': function (required) {
                this._required = required;
            },
            '@factory': function () {
                // do nothing for now
            },
            normalKey: function (key, extension, outerClass) {
                if (!Object.hasOwnProperty.call(this, '_keyClasses')) {
                    this._keyClasses = Object.create(this._keyClasses);
                    this._factories = Object.create(this._factories);
                }

                if (!(key in this._keyClasses)) {
                    this._keyClassList = this._keyClassList.concat(key);
                }

                if ('@factory' in extension) {
                    this._factories[key] = extension['@factory'];
                }

                if ('@class' in extension) {
                    this._keyClasses[key] = extension['@class'];
                } else {
                    this._keyClasses[key] = key in this._keyClasses
                        ? this._keyClasses[key].extend({}, extension)
                        : Base.extend({}, extension);
                }

                if (key === '*') {
                    this._applyBlueprintIfNeeded(outerClass, Array_);
                } else if (key === '?') {
                    this._applyBlueprintIfNeeded(outerClass, MutableObject);
                } else {
                    this._applyBlueprintIfNeeded(outerClass, ImmutableObject);
                }
            }
        },

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _keyClasses: {},

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _factories: {},

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _keyClassList: [],

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _class: null,

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _constraints: null,

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _default: null,

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _enum: null,

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _inputMassager: null,

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _ref: null,

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _required: null,

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _toJSON: null,

        /**
        * @memberof Barricade.Schema
        * @private
        */
        _type: null,

        /**
        * Creates a new Schema object that inherits from the one this method is
          called upon. Sub-schemas, such as those for properties of objects and
          elements in arrays, will also be extended, recursively. This operation
          does not affect the original Schema object.
        * @memberof Barricade.Schema
        * @param {Class} outerClass
                 The class that this schema is inside of. The extension of the
                 schema sometimes requires modification of the outer class, for
                 example to add the Array, ImmutableObject, or MutableObject
                 mixin, which will add their specific methods.
          @param {Object} extension
                 Schema-specific properties to extend the schema with.
          @returns {Barricade.Schema}
                   New Schema object that inherits from the one being extended.
        */
        extend: function (outerClass, extension) {
            var self = Object.create(this);

            Object.keys(extension).forEach(function (key) {
                if (key[0] !== '@') {
                    self._handlers.normalKey.call(self, key, extension[key],
                                                  outerClass);
                } else if (key in self._handlers) {
                    self._handlers[key].call(self, extension[key], outerClass);
                } else {
                    throw new Error(key + ' is not a supported key.');
                }
            });

            return self;
        },

        /**
        * Retrieves a schema key.
        * @memberof Barricade.Schema
        * @param {String} key
                 Schema key to retrieve, without the leading `@`
          @returns Value of schema key, or null if one does not exist.
        */
        get: function (key) {
            if (('@' + key) in this._handlers) {
                return this['_' + key];
            }
            throw new Error(key + ' is an invalid key');
        },

        /**
        * Checks to see if schema has a particular key defined.
        * @memberof Barricade.Schema
        * @param {String} key
                 Schema key to check, without the leading `@`
          @returns {Boolean}
        */
        has: function (key) {
            if (('@' + key) in this._handlers) {
                return this['_' + key] !== null;
            }
            throw new Error(key + ' is an invalid key');
        },

        /**
        * Checks to see if schema has a particular key class defined. The key
          classes are created when sub-schemas are defined, such as those for
          Object properties and Array elements.
        * @memberof Barricade.Schema
        * @param {String} key
                 Sub-schema key to check for
          @returns {Boolean}
        */
        hasKeyClass: function (key) {
            return key in this._keyClasses;
        },

        /**
        * Retrieves a key class. The key classes are created when sub-schemas
          are defined, such as those for Object properties and Array elements.
        * @memberof Barricade.Schema
        * @param {String} key
                 Sub-schema class to retrieve
          @returns {Barricade.Base}
                   Sub-schema class
        */
        keyClass: function (key) {
            return this._keyClasses[key];
        },

        /**
        * Instantiates a key class. If there is a factory method defined for the
          key (using @factory), it will be used instead of the key class.
        * @memberof Barricade.Schema
        * @param {String} key
                 Sub-schema class to instantiate
        * @param {JSON} json
        * @param {Object} parameters
          @returns {Barricade.Base}
                   Instance of sub-schema class
        */
        keyClassCreate: function (key, json, parameters) {
            return key in this._factories
                ? this._factories[key](json, parameters)
                : this.keyClass(key).create(json, parameters);
        },

        /**
        * Returns a list of the keys for which sub-schema classes are defined.
        * @memberof Barricade.Schema
          @returns {Array}
                   Keys of the sub-schema classes
        */
        keyClassList: function () {
            return this._keyClassList;
        }
    });
