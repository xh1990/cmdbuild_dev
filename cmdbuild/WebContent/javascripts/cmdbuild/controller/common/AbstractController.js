(function () {

	/**
	 * Class to be extended in controllers witch implements new CMDBuild algorithms where controller creates view
	 *
	 * @abstract
	 */
	Ext.define('CMDBuild.controller.common.AbstractController', {

		/**
		 * @cfg {Object}
		 */
		parentDelegate: undefined,

		/**
		 * Array of controller managed function
		 *
		 * @cfg {Array}
		 *
		 * @abstract
		 */
		cmfgCatchedFunctions: [],

		/**
		 * Map to bind string to functions names
		 *
		 * @property {Object}
		 *
		 * @private
		 */
		stringToFunctionNameMap: {},

		/**
		 * @property {Object}
		 */
		view: undefined,

		/**
		 * @param {Object} configObject
		 */
		constructor: function(configurationObject) {
			this.stringToFunctionNameMap = {};

			Ext.apply(this, configurationObject); // Apply configuration to class

			this.decodeCatchedFunctionsArray();
		},

		/**
		 * Default implementation of controller managed functions gatherer (CMFG), should be the only access point to class functions
		 *
		 * @param {String} name
		 * @param {Object} param
		 * @param {Function} callback
		 */
		cmfg: function(name, param, callBack) {
			if (
				!Ext.isEmpty(name)
				&& Ext.isArray(this.cmfgCatchedFunctions)
				&& this.stringToFunctionNameMap.hasOwnProperty(name)
				&& !Ext.isEmpty(this.stringToFunctionNameMap[name])
			) {
				// Normal function manage
				if (Ext.isString(this.stringToFunctionNameMap[name]) && Ext.isFunction(this[this.stringToFunctionNameMap[name]]))
					return this[this.stringToFunctionNameMap[name]](param, callBack);

				if (Ext.isObject(this.stringToFunctionNameMap[name])) {
					switch (this.stringToFunctionNameMap[name].action) {
						// Forwarded function manage
						case 'forward':
							return this[this.stringToFunctionNameMap[name].target][name](param, callBack);
					}
				}
			}

			// If function is not managed from this controller forward to parentDelegate
			if (!Ext.isEmpty(this.parentDelegate) && Ext.isFunction(this.parentDelegate.cmfg))
				return this.parentDelegate.cmfg(name, param, callBack);

			_warning('unmanaged function with name "' + name + '"', this);
		},

		/**
		 * Decodes array string inline tags (forward: '->', alias: '=')
		 *
		 * @private
		 */
		decodeCatchedFunctionsArray: function() {
			Ext.Array.forEach(this.cmfgCatchedFunctions, function(managedFnString, i, allManagedFnString) {
				if (Ext.isString(managedFnString)) {
					// Forward inline tag
					if (managedFnString.indexOf('->') >= 0) {
						var splittedString = managedFnString.split('->');

						if (splittedString.length == 2 && Ext.String.trim(splittedString[0]).indexOf(' ') < 0)
							this.stringToFunctionNameMap[Ext.String.trim(splittedString[0])] = {
								action: 'forward',
								target: Ext.String.trim(splittedString[1])
							};
					}

					// Alias inline tag
					if (managedFnString.indexOf('=') >= 0) {
						var splittedString = managedFnString.split('=');
						if (
							splittedString.length == 2
							&& Ext.String.trim(splittedString[0]).indexOf(' ') < 0
							&& Ext.String.trim(splittedString[1]).indexOf(' ') < 0
						) {
							this.stringToFunctionNameMap[Ext.String.trim(splittedString[0])] = Ext.String.trim(splittedString[0]);
							this.stringToFunctionNameMap[Ext.String.trim(splittedString[1])] = Ext.String.trim(splittedString[0]);
						}
					}

					// Plain string
					var trimmedString = Ext.String.trim(managedFnString);

					if (trimmedString.indexOf(' ') < 0)
						this.stringToFunctionNameMap[trimmedString] = trimmedString;
				}
			}, this);
		},

		/**
		 * @return {Object}
		 */
		getView: function() {
			return this.view;
		},

		/**
		 * Validation input form
		 *
		 * @param {Ext.form.Panel} form
		 *
		 * @return {Boolean}
		 */
		validate: function(form) {
			var invalidFieldsArray = form.getNonValidFields();

			// Check for invalid fields and builds errorMessage
			if (!Ext.isEmpty(form) && (invalidFieldsArray.length > 0)) {
				var errorMessage = CMDBuild.Translation.errors.invalid_fields + '<ul style="text-align: left;">';

				for (index in invalidFieldsArray)
					errorMessage += '<li>' + invalidFieldsArray[index].fieldLabel + '</li>';

				errorMessage += '<ul>';

				CMDBuild.Msg.error(CMDBuild.Translation.common.failure, errorMessage, false);

				return false;
			}

			return true;
		}
	});

})();