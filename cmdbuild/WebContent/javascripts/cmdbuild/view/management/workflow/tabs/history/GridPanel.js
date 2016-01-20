(function() {

	Ext.define('CMDBuild.view.management.workflow.tabs.history.GridPanel', {
		extend: 'Ext.grid.Panel',

		requires: ['CMDBuild.core.proxy.CMProxyConstants'],

		/**
		 * @cfg {CMDBuild.controller.management.common.tabs.History}
		 */
		delegate: undefined,

		/**
		 * @property {Ext.form.field.Checkbox}
		 */
		includeRelationsCheckbox: undefined,

		/**
		 * @property {Ext.form.field.Checkbox}
		 */
		includeSystemActivitiesCheckbox: undefined,

		config: {
			plugins: [
				Ext.create('CMDBuild.view.management.common.tabs.history.RowExpander', {
					id: 'processesHistoryTabRowExpander'
				})
			]
		},

		autoScroll: true,
		border: false,
		cls: 'history_panel', // To apply right style to grid rows
		frame: false,

		initComponent: function() {
			Ext.apply(this, {
				dockedItems: [
					Ext.create('Ext.toolbar.Toolbar', {
						dock: 'top',
						itemId: CMDBuild.core.proxy.CMProxyConstants.TOOLBAR_TOP,

						items: [
							'->',
							this.includeSystemActivitiesCheckbox = Ext.create('Ext.form.field.Checkbox', {
								boxLabel: CMDBuild.Translation.includeSystemActivities,
								boxLabelCls: 'cmtoolbaritem',
								checked: false, // Default as false
								scope: this,

								handler: function(checkbox, checked) {
									this.delegate.cmfg('onProcessesTabHistoryIncludeSystemActivitiesCheck');
								}
							}),
							this.includeRelationsCheckbox = Ext.create('Ext.form.field.Checkbox', {
								boxLabel: CMDBuild.Translation.includeRelations,
								boxLabelCls: 'cmtoolbaritem',
								checked: false, // Default as false
								scope: this,

								handler: function(checkbox, checked) {
									this.delegate.cmfg('onTabHistoryIncludeRelationCheck');
								}
							})
						]
					})
				],
				columns: this.delegate.cmfg('getTabHistoryGridColumns'),
				store: this.delegate.cmfg('getTabHistoryGridStore')
			});

			this.callParent(arguments);

			// Apply activitiesStore filter
			this.getStore().on('load', function(store, records, successful, eOpts) {
				this.delegate.cmfg('onProcessesTabHistoryIncludeSystemActivitiesCheck');
			}, this);
		},

		listeners: {
			viewready: function(view, eOpts) {
				this.getView().on('expandbody', function(rowNode, record, expandRow, eOpts) {
					this.doLayout(); // To refresh the scrollbar status and seems to fix also a glitch effect on row collapse

					this.delegate.cmfg('onTabHistoryRowExpand', record);
				}, this);
			}
		}
	});

})();