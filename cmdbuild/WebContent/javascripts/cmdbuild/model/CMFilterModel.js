(function() {

	Ext.define('CMDBuild.model.CMFilterModel', {
		extend: 'Ext.data.Model',

		requires: ['CMDBuild.core.proxy.CMProxyConstants'],

		fields: [
			{ name: CMDBuild.core.proxy.CMProxyConstants.ID, type: 'string' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.NAME, type: 'string' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION, type: 'string' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.CONFIGURATION, type: 'auto' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.ENTRY_TYPE, type: 'string' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.TEMPLATE, type: 'boolean' },
			{ name: CMDBuild.core.proxy.CMProxyConstants.APPLIED, type: 'boolean', persist: false }, // To know if this filter is currently applied
			{ name: CMDBuild.core.proxy.CMProxyConstants.LOCAL, type: 'boolean', persist: false } // To know if the filter is created client side, and is not sync with the server
		],

		/**
		 * Return a full copy of this filter
		 *
		 * @returns {CMDBuild.model.CMFilterModel}
		 *
		 * @override
		 */
		copy: function() {
			var dolly = new CMDBuild.model.CMFilterModel();
			dolly.set(CMDBuild.core.proxy.CMProxyConstants.ID, this.get(CMDBuild.core.proxy.CMProxyConstants.ID));
			dolly.setName(this.getName());
			dolly.setDescription(this.getDescription());
			dolly.setConfiguration(Ext.apply({}, this.getConfiguration()));
			dolly.setEntryType(this.getEntryType());
			dolly.setApplied(this.isApplied());
			dolly.setLocal(this.isLocal());
			dolly.setTemplate(this.isTemplate());

			dolly.commit();

			if (this.dirty)
				dolly.setDirty();

			return dolly;
		},

		// Getter and setter
		getName: function() {
			return this.get(CMDBuild.core.proxy.CMProxyConstants.NAME) || '';
		},

		setName: function(name) {
			this.set(CMDBuild.core.proxy.CMProxyConstants.NAME, name);
		},

		getDescription: function() {
			return this.get(CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION) || '';
		},

		setDescription: function(description) {
			this.set(CMDBuild.core.proxy.CMProxyConstants.DESCRIPTION, description);
		},

		getConfiguration: function() {
			return this.get(CMDBuild.core.proxy.CMProxyConstants.CONFIGURATION) || {};
		},

		/**
		 * @param {Array} runtimeParameterFields
		 * 	{
		 * 		{Ext.form.field} fieldObj,
		 * 		...
		 * 	}
		 */
		getConfigurationMergedWithRuntimeAttributes: function(runtimeParameterFields) {
			runtimeParameterFields = runtimeParameterFields || [];

			var configuration = Ext.clone(this.getConfiguration());

			configuration.attribute = mergeRuntimeParametersToConf(configuration.attribute, runtimeParameterFields);

			return configuration;
		},

		setConfiguration: function(configuration) {
			this.set(CMDBuild.core.proxy.CMProxyConstants.CONFIGURATION, configuration);
		},

		getAttributeConfiguration: function() {
			var c = this.getConfiguration();
			var attributeConf = c.attribute || {};

			return attributeConf;
		},

		setAttributeConfiguration: function(conf) {
			var configuration = this.getConfiguration();

			delete configuration.attribute;

			if (Ext.isObject(conf) && Ext.Object.getKeys(conf).length > 0) {
				configuration.attribute = conf;
				this.set(CMDBuild.core.proxy.CMProxyConstants.CONFIGURATION, configuration);
			}
		},

		getRuntimeParameters: function() {
			var runtimeParameters = [];
			var attributeConf = this.getAttributeConfiguration();

			return addRuntimeParameterToList(attributeConf, runtimeParameters);
		},

		getCalculatedParameters: function() {
			var calculatedParameters = [];
			var attributeConf = this.getAttributeConfiguration();

			return addCalculatedParameterToList(attributeConf, calculatedParameters);
		},

		getRelationConfiguration: function() {
			var configuration = this.getConfiguration();
			var relationConfiguration = configuration.relation || [];

			return relationConfiguration;
		},

		setRelationConfiguration: function(conf) {
			var configuration = this.getConfiguration();

			delete configuration.relation;

			if (Ext.isArray(conf) && conf.length > 0) {
				configuration.relation = conf;
				this.set(CMDBuild.core.proxy.CMProxyConstants.CONFIGURATION, configuration);
			}
		},

		getFunctionConfiguration: function() {
			var c = this.getConfiguration();
			var attributeConf = c.functions || [];

			return attributeConf;
		},

		setFunctionConfiguration: function(functions) {
			var configuration = this.getConfiguration();

			if (functions.length > 0) {
				configuration.functions = functions;
			} else {
				delete configuration.functions;
			}

			this.set(CMDBuild.core.proxy.CMProxyConstants.CONFIGURATION, configuration);
		},

		getEntryType: function() {
			return this.get(CMDBuild.core.proxy.CMProxyConstants.ENTRY_TYPE) || '';
		},

		setEntryType: function(entryType) {
			this.set(CMDBuild.core.proxy.CMProxyConstants.ENTRY_TYPE, entryType);
		},

		isTemplate: function() {
			return this.get(CMDBuild.core.proxy.CMProxyConstants.TEMPLATE) || false;
		},

		setTemplate: function(applied) {
			this.set(CMDBuild.core.proxy.CMProxyConstants.TEMPLATE, applied);
		},

		isApplied: function() {
			return this.get(CMDBuild.core.proxy.CMProxyConstants.APPLIED) || false;
		},

		setApplied: function(applied) {
			this.set(CMDBuild.core.proxy.CMProxyConstants.APPLIED, applied);
		},

		isLocal: function() {
			return this.get(CMDBuild.core.proxy.CMProxyConstants.LOCAL) || false;
		},

		setLocal: function(local) {
			this.set(CMDBuild.core.proxy.CMProxyConstants.LOCAL, local);
		}
	});

	function addRuntimeParameterToList(attributeConf, runtimeParameters) {
		if (Ext.isObject(attributeConf.simple)) {
			var conf = attributeConf.simple;

			if (conf.parameterType == "runtime")
				runtimeParameters.push(conf);

		} else if (Ext.isArray(attributeConf.and) || Ext.isArray(attributeConf.or)) {
			var attributes = attributeConf.and || attributeConf.or;


			for (var i = 0; i < attributes.length; ++i)
				addRuntimeParameterToList(attributes[i], runtimeParameters);
		}

		return runtimeParameters;
	}

	function addCalculatedParameterToList(attributeConf, calculatedParameters) {
		if (Ext.isObject(attributeConf.simple)) {
			var conf = attributeConf.simple;

			if (conf.parameterType == "calculated")
				calculatedParameters.push(conf);
		} else if (Ext.isArray(attributeConf.and) || Ext.isArray(attributeConf.or)) {
			var attributes = attributeConf.and || attributeConf.or;


			for (var i = 0; i < attributes.length; ++i)
				addCalculatedParameterToList(attributes[i], calculatedParameters);
		}

		return calculatedParameters;
	}

	var calculatedValuesMapping = {};
	calculatedValuesMapping["@MY_USER"] = function() {
		return CMDBuild.Runtime.UserId;
	};

	calculatedValuesMapping["@MY_GROUP"] = function() {
		return CMDBuild.Runtime.DefaultGroupId;
	};

	/**
	 * @param {Onject} attributeConfiguration - filterObject
	 * @param {Array} runtimeParameterFields
	 * 	{
	 * 		{Ext.form.field} fieldObj,
	 * 		...
	 * 	}
	 */
	function mergeRuntimeParametersToConf(attributeConfiguration, runtimeParameterFields) {
		var attributeConf = Ext.clone(attributeConfiguration);

		if (attributeConf) {
			if (Ext.isObject(attributeConf.simple)) {
				var conf = attributeConf.simple;

				if (conf.parameterType == "runtime") {

					// Find field index
					for(var i = 0; i < runtimeParameterFields.length; i++)
						if (runtimeParameterFields[i].name == conf.attribute)
							fieldIndex = i;

					var field = runtimeParameterFields[fieldIndex];
					var value = [field.getValue()];

					if (field._cmSecondField)
						value.push(field._cmSecondField.getValue());

					conf.value = value;
				} else if (conf.parameterType == "calculated") {
					var value = conf.value[0];

					if (typeof calculatedValuesMapping[value] == "function")
						conf.value = [calculatedValuesMapping[value]()];
				}

			} else if (Ext.isArray(attributeConf.and) || Ext.isArray(attributeConf.or)) {
				var attributes = attributeConf.and || attributeConf.or;


				for (var i = 0; i < attributes.length; ++i)
					attributes[i] = mergeRuntimeParametersToConf(attributes[i], runtimeParameterFields);
			}

			return attributeConf;
		}

		return;
	}

})();