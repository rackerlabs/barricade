// Barricade.js API
// Author: Drago Rosson
Barricade = (function () {
    "use strict";

    var barricade = {};

    var blueprint = {
            create: function (f) {
                var g = function () {
                        if (this.hasOwnProperty('_parents')) {
                            this._parents.push(g);
                        } else {
                            Object.defineProperty(this, '_parents', {
                                value: [g]
                            });
                        }

                        f.apply(this, arguments);
                    };

                return g;
            }
    };

    barricade.identifiable = blueprint.create(function (id) {
        this.getID = function () {
            return id;
        };

        this.setID = function (newID) {
            id = newID;
            this.emit('change', 'id');
        };
    });

    barricade.omittable = blueprint.create(function (isUsed) {
        this.isUsed = function () {
            // If required, it has to be used.
            return this.isRequired() || isUsed;
        };

        this.setIsUsed = function (newUsedValue) {
            isUsed = !!newUsedValue;
        };

        this.on('change', function () {
            isUsed = !this.isEmpty();
        });
    });

    barricade.deferrable = blueprint.create(function (schema) {
        var self = this,
            deferred;

        function resolver(neededValue) {
            var ref = schema['@ref'].resolver(self, neededValue);
            if (ref === undefined) {
                logError('Could not resolve "' + 
                          JSON.stringify(self.toJSON()) + '"');
            }
            return ref;
        }

        function hasDependency() {
            return schema.hasOwnProperty('@ref');
        }

        this.hasDependency = hasDependency;

        if (hasDependency()) {
            this.getDeferred = function () {
                return deferred;
            };

            deferred = barricade.deferred.create(schema['@ref'].needs,
                                                 resolver);
        }
    });

    barricade.validatable = blueprint.create(function (schema) {
        var constraints = schema['@constraints'],
            error = null;

        if (barricade.getType(constraints) !== Array) {
            constraints = [];
        }

        this.hasError = function () { return error !== null; };
        this.getError = function () { return error || ''; };

        this._validate = function (value) {
            function getConstraintMessage(i, lastMessage) {
                if (lastMessage !== true) {
                    return lastMessage;
                } else if (i < constraints.length) {
                    return getConstraintMessage(i + 1, constraints[i](value));
                }
                return null;
            }
            error = getConstraintMessage(0, true);
            return !this.hasError();
        };
    });
