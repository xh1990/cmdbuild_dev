(function() {

	/**
	 * Core, wrap the form submission and the Ajax requests
	 */
	Ext.define('CMDBuild.core.proxy.CMProxy', {
		alternateClassName: 'CMDBuild.ServiceProxy.core', // Legacy class name

		singleton: true,

		/**
		 * @param {Object} parameters
		 */
		doLogin: function(parameters) {
			CMDBuild.Ajax.request({
				method: 'POST',
				scope: parameters.scope || this,
				important: true,
				url: CMDBuild.core.proxy.CMProxyUrlIndex.login,
				params: parameters.params,
				success: parameters.success || Ext.emptyFn,
				failure: parameters.failure || Ext.emptyFn,
				callback: parameters.callback || Ext.emptyFn
			});
		},

		/**
		 * @param {Object} parameters
		 */
		doRequest: function(parameters) {
			var successWithAdapter = Ext.Function.createInterceptor(parameters.success || Ext.emptyFn, function(response) {
				if (parameters.adapter) {
					var json =  Ext.JSON.decode(response.responseText);
					var adaptedJson = parameters.adapter(json);
					_debug("Adapted JSON result", json, adaptedJson);
					response.responseText = Ext.JSON.encode(adaptedJson);
				}
			});

			CMDBuild.Ajax.request({
				timeout: parameters.timeout,
				url: parameters.url,
				method: parameters.method,
				params: parameters.params || {},
				scope: parameters.scope || this,
				success: successWithAdapter,
				failure: parameters.failure || Ext.emptyFn,
				callback: parameters.callback || Ext.emptyFn,
				important: parameters.important
			});
		},

		/**
		 * @param {Object} parameters
		 */
		submitForm: function(parameters) {
			if (parameters.form) {
				parameters.form.submit({
					url: parameters.url,
					method: parameters.mothod,
					scope: parameters.scope || this,
					success: parameters.success || Ext.emptyFn,
					failure: parameters.failure || Ext.emptyFn,
					callback: parameters.callback || Ext.emptyFn
				});
			} else {
				throw CMDBuild.core.error.serviceProxy.NO_FORM;
			}
		}
	});

	/* ===========================================
	 * Orphans
	 =========================================== */
	CMDBuild.ServiceProxy.getCardBasicInfoList = function(className, success, cb, scope) {
		CMDBuild.ServiceProxy.core.doRequest({
			method: 'GET',
			url: CMDBuild.ServiceProxy.url.basicCardList,
			params: {
				ClassName: className,
				NoFilter: true
			},
			success: success,
			callback: cb,
			scope: scope
		});
	};

	/**
	 * @param {object} p
	 * @param {object} p.params
	 * @param {string} p.params.className
	 */
	CMDBuild.ServiceProxy.getFKTargetingClass = function(p) {
		p.url = CMDBuild.ServiceProxy.url.fkTargetClass;
		p.method = 'GET';
		CMDBuild.Ajax.request(p);
	};

	// Alias
	_CMProxy = CMDBuild.ServiceProxy;

})();