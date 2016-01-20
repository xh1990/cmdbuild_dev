(function() {

	Ext.define('CMDBuild.view.management.common.widgets.grid.ImportCSVWindow', {
		extend: 'CMDBuild.core.PopupWindow',

		requires: [
			'CMDBuild.core.proxy.CMProxyConstants',
			'CMDBuild.core.proxy.Csv'
		],

		/**
		 * @cfg {CMDBuild.controller.management.common.widgets.grid.ImportCSV}
		 */
		delegate: undefined,

		/**
		 * @property {Ext.form.field.Hidden}
		 */
		classIdField: undefined,

		/**
		 * @property {Ext.form.field.File}
		 */
		csvFileField: undefined,

		/**
		 * @property {Ext.form.field.ComboBox}
		 */
		csvImportModeCombo: undefined,

		/**
		 * @property {Ext.form.field.ComboBox}
		 */
		csvSeparatorCombo: undefined,

		/**
		 * @property {Ext.form.Panel}
		 */
		csvUploadForm: undefined,

		border: false,
		defaultSizeW: 0.90,
		autoHeight: true,
		title: CMDBuild.Translation.importFromCSV,

		initComponent: function() {
			this.classIdField = Ext.create('Ext.form.field.Hidden', {
				name: 'idClass'
			});

			this.csvFileField = Ext.create('Ext.form.field.File', {
				name: 'filecsv',
				fieldLabel: CMDBuild.Translation.csvFile,
				labelWidth: CMDBuild.LABEL_WIDTH,
				labelAlign: 'right',
				allowBlank: true,
				width: CMDBuild.BIG_FIELD_WIDTH
			});

			this.csvSeparatorCombo = Ext.create('Ext.form.field.ComboBox', {
				name: 'separator',
				fieldLabel: CMDBuild.Translation.separator,
				labelWidth: CMDBuild.LABEL_WIDTH,
				labelAlign: 'right',
				valueField: CMDBuild.core.proxy.CMProxyConstants.VALUE,
				displayField: CMDBuild.core.proxy.CMProxyConstants.VALUE,
				width: 200,
				value: ';',
				editable: false,
				allowBlank: false,

				store: CMDBuild.core.proxy.Csv.getSeparatorStore(),
				queryMode: 'local'
			});

			this.csvImportModeCombo = Ext.create('Ext.form.field.ComboBox', {
				name: CMDBuild.core.proxy.CMProxyConstants.MODE,
				fieldLabel: CMDBuild.Translation.mode,
				labelWidth: CMDBuild.LABEL_WIDTH,
				labelAlign: 'right',
				valueField: CMDBuild.core.proxy.CMProxyConstants.VALUE,
				displayField: CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION,
				width: CMDBuild.MEDIUM_FIELD_WIDTH,
				value: 'replace',
				editable: false,
				allowBlank: false,

				store: CMDBuild.core.proxy.Csv.getImportModeStore(),
				queryMode: 'local'
			});

			this.csvUploadForm = Ext.create('Ext.form.Panel', {
				frame: true,
				border: false,
				encoding: 'multipart/form-data',
				fileUpload: true,
				monitorValid: true,

				items: [this.csvFileField, this.csvSeparatorCombo, this.csvImportModeCombo, this.classIdField]
			});

			Ext.apply(this, {
				dockedItems: [
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
							Ext.create('CMDBuild.core.buttons.Upload', {
								scope: this,

								handler: function(button, e) {
									this.delegate.cmfg('onImportCSVUploadButtonClick');
								}
							}),
							Ext.create('CMDBuild.core.buttons.Abort', {
								scope: this,

								handler: function(button, e) {
									this.delegate.cmfg('onImportCSVAbortButtonClick');
								}
							})
						]
					})
				],
				items: [this.csvUploadForm]
			});

			this.callParent(arguments);

			// Resize window, smaller than default size
			this.width = this.width * this.defaultSizeW;
		}
	});

})();