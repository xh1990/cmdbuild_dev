(function() {

	Ext.define('CMDBuild.core.proxy.widgets.Grid', {

		requires: [
			'CMDBuild.core.proxy.CMProxyConstants',
			'CMDBuild.core.proxy.CMProxyUrlIndex',
			'CMDBuild.model.CMModelFunctions'
		],

		singleton: true,

		/**
		 * Validates presets function name
		 *
		 * @param {Object} parameters
		 */
		getFunctions: function(parameters) {
			CMDBuild.Ajax.request({
				method: 'POST',
				url: CMDBuild.core.proxy.CMProxyUrlIndex.functions.getFunctions,
				scope: parameters.scope || this,
				failure: parameters.failure || Ext.emptyFn(),
				success: parameters.success || Ext.emptyFn(),
				callback: parameters.callback || Ext.emptyFn()
			});
		},

		/**
		 * @param {Object} parameters
		 *
		 * @return {Ext.data.Store}
		 */
		getStoreFromFunction: function(parameters) {
			// Avoid to send limit, page and start parameters in server calls
			parameters.extraParams.limitParam = undefined;
			parameters.extraParams.pageParam = undefined;
			parameters.extraParams.startParam = undefined;

			return Ext.create('Ext.data.Store', {
				autoLoad: true,
				fields: parameters.fields,
				proxy: {
					type: 'ajax',
					url: CMDBuild.core.proxy.CMProxyUrlIndex.widgets.grid.getSqlCardList,
					reader: {
						root: 'cards',
						type: 'json',
						totalProperty: 'results',
					},
					extraParams: parameters.extraParams
				}
			});
		}
	});

})();