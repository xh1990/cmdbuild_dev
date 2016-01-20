(function() {

	Ext.define('CMDBuild.view.management.common.tabs.email.attachments.picker.MainWindow', {
		extend: 'CMDBuild.PopupWindow',

		requires: ['CMDBuild.core.proxy.CMProxyConstants'],

		/**
		 * @cfg {CMDBuild.controller.management.common.tabs.email.attachments.Picker}
		 */
		delegate: undefined,

		/**
		 * @property {CMDBuild.view.management.common.tabs.email.attachments.picker.AttachmentGrid}
		 */
		attachmentGrid: undefined,

		/**
		 * @property {CMDBuild.view.management.common.tabs.email.attachments.picker.CardGrid}
		 */
		cardGrid: undefined,

		/**
		 * @property {Ext.form.field.ComboBox}
		 */
		classComboBox: undefined,

		buttonAlign: 'center',
		layout: 'border',
		title: CMDBuild.Translation.chooseAttachmentFromDb,

		initComponent: function() {
			this.classComboBox = Ext.create('Ext.form.field.ComboBox', {
				labelWidth: CMDBuild.LABEL_WIDTH,
				fieldLabel: CMDBuild.Translation.selectAClass,
				labelAlign: 'right',
				valueField: CMDBuild.core.proxy.CMProxyConstants.ID,
				displayField: CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION,
				editable: false,

				store: _CMCache.getClassesAndProcessesStore(),
				queryMode: 'local',

				listeners: {
					scope: this,

					change: function(field, newValue, oldValue) {
						this.delegate.cmfg('onPickerWindowClassSelected');
					}
				}
			});

			this.cardGrid = Ext.create('CMDBuild.view.management.common.tabs.email.attachments.picker.CardGrid', {
				delegate: this.delegate,
				region: 'center'
			});

			this.attachmentGrid = Ext.create('CMDBuild.view.management.common.tabs.email.attachments.picker.AttachmentGrid', {
				delegate: this.delegate,
				region: 'south',
				height: '30%'
			});

			Ext.apply(this, {
				dockedItems: [
					Ext.create('Ext.toolbar.Toolbar', {
						dock: 'top',
						itemId: CMDBuild.core.proxy.CMProxyConstants.TOOLBAR_TOP,
						items: [this.classComboBox]
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
									this.delegate.cmfg('onPickerWindowConfirmButtonClick');
								}
							}),
							Ext.create('CMDBuild.core.buttons.Abort', {
								scope: this,

								handler: function(button, e) {
									this.delegate.cmfg('onPickerWindowAbortButtonClick');
								}
							})
						]
					})
				],
				items: [this.cardGrid, this.attachmentGrid]
			});

			this.callParent(arguments);
		}
	});

})();