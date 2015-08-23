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

    /**
    * @class
    * @memberof Barricade
    * @mixes   Barricade.Extendable
    * @extends Barricade.Extendable
    * @mixes   Barricade.InstanceofMixin
    * @extends Barricade.InstanceofMixin
    * @mixes   Barricade.Observable
    * @extends Barricade.Observable
    * @mixes   Barricade.Omittable
    * @extends Barricade.Omittable
    * @mixes   Barricade.Deferrable
    * @extends Barricade.Deferrable
    * @mixes   Barricade.Validatable
    * @extends Barricade.Validatable
    * @mixes   Barricade.Enumerated
    * @extends Barricade.Enumerated
    * @mixes   Barricade.Identifiable
    * @extends Barricade.Identifiable
    */
    Base = Extendable.call(InstanceofMixin.call({
        /**
        * Creates a `Base` instance
        * @memberof Barricade.Base
        * @param {JSON} json
        * @param {Object} parameters
        * @returns {Barricade.Base}
        */
        create: function (json, parameters) {
            var self = this.extend({}),
                schema = self.schema();

            self._parameters = parameters = parameters || {};

            if (schema.has('inputMassager')) {
                json = schema.get('inputMassager')(json);
            }

            self._setData(json);

            if (schema.has('toJSON')) {
                self.toJSON = schema.get('toJSON');
            }

            Observable.call(self);
            Omittable.call(self);
            Deferrable.call(self, schema);
            Validatable.call(self, schema);

            if (schema.has('enum')) {
                Enumerated.call(self, schema.get('enum'));
            }

            Identifiable.call(self, parameters.id);

            return self;
        },

        /**
        * @memberof Barricade.Base
        * @private
        */
        _uidPrefix: 'obj-',

        /**
        * @memberof Barricade.Base
        * @private
        */
        _getDefaultValue: function () {
            return this.schema().has('default')
                ? typeof this.schema().get('default') === 'function'
                    ? this.schema().get('default').call(this)
                    : this.schema().get('default')
                : this.schema().get('type')();
        },

        /**
        * @memberof Barricade.Base
        * @private
        */
        _getJSON: function () {
            return this._data;
        },

        /**
        * @memberof Barricade.Base
        * @private
        */
        _setData: function(json) {
            var type = this.schema().get('type');

            if (getType(json) !== type) {
                if (json) {
                    logError("Type mismatch. JSON: ", json,
                             " expected type: ", type);
                }
                // Replace bad type (does not change original)
                json = this._getDefaultValue();
            }
            this._data = this._sift(json, this._parameters);
        },

        /**
        * @memberof Barricade.Base
        * @private
        */
        _safeInstanceof: function (instance, class_) {
            return getType(instance) === Object &&
                ('instanceof' in instance) &&
                instance.instanceof(class_);
        },

        /**
        * @memberof Barricade.Base
        * @private
        */
        _schema: Schema,

        /**
        * @memberof Barricade.Base
        * @private
        */
        _sift: function (json) {
            return json;
        },

        /**
        * @memberof Barricade.Base
        * @private
        */
        _getPrettyJSON: function (options) {
            return this._getJSON(options);
        },

        /**
        * Retrieves the value.
        * @memberof Barricade.Base
        * @instance
        * @returns {JSON}
        */
        get: function () {
            return this._data;
        },

        /**
        * Returns the primitive type of the Barricade object.
        * @memberof Barricade.Base
        * @instance
        * @returns {constructor}
        */
        getPrimitiveType: function () {
            return this.schema().get('type');
        },

        /**
        * Returns true if the data is empty. This depends on the type; Arrays
          and Objects are considered empty if they have no elements, while
          Strings, Numbers, and Booleans are empty if they are equivalent to a
          newly-constructed instance.
        * @memberof Barricade.Base
        * @instance
        * @returns {Boolean}
        */
        isEmpty: function () {
            if (this.getPrimitiveType() === Array) {
                return !this._data.length;
            } else if (this.getPrimitiveType() === Object) {
                return !Object.keys(this._data).length;
            }
            return this._data === this.getPrimitiveType()();
        },


        /**
        * Returns whether the Barricade object is required or not. Usually
          affects output of `toJSON()`. Use the `@required` tag in the schema to
          specify this option.
        * @memberof Barricade.Base
        * @instance
        * @returns {Boolean}
        */
        isRequired: function () {
            return this.schema().get('required') !== false;
        },

        /**
        * @memberof Barricade.Base
        * @instance
        * @returns {Barricade.Schema}
        */
        schema: function () {
            return this._schema;
        },

        /**
        * @memberof Barricade.Base
        * @instance
        * @param newVal
        * @returns {self}
        */
        set: function (newVal) {
            var schema = this.schema();

            function typeMatches(newVal) {
                return getType(newVal) === schema.get('type');
            }

            if (typeMatches(newVal) && this._validate(newVal)) {
                this._data = newVal;
                return this.emit('validation', 'succeeded')
                           .emit('change');
            } else if (this.hasError()) {
                return this.emit('validation', 'failed');
            }

            logError("Setter - new value (", newVal, ")",
                     " did not match expected type: ", schema.get('type'));
            return this;
        },

        /**
        * Returns the JSON representation of the Barricade object.
        * @memberof Barricade.Base
        * @instance
        * @param {Object} [options]
                 An object containing options that affect the JSON result.
                 Current supported options are ignoreUnused (Boolean, defaults
                 to false), which skips keys with values that are unused in
                 objects, and pretty (Boolean, defaults to false), which gives
                 control to the method `_getPrettyJSON`.
        * @returns {JSON}
        */
        toJSON: function (options) {
            options = options || {};
            return options.pretty
                ? this._getPrettyJSON(options)
                : this._getJSON(options);
        }
    }));
