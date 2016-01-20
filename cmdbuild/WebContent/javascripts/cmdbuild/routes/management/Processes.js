(function() {

	Ext.define('CMDBuild.routes.management.Processes', {
		extend: 'CMDBuild.routes.Base',

		requires: ['CMDBuild.core.proxy.CMProxyConstants'],

		/**
		 * @cfg {String}
		 */
		clientFilter: undefined,

		/**
		 * @cfg {String}
		 */
		processIdentifier: undefined,

		/**
		 * @cfg {CMDBuild.cache.CMEntryTypeModel}
		 */
		entryType: undefined,

		/**
		 * @cfg {Array}
		 */
		supportedPrintFormats: [
			CMDBuild.core.proxy.CMProxyConstants.PDF,
			CMDBuild.core.proxy.CMProxyConstants.CSV
		],

		/**
		 * Apply clientFilter to grid
		 *
		 * TODO: this functionality is not implemented in processes controller so i leave here the method for a future implementation
		 */
		applyClientFilter: function() {
			if (!Ext.isEmpty(this.clientFilter))
				Ext.Function.createDelayed(function() {
					this.entryType.set(CMDBuild.core.proxy.CMProxyConstants.FILTER, this.clientFilter); // Inject filter in entryType object

					_CMMainViewportController.panelControllers[CMDBuild.core.proxy.CMProxyConstants.PROCESS].onViewOnFront(this.entryType);
				}, 1500, this)();
		},

		/**
		 * @param {Object} params - url parameters
		 * @param {String} params.processIdentifier - process name
		 * @param {String} params.clientFilter - advanced filter object serialized
		 * @param {String} path
		 * @param {Object} router
		 */
		detail: function(params, path, router) {
			if (this.paramsValidation(params)) {
				this.entryType = _CMCache.getEntryTypeByName(this.processIdentifier);

				CMDBuild.Runtime.StartingClassId = this.entryType.get(CMDBuild.core.proxy.CMProxyConstants.ID); // Use runtime configuration to select class

				this.applyClientFilter();
			}
		},

		/**
		 * @param {Object} params
		 *
		 * @return  {Boolean}
		 */
		paramsValidation: function(params) {
			this.processIdentifier = params[CMDBuild.core.proxy.CMProxyConstants.PROCESS_IDENTIFIER];
			this.clientFilter = params[CMDBuild.core.proxy.CMProxyConstants.CLIENT_FILTER];
			this.printFormat = params[CMDBuild.core.proxy.CMProxyConstants.FORMAT] || CMDBuild.core.proxy.CMProxyConstants.PDF;

			// Process identifier validation
			if (
				Ext.isEmpty(this.processIdentifier)
				|| !_CMCache.isEntryTypeByName(this.processIdentifier)
			) {
				CMDBuild.Msg.error(
					CMDBuild.Translation.common.failure,
					CMDBuild.Translation.errors.routesInvalidProcessIdentifier + ' (' + this.processIdentifier + ')',
					false
				);

				return false;
			}

			// Client filter validation
			if (!Ext.isEmpty(this.clientFilter)) {
				// TODO: validate filter with server side call
			}

			// Print format validation
			if (!Ext.Array.contains(this.supportedPrintFormats, this.printFormat)) {
				CMDBuild.Msg.error(
					CMDBuild.Translation.common.failure,
					CMDBuild.Translation.errors.routesInvalidPrintFormat + ' (' + this.printFormat + ')',
					false
				);

				return false;
			}

			return true;
		},

		/**
		 * @param {Object} params - url parameters
		 * @param {String} params.format
		 * @param {String} path
		 * @param {Object} router
		 */
		print: function(params, path, router) {
			this.detail(params, path, router);

			Ext.Function.createDelayed(function() {
				_CMMainViewportController.panelControllers[CMDBuild.core.proxy.CMProxyConstants.PROCESS].gridController.onPrintGridMenuClick(this.printFormat);
			}, 500, this)();
		},

		/**
		 * @param {Object} params - url parameters
		 * @param {String} path
		 * @param {Object} router
		 */
		showAll: function(params, path, router) {
			if (Ext.Object.isEmpty(params)) {
				Ext.Function.createDelayed(function() {
					_CMMainViewportController.accordionControllers[CMDBuild.core.proxy.CMProxyConstants.PROCESS].accordion.selectFirstSelectableNode();
				}, 500, this)();
			}
		}
	});

})();