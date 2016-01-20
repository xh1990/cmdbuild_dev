(function() {

	Ext.define('CMDBuild.view.management.report.GridPanel', {
		extend: 'Ext.grid.Panel',

		requires: ['CMDBuild.core.proxy.Report'],

		/**
		 * @cfg {CMDBuild.controller.management.report.Report}
		 */
		delegate: undefined,

		border: false,
		frame: false,

		initComponent: function() {
			// Apply first store to use it in paging bar
			Ext.apply(this, {
				store: CMDBuild.core.proxy.Report.getStore()
			});

			Ext.apply(this, {
				dockedItems: [
					Ext.create('Ext.toolbar.Paging', {
						dock: 'bottom',
						itemId: CMDBuild.core.proxy.CMProxyConstants.TOOLBAR_BOTTOM,
						store: this.getStore(),
						displayInfo: true,
						displayMsg: '{0} - {1} ' + CMDBuild.Translation.common.display_topic_of + ' {2}',
						emptyMsg: CMDBuild.Translation.common.display_topic_none
					})
				],
				columns: [
					{
						text: CMDBuild.Translation.name,
						sortable: true,
						dataIndex: CMDBuild.core.proxy.CMProxyConstants.TITLE,
						flex: 1
					},
					{
						text: CMDBuild.Translation.descriptionLabel,
						sortable: true,
						dataIndex: CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION,
						flex: 1
					},
					Ext.create('Ext.grid.column.Action', {
						text: CMDBuild.Translation.report,
						align: 'center',
						width: 120,
						sortable: false,
						hideable: false,
						menuDisabled: true,
						fixed: true,

						items: [
							Ext.create('CMDBuild.core.buttons.FileFormatsPdf', {
								withSpacer: true,
								tooltip: CMDBuild.Translation.pdf,
								scope: this,

								handler: function(grid, rowIndex, colIndex, node, e, record, rowNode) {
									this.delegate.cmfg('onReportGenerateButtonClick', {
										record: record,
										type: CMDBuild.core.proxy.CMProxyConstants.PDF
									});
								}
							}),
							Ext.create('CMDBuild.core.buttons.FileFormatsOdt', {
								withSpacer: true,
								tooltip: CMDBuild.Translation.odt,
								scope: this,

								handler: function(grid, rowIndex, colIndex, node, e, record, rowNode) {
									this.delegate.cmfg('onReportGenerateButtonClick', {
										record: record,
										type: CMDBuild.core.proxy.CMProxyConstants.ODT
									});
								}
							}),
							Ext.create('CMDBuild.core.buttons.FileFormatsRtf', {
								withSpacer: true,
								tooltip: CMDBuild.Translation.rtf,
								scope: this,

								handler: function(grid, rowIndex, colIndex, node, e, record, rowNode) {
									this.delegate.cmfg('onReportGenerateButtonClick', {
										record: record,
										type: CMDBuild.core.proxy.CMProxyConstants.RTF
									});
								}
							}),
							Ext.create('CMDBuild.core.buttons.FileFormatsCsv', {
								withSpacer: true,
								tooltip: CMDBuild.Translation.csv,
								scope: this,

								handler: function(grid, rowIndex, colIndex, node, e, record, rowNode) {
									this.delegate.cmfg('onReportGenerateButtonClick', {
										record: record,
										type: CMDBuild.core.proxy.CMProxyConstants.CSV
									});
								}
							})
						]
					})
				]
			});

			this.callParent(arguments);
		}
	});

})();