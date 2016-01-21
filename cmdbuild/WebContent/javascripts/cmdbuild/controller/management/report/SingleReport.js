(function() {

	Ext.define('CMDBuild.controller.management.report.SingleReport', {
		extend: 'CMDBuild.controller.common.AbstractBasePanelController',

		requires: [
			'CMDBuild.core.Message',
			'CMDBuild.core.proxy.CMProxyConstants',
			'CMDBuild.core.proxy.CMProxyUrlIndex',
			'CMDBuild.core.proxy.Report'
		],

		/**
		 * @cfg {Array}
		 */
		cmfgCatchedFunctions: [
			'currentReportParametersSet',
			'onReportDownloadButtonClick',
			'onReportTypeButtonClick',
			'updateReport'
		],

		/**
		 * All server calls parameters
		 *
		 * @property {Object}
		 *
		 * Ex. {
		 * 		{Object} create, create call parameters
		 * 		{Object} update update call parameters
		 * }
		 *
		 * @private
		 */
		currentReportParameters: {},

		/**
		 * @cfg {Array}
		 */
		managedCurrentReportParametersCallIdentifiers: ['create', 'update'],

		/**
		 * @cfg {Array}
		 */
		managedReportTypes: [
			CMDBuild.core.proxy.CMProxyConstants.CSV,
			CMDBuild.core.proxy.CMProxyConstants.ODT,
			CMDBuild.core.proxy.CMProxyConstants.PDF,
			CMDBuild.core.proxy.CMProxyConstants.RTF
		],

		/**
		 * @cfg {CMDBuild.view.management.report.SingleReportPanel}
		 */
		view: undefined,

		/**
		 * @param {Boolean} forceDownload
		 */
		createReport: function(forceDownload) {
			forceDownload = forceDownload || false;

			if (!Ext.isEmpty(this.currentReportParametersGet('create', CMDBuild.core.proxy.CMProxyConstants.ID))) {
				CMDBuild.core.proxy.Report.createReport({
					scope: this,
					params: this.currentReportParametersGet('create'),
					failure: function(response, options, decodedResponse) {
						CMDBuild.core.Message.error(
							CMDBuild.Translation.error,
							CMDBuild.Translation.errors.createReportFilure,
							false
						);
					},
					success: function(response, options, decodedResponse) {
						if(decodedResponse.filled) { // Report with no parameters
							this.showReport(forceDownload);
						} else { // Show parameters window
							// FIX: in IE PDF is painted on top of the regular page content so remove it before display parameter window
							// Workaround to detect IE 11 witch is not supported from Ext 4.2
							if (Ext.isIE || !!navigator.userAgent.match(/Trident.*rv[ :]*11\./))
								this.view.removeAll();

							if (this.currentReportParametersIsEmpty('update')) {
								Ext.create('CMDBuild.controller.management.report.Parameters', {
									parentDelegate: this,
									attributeList: decodedResponse.attribute,
									forceDownload: forceDownload
								});
							} else {
								this.updateReport(forceDownload);
							}
						}
					}
				});
			}
		},

		// CurrentReportParameters methods
			/**
			 * @param {String} callIdentifier
			 * @param {String} property
			 *
			 * @returns {Object}
			 */
			currentReportParametersGet: function(callIdentifier, property) {
				if (
					!Ext.isEmpty(callIdentifier)
					&& Ext.isString(callIdentifier)
					&& Ext.Array.contains(this.managedCurrentReportParametersCallIdentifiers, callIdentifier)
				) {
					if (!Ext.isEmpty(property) && Ext.isString(property) && !Ext.isEmpty(this.currentReportParameters[callIdentifier]))
						return this.currentReportParameters[callIdentifier][property];

					return this.currentReportParameters[callIdentifier];
				}

				return this.currentReportParameters;
			},

			/**
			 * @param {String} callIdentifier
			 *
			 * @returns {Boolean}
			 */
			currentReportParametersIsEmpty: function(callIdentifier) {
				if (
					!Ext.isEmpty(callIdentifier)
					&& Ext.isString(callIdentifier)
					&& Ext.Array.contains(this.managedCurrentReportParametersCallIdentifiers, callIdentifier)
				) {
					return Ext.isEmpty(this.currentReportParametersGet(callIdentifier));
				}

				return Ext.isEmpty(this.currentReportParametersGet());
			},

			/**
			 * @param {Object} parameters
			 * @param {Object} parameters.params
			 * @param {String} parameters.callIdentifier - managed identifiers (create, update)
			 */
			currentReportParametersSet: function(parameters) {
				if (!Ext.isEmpty(parameters) && Ext.isObject(parameters)) {
					var params = parameters.params || null;
					var callIdentifier = parameters.callIdentifier || null;

					switch(callIdentifier) {
						case 'create': {
							this.currentReportParameters['create'] = Ext.applyIf(params, { // Apply default values
								extension: CMDBuild.core.proxy.CMProxyConstants.PDF,
								type: 'CUSTOM'
							});
						} break;

						case 'update': {
							this.currentReportParameters['update'] = params;
						} break;

						default: {
							_error('unsupported report parameter call identifier', this);
						}
					}
				} else {
					this.currentReportParameters = {};
				}
			},

		/**
		 * Show report with force download
		 */
		onReportDownloadButtonClick: function() {
			this.showReport(true);
		},

		/**
		 * @param {String} type
		 */
		onReportTypeButtonClick: function(type) {
			if (Ext.Array.contains(this.managedReportTypes, type)) {
				this.currentReportParametersSet({
					callIdentifier: 'create',
					params: {
						extension: type,
						id: this.currentReportParametersGet('create', CMDBuild.core.proxy.CMProxyConstants.ID)
					}
				});

				this.createReport();
			} else {
				CMDBuild.core.Message.error(
					CMDBuild.Translation.error,
					CMDBuild.Translation.errors.unmanagedReportType,
					false
				);
			}
		},

		/**
		 * @param {CMDBuild.view.common.CMAccordionStoreModel} node
		 */
		onViewOnFront: function(node) {
			this.currentReportParametersSet(); // Reset class property

			if (
				!Ext.Object.isEmpty(node)
				&& !Ext.isEmpty(node.get(CMDBuild.core.proxy.CMProxyConstants.ID))
				&& node.get(CMDBuild.core.proxy.CMProxyConstants.ID) != CMDBuild.core.proxy.CMProxyConstants.CUSTOM
			) {
				this.view.setTitle(this.view.sectionTitle + ' - ' + node.get(CMDBuild.core.proxy.CMProxyConstants.TEXT));

				this.currentReportParametersSet({
					callIdentifier: 'create',
					params: {
						extension: node.get(CMDBuild.core.proxy.CMProxyConstants.TYPE).replace(/report/i, ''), // Removes 'report' string from type property in node object
						id: node.get(CMDBuild.core.proxy.CMProxyConstants.ID)
					}
				});

				this.createReport();

				this.callParent(arguments);
			}
		},

		/**
		 * Get created report from server and display it in iframe
		 *
		 * @param {Boolean} forceDownload
		 */
		showReport: function(forceDownload) {
			forceDownload = forceDownload || false;

			var params = {};
			params[CMDBuild.core.proxy.CMProxyConstants.FORCE_DOWNLOAD_PARAM_KEY] = true;

			if (forceDownload) { // Force download mode
				var form = Ext.create('Ext.form.Panel', {
					standardSubmit: true,
					url: CMDBuild.core.proxy.CMProxyUrlIndex.reports.printReportFactory + '?donotdelete=true' // Add parameter to avoid report delete
				});

				form.submit({
					target: '_blank',
					params: params
				});

				Ext.defer(function() { // Form cleanup
					form.close();
				}, 100);
			} else { // Add to view display mode
				this.view.removeAll();

				this.view.add({
					xtype: 'component',

					autoEl: {
						tag: 'iframe',
						src: CMDBuild.core.proxy.CMProxyUrlIndex.reports.printReportFactory + '?donotdelete=true' // Add parameter to avoid report delete
					}
				});
			}
		},

		/**
		 * @param {Boolean} forceDownload
		 */
		updateReport: function(forceDownload) {
			if (!this.currentReportParametersIsEmpty('update')) {
				CMDBuild.core.proxy.Report.updateReport({
					params: this.currentReportParametersGet('update'),
					scope: this,
					success: function(response, options, decodedResponse) {
						this.showReport(forceDownload);
					}
				});
			}
		}
	});

})();