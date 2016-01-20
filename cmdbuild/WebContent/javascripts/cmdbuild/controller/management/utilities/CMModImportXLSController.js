(function() {
	var tr = CMDBuild.Translation.management.modutilities.xls;
	Ext.define("CMDBuild.controller.management.utilities.CMModImportXLSController", {
		extend: "CMDBuild.controller.CMBasePanelController",
		
		constructor: function() {
			this.callParent(arguments);

			this.view.form.uploadButton.on("click", onUploadButtonClick, this);
			this.view.form.classList.on("select", onClassListSelect, this);
			this.view.updateButton.on("click", onUpdateButtonClick, this);
			this.view.abortButton.on("click", onAbortButtonClick, this);
		},

		onViewOnFront: function() {}
	});

	function onClassListSelect(combo, selections) {
		if (selections.length > 0) {
			this.currentClass = selections[0].get("id");
			this.view.grid.updateStoreForClassId(this.currentClass);
		}
	}

	function onUploadButtonClick() {
		CMDBuild.LoadMask.get().show();
		this.view.form.getForm().submit({
			method: 'POST',
			url : 'services/json/management/importxls/uploadxls',
			scope: this,
			success: updateGridRecords,
			failure: function() {
				CMDBuild.LoadMask.get().hide();
			}
		});
	}

	function onUpdateButtonClick() {
		var records = this.view.grid.getRecordToUpload();
		if (records.length == 0) {
			CMDBuild.Msg.warn(tr.warning, tr.noupdate);
		} else {
			CMDBuild.LoadMask.get().show();
			CMDBuild.Ajax.request({
				method : 'POST',
				url : 'services/json/management/importxls/updatexlsrecords',
				scope : this,
				success : batchUpdateSuccess,
				failure: function() {
					CMDBuild.LoadMask.get().hide();
					alert('Update failure');
				}
			});
		}
	}
	
	function batchUpdateSuccess() {
		this.view.form.reset();
		this.view.grid.removeAll();
		CMDBuild.LoadMask.get().hide();
		alert('Update success');
	}

	function onAbortButtonClick() {
		this.view.form.reset();
		this.view.grid.removeAll();
	}

	// callback called after the upload of the xls file
	// and after the update of the grid records
	function updateGridRecords() {
		CMDBuild.Ajax.request({
			method: 'GET',
			url : 'services/json/management/importxls/getxlsrecords',
			scope: this,
			success: function(a,b,c) {
				this.view.grid.configureHeadersAndStore(c.headers);
				this.view.grid.loadData(c.rows);
			},
			callback: function() {
				CMDBuild.LoadMask.get().hide();
			}
		});
	}

})();