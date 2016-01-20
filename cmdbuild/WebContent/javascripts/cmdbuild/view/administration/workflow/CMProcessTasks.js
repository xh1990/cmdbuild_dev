(function() {

	var tr = CMDBuild.Translation.administration.tasks; // Path to translation

	Ext.define('CMDBuild.view.administration.workflow.CMProcessTasks', {
		extend: 'Ext.panel.Panel',

		mixins: {
			cmFormFunctions: 'CMDBUild.view.common.CMFormFunctions'
		},

		delegate: undefined,

		border: true,
		frame: false,
		layout: 'fit',

		initComponent: function() {
			// Buttons configuration
			this.addButton = Ext.create('Ext.button.Button', {
				iconCls: 'add',
				text: tr.add,
				scope: this,
				handler: function() {
					this.delegate.cmOn('onAddButtonClick', { type: 'workflow' });
				}
			});

			this.modifyButton = Ext.create('Ext.button.Button', {
				iconCls: 'modify',
				text: tr.modify,
				scope: this,
				handler: function() {
					this.delegate.cmOn('onModifyButtonClick', { type: 'workflow' });
				}
			});

			this.removeButton = Ext.create('Ext.button.Button', {
				iconCls: 'delete',
				text: tr.remove,
				scope: this,
				handler: function() {
					this.delegate.cmOn('onRemoveButtonClick', { type: 'workflow' });
				}
			});
			// END: Buttons configuration

			this.grid = Ext.create('CMDBuild.view.administration.workflow.CMProcessTasksGrid');

			this.cmTBar = [this.addButton, this.modifyButton, this.removeButton];

			Ext.apply(this, {
				dockedItems: [
					{
						xtype: 'toolbar',
						dock: 'top',
						itemId: CMDBuild.core.proxy.CMProxyConstants.TOOLBAR_TOP,
						items: this.cmTBar
					}
				],
				items: [this.grid]
			});

			this.callParent();
			this.disableCMTbar();
			this.addButton.enable();
		}
	});

})();