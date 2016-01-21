(function() {

	Ext.define('CMDBuild.override.form.field.FixComboBox', {
		override: 'Ext.form.field.ComboBox',

		/**
		 * To fix problem that don't set combo value if forceSelection is true - 21/05/2014
		 */
		setValue: function(value, doSelect) {
			var forceSelectionState = this.forceSelection;

			if (forceSelectionState)
				this.forceSelection = false;

			var comboboxField = this.callParent(arguments);

			if (forceSelectionState)
				this.forceSelection = true;

			return comboboxField;
		}
	});

})();