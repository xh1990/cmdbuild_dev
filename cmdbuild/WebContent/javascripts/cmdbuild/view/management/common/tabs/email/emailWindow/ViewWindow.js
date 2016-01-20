(function() {

	Ext.define('CMDBuild.view.management.common.tabs.email.emailWindow.ViewWindow', {
		extend: 'CMDBuild.core.PopupWindow',

		requires: ['CMDBuild.core.proxy.CMProxyConstants'],

		/**
		 * @cfg {CMDBuild.controller.management.common.tabs.email.EmailWindow}
		 */
		delegate: undefined,

		/**
		 * @property {CMDBuild.view.management.common.tabs.email.attachments.MainContainer}
		 */
		attachmentContainer: undefined,

		/**
		 * @property {Ext.button.Split}
		 */
		fillFromTemplateButton: undefined,

		/**
		 * @property {Ext.form.Panel}
		 */
		form: undefined,

		title: CMDBuild.Translation.viewEmail,

		layout: 'border',

		initComponent: function() {
			this.attachmentContainer = Ext.create('CMDBuild.view.management.common.tabs.email.attachments.MainContainer', {
				height: '30%',
				region: 'south',
				readOnly: true
			});

			// Used Ext.form.Panel to be able to use loadRecord() function to load fields values
			this.form = Ext.create('Ext.form.Panel', {
				region: 'center',
				frame: false,
				border: false,
				padding: '5',
				bodyCls: 'x-panel-body-default-framed',

				layout: {
					type: 'vbox',
					align: 'stretch' // Child items are stretched to full width
				},

				defaults: {
					labelAlign: 'right',
					labelWidth: CMDBuild.LABEL_WIDTH
				},

				items: [
					{
						xtype: 'checkbox',
						fieldLabel: CMDBuild.Translation.keepSync,
						readOnly: true,
						name: CMDBuild.core.proxy.CMProxyConstants.KEEP_SYNCHRONIZATION
					},
					Ext.create('CMDBuild.view.common.field.delay.Display', {
						name: CMDBuild.core.proxy.CMProxyConstants.DELAY,
						fieldLabel: CMDBuild.Translation.delay,
						labelAlign: 'right',
						labelWidth: CMDBuild.LABEL_WIDTH,
						readOnly: true
					}),
					{
						xtype: 'displayfield',
						name: CMDBuild.core.proxy.CMProxyConstants.FROM,
						fieldLabel: CMDBuild.Translation.from
					},
					{
						xtype: 'displayfield',
						name: CMDBuild.core.proxy.CMProxyConstants.TO,
						fieldLabel: CMDBuild.Translation.to
					},
					{
						xtype: 'displayfield',
						name: CMDBuild.core.proxy.CMProxyConstants.CC,
						fieldLabel: CMDBuild.Translation.cc
					},
					{
						xtype: 'displayfield',
						name: CMDBuild.core.proxy.CMProxyConstants.BCC,
						fieldLabel: CMDBuild.Translation.bcc
					},
					{
						xtype: 'displayfield',
						name: CMDBuild.core.proxy.CMProxyConstants.SUBJECT,
						fieldLabel: CMDBuild.Translation.subject
					},
					{ // Thisn't a good way to display email content, but i don't know better one
						xtype: 'panel',
						autoScroll: true,
						frame: true,
						border: true,
						margin: '1 0', // Fixes a bug that hides bottom border
						flex: 1,
						html: this.delegate.record.get(CMDBuild.core.proxy.CMProxyConstants.BODY)
					}
				]
			});

			Ext.apply(this, {
				dockedItems: [
					Ext.create('Ext.toolbar.Toolbar', {
						dock: 'top',
						itemId: CMDBuild.core.proxy.CMProxyConstants.TOOLBAR_TOP,
						items: [
							this.fillFromTemplateButton = Ext.create('Ext.button.Split', {
								iconCls: 'clone',
								text: CMDBuild.Translation.composeFromTemplate,
								disabled: true,

								menu: Ext.create('Ext.menu.Menu', {
									items: []
								})
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
							Ext.create('CMDBuild.core.buttons.Close', {
								scope: this,

								handler: function(button, e) {
									this.delegate.cmfg('onEmailWindowAbortButtonClick');
								}
							})
						]
					})
				],
				items: [this.form, this.attachmentContainer]
			});

			this.callParent(arguments);
		}
	});

})();