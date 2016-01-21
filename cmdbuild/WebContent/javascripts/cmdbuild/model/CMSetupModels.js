(function() {

	Ext.require('CMDBuild.core.proxy.CMProxyConstants');

	// TODO: should be fixed with id as int but if try to do it all comboboxes will display id in place of description because '123' != 123
	Ext.define("CMTableForComboModel", {
		extend: 'Ext.data.Model',
		fields: [
			{name: "name", type: 'string'},
			{name: "id",  type: 'string'},
			{name: "description",  type: 'string'}
		]
	});

	Ext.define('CMDBuild.model.CMSetupModels.startingClass', {
		extend: 'Ext.data.Model',

		fields: [
			{ name: CMDBuild.core.proxy.CMProxyConstants.ID,  type: 'int' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.NAME, type: 'string' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION,  type: 'string', mapping: 'text' }, // FIX: "text" attribute alias (wrong property name)
			{ name: CMDBuild.core.proxy.CMProxyConstants.TEXT,  type: 'string' }
		]
	});

})();