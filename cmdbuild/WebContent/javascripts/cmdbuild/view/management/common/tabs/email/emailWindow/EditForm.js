(function() {

	Ext.define('CMDBuild.view.management.common.tabs.email.emailWindow.EditForm', {
		extend: 'Ext.form.Panel',

		requires: ['CMDBuild.core.proxy.CMProxyConstants'],

		mixins: {
			panelFunctions: 'CMDBuild.view.common.PanelFunctions'
		},

		/**
		 * @cfg {CMDBuild.controller.management.common.tabs.email.EmailWindow}
		 */
		delegate: undefined,

		/**
		 * @property {CMDBuild.view.common.field.CMHtmlEditorField}
		 */
		emailContentField: undefined,

		/**
		 * @property {Ext.form.field.Checkbox}
		 */
		keepSynchronizationCheckbox: undefined,

		frame: false,
		border: false,
		padding: '5',
		flex: 3,
		bodyCls: 'x-panel-body-default-framed',

		layout: {
			type: 'vbox',
			align: 'stretch' // Child items are stretched to full width
		},

		defaults: {
			labelAlign: 'right',
			labelWidth: CMDBuild.LABEL_WIDTH
		},

		initComponent: function() {
			this.emailContentField = Ext.create('CMDBuild.view.common.field.CMHtmlEditorField', {
				name: CMDBuild.core.proxy.CMProxyConstants.BODY,
				hideLabel: true,
				flex: 1,

				listeners: {
					scope: this,
					change: function(field, newValue, oldValue, eOpts) {
						this.delegate.cmfg('onEmailWindowFieldChange');
					}
				}
			});

			this.keepSynchronizationCheckbox = Ext.create('Ext.form.field.Checkbox', {
				name: CMDBuild.core.proxy.CMProxyConstants.KEEP_SYNCHRONIZATION,
				fieldLabel: CMDBuild.Translation.keepSync,
				labelAlign: 'right',
				labelWidth: CMDBuild.LABEL_WIDTH,
				disabled: true,
				inputValue: true,
				uncheckedValue: false
			});

			this.delayField = Ext.create('CMDBuild.view.common.field.delay.Delay', {
				name: CMDBuild.core.proxy.CMProxyConstants.DELAY,
				fieldLabel: CMDBuild.Translation.delay,
				labelWidth: CMDBuild.LABEL_WIDTH,
				labelAlign: 'right',
				maxWidth: CMDBuild.MEDIUM_FIELD_WIDTH
			});

			this.fromField = Ext.create('Ext.form.field.Display', {
				name: CMDBuild.core.proxy.CMProxyConstants.FROM,
				fieldLabel: CMDBuild.Translation.from,
				labelWidth: CMDBuild.LABEL_WIDTH,
				labelAlign: 'right',
				vtype: 'multiemail',
				submitValue: true,

				listeners: {
					scope: this,
					change: function(field, newValue, oldValue, eOpts) {
						this.delegate.cmfg('onEmailWindowFieldChange');
					}
				}
			});

			Ext.apply(this, {
				items: [
					this.keepSynchronizationCheckbox,
					this.delayField,
					this.fromField,
					{
						xtype: 'textfield',
						name: CMDBuild.core.proxy.CMProxyConstants.TO,
						allowBlank: false,
						fieldLabel: CMDBuild.Translation.to,
						vtype: 'multiemail',

						listeners: {
							scope: this,
							change: function(field, newValue, oldValue, eOpts) {
								this.delegate.cmfg('onEmailWindowFieldChange');
							}
						}
					},
					{
						xtype: 'textfield',
						name: CMDBuild.core.proxy.CMProxyConstants.CC,
						fieldLabel: CMDBuild.Translation.cc,
						vtype: 'multiemail',

						listeners: {
							scope: this,
							change: function(field, newValue, oldValue, eOpts) {
								this.delegate.cmfg('onEmailWindowFieldChange');
							}
						}
					},
					{
						xtype: 'textfield',
						name: CMDBuild.core.proxy.CMProxyConstants.BCC,
						fieldLabel: CMDBuild.Translation.bcc,
						vtype: 'multiemail',

						listeners: {
							scope: this,
							change: function(field, newValue, oldValue, eOpts) {
								this.delegate.cmfg('onEmailWindowFieldChange');
							}
						}
					},
					{
						xtype: 'textfield',
						name: CMDBuild.core.proxy.CMProxyConstants.SUBJECT,
						allowBlank: false,
						fieldLabel: CMDBuild.Translation.subject,

						listeners: {
							scope: this,
							change: function(field, newValue, oldValue, eOpts) {
								this.delegate.cmfg('onEmailWindowFieldChange');
							}
						}
					},
					this.emailContentField
				]
			});

			this.callParent(arguments);

			this.fixIEFocusIssue();
		},

		/**
		 * Sometimes on IE the HtmlEditor is not able to take the focus after the mouse click. With this call it works. The reason is currently unknown.
		 */
		fixIEFocusIssue: function() {
			if (Ext.isIE || !!navigator.userAgent.match(/Trident.*rv[ :]*11\./)) // Workaround to detect IE 11 witch is not supported from Ext 4.2
				this.mon(this.emailContentField, 'render', function() {
					try {
						this.emailContentField.focus();
					} catch (e) {}
				}, this);
		}
	});

})();