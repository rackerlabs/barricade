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
                schema = self._schema;

            self._parameters = parameters = parameters || {};

            if (schema.hasOwnProperty('@inputMassager')) {
                json = schema['@inputMassager'](json);
            }

            self._setData(json);

            if (schema.hasOwnProperty('@toJSON')) {
                self.toJSON = schema['@toJSON'];
            }

            Observable.call(self);
            Omittable.call(self);
            Deferrable.call(self, schema);
            Validatable.call(self, schema);

            if (schema.hasOwnProperty('@enum')) {
                Enumerated.call(self, schema['@enum']);
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
            return this._schema.hasOwnProperty('@default')
                ? typeof this._schema['@default'] === 'function'
                    ? this._schema['@default'].call(this)
                    : this._schema['@default']
                : this._schema['@type']();
        },

        /**
        * @memberof Barricade.Base
        * @private
        */
        _setData: function(json) {
            var type = this._schema['@type'];

            if (getType(json) !== type) {
                if (json) {
                    logError("Type mismatch. JSON: ", json,
                             "schema: ", this._schema);
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
        _sift: function () {
            throw new Error("sift() must be overridden in subclass");
        },

        /**
        * @memberof Barricade.Base
        * @private
        */
        _getPrettyJSON: function (options) {
            return this._getJSON(options);
        },

        /**
        * Returns the primitive type of the Barricade object.
        * @memberof Barricade.Base
        * @instance
        * @returns {constructor}
        */
        getPrimitiveType: function () {
            return this._schema['@type'];
        },

        /**
        * @memberof Barricade.Base
        * @instance
        * @virtual
        */
        isEmpty: function () {
            throw new Error('Subclass should override isEmpty()');
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
            return this._schema['@required'] !== false;
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
