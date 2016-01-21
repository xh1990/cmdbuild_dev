(function() {

	Ext.define('CMDBuild.Administration.SetOrderWindow', {
		extend: 'CMDBuild.PopupWindow',

		height: 300,
		width: 300,
		buttonAlign: 'center',

		title: CMDBuild.Translation.administration.modClass.attributeProperties.set_sorting_criteria,

		initComponent: function() {
			this.saveBtn = Ext.create('CMDBuild.buttons.SaveButton', {
				handler: this.onSave,
				scope: this
			});

			this.abortBtn = Ext.create('CMDBuild.buttons.AbortButton', {
				handler: this.onAbort,
				scope: this
			});

			this.grid = Ext.create('CMDBuild.view.administration.class.CMAttributeSortingGrid', {
				idClass: this.idClass,
				border: false
			});

			Ext.apply(this, {
				buttons: [this.saveBtn, this.abortBtn],
				items: [this.grid],
			});

			this.callParent(arguments);
		},

		onSave: function() {
			var me = this;
			var editPlugin = this.grid.plugins[0];

			if (editPlugin)
				editPlugin.completeEdit(); // to update the record

			this.hide();
			var records = this.grid.getStore().getRange();
			var attributes = {};

			for (var order = 0, i = 0, len = records.length; i < len; i++) {
				var rec = records[i];

				if (rec.data.classOrderSign == 0)
					continue;

				++order;
				attributes[rec.data.name] = (rec.data.classOrderSign > 0 ? order : -order);
			}

			var params = {};
			params[CMDBuild.core.proxy.CMProxyConstants.CLASS_NAME] = _CMCache.getEntryTypeNameById(this.idClass);
			params[CMDBuild.core.proxy.CMProxyConstants.ATTRIBUTES] = Ext.encode(attributes);

			CMDBuild.ServiceProxy.attributes.updateSortConfiguration({
				params: params,
				waitTitle: CMDBuild.Translation.common.wait_title,
				waitMsg: CMDBuild.Translation.common.wait_msg,
				callback: function() {
					me.onAbort();
				}
			});
		},

		onAbort: function() {
			try {
				this.close();
			} catch (e) {
				_debug(e);
			}
		}
	});

})();