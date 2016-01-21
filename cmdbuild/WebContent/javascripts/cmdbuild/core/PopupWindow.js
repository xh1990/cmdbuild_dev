(function() {

	/**
	 * Reads the size in percentage in the configuration file and create a modal popup-window
	 */
	Ext.define('CMDBuild.core.PopupWindow', {
		alternateClassName: 'CMDBuild.PopupWindow', // Legacy class name
		extend: 'Ext.window.Window',

		/**
		 * @cfg {Boolean}
		 */
		autoHeight: false,

		/**
		 * @cfg {Boolean}
		 */
		autoWidth: false,

		/**
		 * @cfg {Number}
		 */
		defaultSize: 0.80,

		buttonAlign: 'center',
		constrain: true,
		layout: 'fit',
		modal: true,
		resizable: true,

		initComponent: function() {
			if (!this.autoHeight) {
				var percentualHeight;
				var configHeight = CMDBuild.Config.cmdbuild.popuppercentageheight;

				if (configHeight) {
					percentualHeight = configHeight/100;
				} else {
					percentualHeight = this.defaultSize;
				}

				this.height = Ext.getBody().getHeight() * percentualHeight;
			}

			if (!this.autoWidth) {
				var percentualWidth;
				var configWidth = CMDBuild.Config.cmdbuild.popuppercentagewidth;

				if (configWidth) {
					percentualWidth = configWidth/100;
				} else {
					percentualWidth = this.defaultSize;
				}

				this.width = Ext.getBody().getWidth() * percentualWidth;
			}

			this.callParent(arguments);
		}
	});

})();