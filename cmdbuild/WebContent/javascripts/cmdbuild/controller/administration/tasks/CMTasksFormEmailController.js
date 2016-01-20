(function() {

	Ext.define('CMDBuild.controller.administration.tasks.CMTasksFormEmailController', {
		extend: 'CMDBuild.controller.administration.tasks.CMTasksFormBaseController',

		requires: [
			'CMDBuild.core.proxy.CMProxyConstants',
			'CMDBuild.core.proxy.email.Accounts',
			'CMDBuild.core.proxy.CMProxyTasks'
		],

		/**
		 * @cfg {Array} array of all step delegates
		 */
		delegateStep: undefined,

		/**
		 * @cfg {CMDBuild.controller.administration.tasks.CMTasksController}
		 */
		parentDelegate: undefined,

		/**
		 * @property {Int}
		 */
		selectedId: undefined,

		/**
		 * @property {Ext.selection.Model}
		 */
		selectionModel: undefined,

		/**
		 * @cfg {String}
		 */
		taskType: 'email',

		/**
		 * @property {CMDBuild.view.administration.tasks.CMTasksForm}
		 */
		view: undefined,

		/**
		 * Gatherer function to catch events
		 *
		 * @param {String} name
		 * @param {Object} param
		 * @param {Function} callback
		 *
		 * @override
		 */
		cmOn: function(name, param, callBack) {
			switch (name) {
				case 'onAbortButtonClick':
					return this.onAbortButtonClick();

				case 'onAddButtonClick':
					return this.onAddButtonClick(name, param, callBack);

				case 'onCloneButtonClick':
					return this.onCloneButtonClick();

				case 'onModifyButtonClick':
					return this.onModifyButtonClick();

				case 'onRemoveButtonClick':
					return this.onRemoveButtonClick();

				case 'onRowSelected':
					return this.onRowSelected();

				case 'onSaveButtonClick':
					return this.onSaveButtonClick();

				default: {
					if (!Ext.isEmpty(this.parentDelegate))
						return this.parentDelegate.cmOn(name, param, callBack);
				}
			}
		},

		/**
		 * @param {String} name
		 * @param {Object} param
		 * @param {Function} callback
		 *
		 * @override
		 */
		onAddButtonClick: function(name, param, callBack) {
			this.callParent(arguments);

			this.delegateStep[3].eraseWorkflowForm();
		},

		/**
		 * @override
		 */
		onModifyButtonClick: function() {
			this.callParent(arguments);

			if (!this.delegateStep[3].checkWorkflowComboSelected())
				this.delegateStep[3].setDisabledWorkflowAttributesGrid(true);
		},

		/**
		 * @override
		 */
		onRowSelected: function() {
			if (this.selectionModel.hasSelection()) {
				this.selectedId = this.selectionModel.getSelection()[0].get(CMDBuild.core.proxy.CMProxyConstants.ID);

				// Selected task asynchronous store query
				this.selectedDataStore = CMDBuild.core.proxy.CMProxyTasks.get(this.taskType);
				this.selectedDataStore.load({
					scope: this,
					params: {
						id: this.selectedId
					},
					callback: function(records, operation, success) {
						if (!Ext.isEmpty(records)) {
							var record = records[0];

							this.parentDelegate.loadForm(this.taskType);

							// HOPING FOR A FIX: loadRecord() fails with comboboxes, and i can't find a working fix, so i must set all fields manually

							// Set step1 [0] datas
							this.delegateStep[0].setValueActive(record.get(CMDBuild.core.proxy.CMProxyConstants.ACTIVE));
							this.delegateStep[0].setValueDescription(record.get(CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION));
							this.delegateStep[0].setValueEmailAccount(record.get(CMDBuild.core.proxy.CMProxyConstants.EMAIL_ACCOUNT));
							this.delegateStep[0].setValueFilterFromAddress(
								this.delegateStep[0].getFromAddressFilterDelegate().filterStringBuild(
									record.get(CMDBuild.core.proxy.CMProxyConstants.FILTER_FROM_ADDRESS)
								)
							);
							this.delegateStep[0].setValueFilterSubject(
								this.delegateStep[0].getSubjectFilterDelegate().filterStringBuild(
									record.get(CMDBuild.core.proxy.CMProxyConstants.FILTER_SUBJECT)
								)
							);
							this.delegateStep[0].setValueId(record.get(CMDBuild.core.proxy.CMProxyConstants.ID));
							this.delegateStep[0].setValueIncomingFolder(record.get(CMDBuild.core.proxy.CMProxyConstants.INCOMING_FOLDER));
							this.delegateStep[0].setValueProcessedFolder(record.get(CMDBuild.core.proxy.CMProxyConstants.PROCESSED_FOLDER));
							this.delegateStep[0].setValueRejectedFieldsetCheckbox(record.get(CMDBuild.core.proxy.CMProxyConstants.REJECT_NOT_MATCHING));
							this.delegateStep[0].setValueRejectedFolder(record.get(CMDBuild.core.proxy.CMProxyConstants.REJECTED_FOLDER));

							// Set step2 [1] datas
							this.delegateStep[1].setValueAdvancedFields(record.get(CMDBuild.core.proxy.CMProxyConstants.CRON_EXPRESSION));
							this.delegateStep[1].setValueBase(record.get(CMDBuild.core.proxy.CMProxyConstants.CRON_EXPRESSION));

							// Set step3 [2] datas
							this.delegateStep[2].setValueAttachmentsFieldsetCheckbox(record.get(CMDBuild.core.proxy.CMProxyConstants.ATTACHMENTS_ACTIVE));
							this.delegateStep[2].setValueAttachmentsCombo(record.get(CMDBuild.core.proxy.CMProxyConstants.ATTACHMENTS_CATEGORY));
							this.delegateStep[2].setValueNotificationFieldsetCheckbox(record.get(CMDBuild.core.proxy.CMProxyConstants.NOTIFICATION_ACTIVE));
							this.delegateStep[2].setValueNotificationTemplate(record.get(CMDBuild.core.proxy.CMProxyConstants.NOTIFICATION_EMAIL_TEMPLATE));
							this.delegateStep[2].setValueParsingFieldsetCheckbox(record.get(CMDBuild.core.proxy.CMProxyConstants.PARSING_ACTIVE));
							this.delegateStep[2].setValueParsingFields(
								record.get(CMDBuild.core.proxy.CMProxyConstants.PARSING_KEY_INIT),
								record.get(CMDBuild.core.proxy.CMProxyConstants.PARSING_KEY_END),
								record.get(CMDBuild.core.proxy.CMProxyConstants.PARSING_VALUE_INIT),
								record.get(CMDBuild.core.proxy.CMProxyConstants.PARSING_VALUE_END)
							);

							// Set step4 [3] datas
							this.delegateStep[3].setValueWorkflowAttributesGrid(record.get(CMDBuild.core.proxy.CMProxyConstants.WORKFLOW_ATTRIBUTES));
							this.delegateStep[3].setValueWorkflowCombo(record.get(CMDBuild.core.proxy.CMProxyConstants.WORKFLOW_CLASS_NAME));
							this.delegateStep[3].setValueWorkflowFieldsetCheckbox(record.get(CMDBuild.core.proxy.CMProxyConstants.WORKFLOW_ACTIVE));

							this.view.disableModify(true);
						}
					}
				});

				this.parentDelegate.changeItem(0);
			}
		},

		/**
		 * @override
		 */
		onSaveButtonClick: function() {
			var formData = this.view.getData(true);
			var submitDatas = {};

			// Validate before save
			if (this.validate(formData[CMDBuild.core.proxy.CMProxyConstants.ACTIVE])) {
				CMDBuild.LoadMask.get().show();

				submitDatas[CMDBuild.core.proxy.CMProxyConstants.CRON_EXPRESSION] = this.delegateStep[1].getCronDelegate().getValue();

				// Form submit values formatting
					if (!Ext.isEmpty(formData.filterFromAddress))
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.FILTER_FROM_ADDRESS] = Ext.encode(
							formData[CMDBuild.core.proxy.CMProxyConstants.FILTER_FROM_ADDRESS].split(
								this.delegateStep[0].getFromAddressFilterDelegate().getTextareaConcatParameter()
							)
						);

					if (!Ext.isEmpty(formData.filterSubject))
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.FILTER_SUBJECT] = Ext.encode(
							formData[CMDBuild.core.proxy.CMProxyConstants.FILTER_SUBJECT].split(
								this.delegateStep[0].getSubjectFilterDelegate().getTextareaConcatParameter()
							)
						);

				// Fieldset submitting filter to avoid to send datas if fieldset are collapsed
					var rejectedFieldsetCheckboxValue = this.delegateStep[0].getValueRejectedFieldsetCheckbox();
					if (rejectedFieldsetCheckboxValue) {
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.REJECT_NOT_MATCHING] = rejectedFieldsetCheckboxValue;
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.REJECTED_FOLDER] = formData[CMDBuild.core.proxy.CMProxyConstants.REJECTED_FOLDER];
					}

					var attachmentsFieldsetCheckboxValue = this.delegateStep[2].getValueAttachmentsFieldsetCheckbox();
					if (attachmentsFieldsetCheckboxValue) {
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.ATTACHMENTS_ACTIVE] = attachmentsFieldsetCheckboxValue;
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.ATTACHMENTS_CATEGORY] = formData[CMDBuild.core.proxy.CMProxyConstants.ATTACHMENTS_CATEGORY];
					}

					var notificationFieldsetCheckboxValue = this.delegateStep[2].getValueNotificationFieldsetCheckbox();
					if (notificationFieldsetCheckboxValue) {
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.NOTIFICATION_ACTIVE] = notificationFieldsetCheckboxValue;
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.NOTIFICATION_EMAIL_TEMPLATE] = formData[CMDBuild.core.proxy.CMProxyConstants.NOTIFICATION_EMAIL_TEMPLATE];
					}

					var parsingFieldsetCheckboxValue = this.delegateStep[2].getValueParsingFieldsetCheckbox();
					if (parsingFieldsetCheckboxValue) {
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.PARSING_ACTIVE] = parsingFieldsetCheckboxValue;
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.PARSING_KEY_END] = formData[CMDBuild.core.proxy.CMProxyConstants.PARSING_KEY_END];
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.PARSING_KEY_INIT] = formData[CMDBuild.core.proxy.CMProxyConstants.PARSING_KEY_INIT];
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.PARSING_VALUE_END] = formData[CMDBuild.core.proxy.CMProxyConstants.PARSING_VALUE_END];
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.PARSING_VALUE_INIT] = formData[CMDBuild.core.proxy.CMProxyConstants.PARSING_VALUE_INIT];
					}

					var workflowFieldsetCheckboxValue = this.delegateStep[3].getValueWorkflowFieldsetCheckbox();
					if (workflowFieldsetCheckboxValue) {
						var attributesGridValues = this.delegateStep[3].getValueWorkflowAttributeGrid();

						if (!Ext.Object.isEmpty(attributesGridValues))
							submitDatas[CMDBuild.core.proxy.CMProxyConstants.WORKFLOW_ATTRIBUTES] = Ext.encode(attributesGridValues);

						submitDatas[CMDBuild.core.proxy.CMProxyConstants.WORKFLOW_ACTIVE] = workflowFieldsetCheckboxValue;
						submitDatas[CMDBuild.core.proxy.CMProxyConstants.WORKFLOW_CLASS_NAME] = formData[CMDBuild.core.proxy.CMProxyConstants.WORKFLOW_CLASS_NAME];
					}

				// Data filtering to submit only right values
				submitDatas[CMDBuild.core.proxy.CMProxyConstants.ACTIVE] = formData[CMDBuild.core.proxy.CMProxyConstants.ACTIVE];
				submitDatas[CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION] = formData[CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION];
				submitDatas[CMDBuild.core.proxy.CMProxyConstants.EMAIL_ACCOUNT] = formData[CMDBuild.core.proxy.CMProxyConstants.EMAIL_ACCOUNT];
				submitDatas[CMDBuild.core.proxy.CMProxyConstants.ID] = formData[CMDBuild.core.proxy.CMProxyConstants.ID];
				submitDatas[CMDBuild.core.proxy.CMProxyConstants.INCOMING_FOLDER] = formData[CMDBuild.core.proxy.CMProxyConstants.INCOMING_FOLDER];
				submitDatas[CMDBuild.core.proxy.CMProxyConstants.PROCESSED_FOLDER] = formData[CMDBuild.core.proxy.CMProxyConstants.PROCESSED_FOLDER];

				if (Ext.isEmpty(formData[CMDBuild.core.proxy.CMProxyConstants.ID])) {
					CMDBuild.core.proxy.CMProxyTasks.create({
						type: this.taskType,
						params: submitDatas,
						scope: this,
						success: this.success,
						callback: this.callback
					});
				} else {
					CMDBuild.core.proxy.CMProxyTasks.update({
						type: this.taskType,
						params: submitDatas,
						scope: this,
						success: this.success,
						callback: this.callback
					});
				}
			}
		},

		/**
		 * Task validation
		 *
		 * @param {Boolean} enable
		 *
		 * @return {Boolean}
		 *
		 * @override
		 */
		validate: function(enable) {
			// Email account and forlders validation
			this.delegateStep[0].setAllowBlankEmailAccountCombo(!enable);
			this.delegateStep[0].setAllowBlankIncomingFolder(!enable);
			this.delegateStep[0].setAllowBlankProcessedFolder(!enable);

			// Rejected folder validation
			this.delegateStep[0].setAllowBlankRejectedFolder(!this.delegateStep[0].getValueRejectedFieldsetCheckbox());

			// Cron field validation
			this.delegateStep[1].getCronDelegate().validate(enable);

			// Parsing validation
			if (this.delegateStep[2].getValueParsingFieldsetCheckbox() && enable) {
				this.delegateStep[2].setAllowBlankParsingFields(false);
			} else {
				this.delegateStep[2].setAllowBlankParsingFields(true);
			}

			// Notification validation
			this.delegateStep[2].getNotificationDelegate().validate(
				this.delegateStep[2].getValueNotificationFieldsetCheckbox()
				&& enable
			);

			// Attachments validation
			if (this.delegateStep[2].getValueAttachmentsFieldsetCheckbox() && enable) {
				this.delegateStep[2].setAllowBlankAttachmentsField(false);
			} else {
				this.delegateStep[2].setAllowBlankAttachmentsField(true);
			}

			// Workflow form validation
			this.delegateStep[3].getWorkflowDelegate().validate(
				this.delegateStep[3].getValueWorkflowFieldsetCheckbox()
				&& enable
			);

			return this.callParent(arguments);
		}
	});

})();
