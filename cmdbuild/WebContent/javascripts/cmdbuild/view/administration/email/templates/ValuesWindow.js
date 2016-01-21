(function() {

	Ext.define('CMDBuild.view.administration.email.templates.ValuesWindow', {
		extend: 'CMDBuild.core.PopupWindow',

		requires: [
			'CMDBuild.core.proxy.CMProxyConstants',
			'CMDBuild.model.email.Templates'
		],

		/**
		 * @cfg {CMDBuild.controller.administration.email.templates.Templates}
		 */
		delegate: undefined,

		/**
		 * @property {Ext.grid.Panel}
		 */
		grid: undefined,

		title: CMDBuild.Translation.editValues,

		initComponent: function() {
			this.grid = Ext.create('Ext.grid.Panel', {
				border: false,
				frame: false,

				columns: [
					{
						dataIndex: CMDBuild.core.proxy.CMProxyConstants.KEY,
						text: CMDBuild.Translation.key,
						flex: 1,

						editor: { xtype: 'textfield' }
					},
					{
						dataIndex: CMDBuild.core.proxy.CMProxyConstants.VALUE,
						text: CMDBuild.Translation.value,
						flex: 1,

						editor: { xtype: 'textfield' }
					},
					{
						xtype: 'actioncolumn',
						width: 30,
						align: 'center',
						sortable: false,
						hideable: false,
						menuDisabled: true,
						fixed: true,

						items: [
							{
								icon: 'images/icons/cross.png',
								tooltip: CMDBuild.Translation.common.buttons.remove,

								handler: function(grid, rowIndex, colIndex, node, e, record, rowNode) {
									grid.getStore().remove(record);
								}
							}
						]
					}
				],

				store: Ext.create('Ext.data.Store', {
					model: 'CMDBuild.model.email.Templates.variablesWindow',
					data: []
				}),

				plugins: [
					Ext.create('Ext.grid.plugin.CellEditing', {
						clicksToEdit: 1
					})
				]
			});

			Ext.apply(this, {
				dockedItems: [
					Ext.create('Ext.toolbar.Toolbar', {
						dock: 'top',
						itemId: CMDBuild.core.proxy.CMProxyConstants.TOOLBAR_TOP,

						items: [
							Ext.create('CMDBuild.core.buttons.Add', {
								scope: this,

								handler: function(buttons, e) {
									this.grid.getStore().insert(0, Ext.create('CMDBuild.model.email.Templates.variablesWindow'));
								}
							})
						]
					}),
					Ext.create('Ext.toolbar.Toolbar', {
						dock: 'bottom',
						itemId: CMDBuild.core.proxy.CMProxyConstants.TOOLBAR_BOTTOM,
						ui: 'footer',

						layout: {
							type: 'hbox',
							align: 'middle',
							pack: 'center'
						},

						items: [
							Ext.create('CMDBuild.core.buttons.Confirm', {
								scope: this,

								handler: function(button, e) {
									this.delegate.cmfg('onValuesWindowSaveButtonClick');
								}
							}),
							Ext.create('CMDBuild.core.buttons.Abort', {
								scope: this,

								handler: function(button, e) {
									this.delegate.cmfg('onValuesWindowAbortButtonClick');
								}
							})
						]
					})
				],
				items: [this.grid]
			});

			this.callParent(arguments);
		}
	});

})();
