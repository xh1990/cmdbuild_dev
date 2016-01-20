(function() {

	Ext.define('CMDBuild.model.common.attributes.Metadata', {
		extend: 'Ext.data.Model',

		requires: ['CMDBuild.core.proxy.CMProxyConstants'],

		fields: [
			{ name: CMDBuild.core.proxy.CMProxyConstants.KEY, type: 'string' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.VALUE, type: 'string' }
		]
	});

})();