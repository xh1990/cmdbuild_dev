(function() {

	Ext.define('CMDBuild.view.management.common.tabs.email.attachments.FileAttacchedPanel', {
		extend: 'Ext.panel.Panel',

		/**
		 * @cfg {CMDBuild.controller.management.common.tabs.email.attachments.Attachments}
		 */
		delegate: undefined,

		/**
		 * @cfg {String}
		 */
		fileName: undefined,

		/**
		 * @cfg {Boolean}
		 */
		readOnly: false,

		frame: true,
		margin: 5,

		layout: {
			type: 'hbox',
			align: 'middle'
		},

		initComponent: function() {
			Ext.apply(this, {
				items: [
					Ext.create('Ext.form.field.Display', {
						value: this.fileName,
						flex: 1
					}),
					Ext.create('CMDBuild.core.buttons.Download', {
						tooltip: CMDBuild.Translation.download,
						scope: this,

						handler: function(button, e) {
							this.delegate.cmfg('onAttachmentDownloadButtonClick', this);
						}
					}),
					Ext.create('CMDBuild.core.buttons.Delete', {
						tooltip: CMDBuild.Translation.deleteLabel,
						disabled: this.readOnly,
						scope: this,

						handler: function(button, e) {
							this.delegate.cmfg('onAttachmentRemoveButtonClick', this);
						}
					})
				]
			});

			this.callParent(arguments);
		}
	});

})();