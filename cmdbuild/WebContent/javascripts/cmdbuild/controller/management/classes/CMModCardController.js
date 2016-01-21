(function() {

	Ext.define('CMDBuild.controller.management.common.CMModController', {
		extend: 'CMDBuild.controller.CMBasePanelController',

		mixins: {
			commonFunctions: 'CMDBuild.controller.management.common.CMModClassAndWFCommons',
			observable: 'Ext.util.Observable'
		},

		constructor: function() {
			this.callParent(arguments);
			this.buildSubControllers();
		},

		onViewOnFront: function(entryType) {
			if (entryType) {
				var currentEntryType = _CMCardModuleState.entryType;
				var newEntryId = entryType.get('id');
				var filter = entryType.get(_CMProxy.parameter.FILTER);
				var dc = _CMMainViewportController.getDanglingCard();
				var entryIdChanged = currentEntryType ? (currentEntryType.get('id') != newEntryId) : true;

				// if there is a danglingCard do the same things that happen
				// when select a new entryType, the cardGridController is able to
				// manage the dc and open it.
//				if (entryIdChanged || dc || filter) {
					this.setEntryType(newEntryId, dc, filter);
//				}
			}
		},

		onCardSelected: function onCardSelected(card) {
			this.setCard(card);
		},

		setEntryType: function(entryTypeId, dc, filter) {
			this.entryType = _CMCache.getEntryTypeById(entryTypeId);
			this.setCard(null);
			this.callForSubControllers('onEntryTypeSelected', [this.entryType, dc, filter]);

			if (dc != null) {
				if (dc.activateFirstTab) {
					this.view.activateFirstTab();
				}
			}
		},

		getEntryType: function() {
			return this.entryType || null;
		},

		getEntryTypeId: function() {
			var id = null;
			if (this.entryType) {
				id = this.entryType.get('id');
			}

			return id;
		},

		setCard: function(card) {
			this.card = card;
			this.onCardChanged(card);
		},

		getCard: function() {
			return this.card;
		},

		// private, called from setCard. Implement different
		// behaviours in subclasses
		onCardChanged: function(card) {
			this.callForSubControllers('onCardSelected', this.card);
		},

		// private, call a given function for all the subcontrolles, and
		// pass the arguments to them.
		callForSubControllers: function(fnName, params) {
			for (var i=0, l = this.subControllers.length, ct=null; i<l; ++i) {
				ct = this.subControllers[i];
				if (typeof fnName == 'string'
					&& typeof ct[fnName] == 'function') {

					params = Ext.isArray(params) ? params : [params];
					ct[fnName].apply(ct, params);
				}
			}
		},

		/**
		 * @abstract
		 */
		buildSubControllers: Ext.emptyFn
	});

	Ext.define('CMDBuild.controller.management.classes.CMModCardController', {
		extend: 'CMDBuild.controller.management.common.CMModController',

		/**
		 * @property {CMDBuild.controller.management.classes.attachments.CMCardAttachmentsController}
		 */
		attachmentsController: undefined,

		/**
		 * @property {Ext.data.Model}
		 */
		card: undefined,

		/**
		 * @property {CMDBuild.controller.management.classes.CMCardPanelController}
		 */
		cardPanelController: undefined,

		/**
		 * @property {CMDBuild.controller.management.classes.tabs.Email}
		 */
		controllerTabEmail: undefined,

		/**
		 * @property {CMDBuild.controller.management.classes.tabs.History}
		 */
		controllerTabHistory: undefined,

		/**
		 * @property {CMDBuild.controller.management.classes.masterDetails.CMMasterDetailsController}
		 */
		mdController: undefined,

		/**
		 * @property {CMDBuild.controller.management.classes.CMNoteController}
		 */
		noteController: undefined,

		/**
		 * @property {CMDBuild.controller.management.classes.CMCardRelationsController}
		 */
		relationsController: undefined,

		/**
		 * @property {Array}
		 */
		subControllers: [],

		/**
		 * @property {CMDBuild.view.management.classes.CMModCard}
		 */
		view: undefined,

		constructor: function() {
			this.callParent(arguments);

			this.mon(this.view, this.view.CMEVENTS.addButtonClick, onAddCardButtonClick, this);
		},

		/**
		 * Build all controllers and adds view in tab panel with controller declaration order
		 *
		 * @override
		 */
		buildSubControllers: function() {
			Ext.suspendLayouts();

			// Tabs controllers
			this.buildTabControllerCard();
			this.buildTabControllerDetails();
			this.buildTabControllerNotes();
			this.buildTabControllerRelations();
			this.buildTabControllerHistory();
			this.buildTabControllerEmail();
			this.buildTabControllerAttachments();

			// Generic controllers
			buildGridController(this, this.view.getGrid());
			buildMapController(this);
			buildBimController(this, this.view.getGrid());

			Ext.resumeLayouts();
		},

		buildTabControllerAttachments: function() {
			var view = this.view.getAttachmentsPanel();

			if (!Ext.isEmpty(view)) {
				this.attachmentsController = new CMDBuild.controller.management.classes.attachments.CMCardAttachmentsController(view, this);

				this.subControllers.push(this.attachmentsController);

				this.view.cardTabPanel.add(view); // Add panel to view
			}
		},

		buildTabControllerCard: function() {
			var view = this.view.getCardPanel();
			var widgetControllerManager = new CMDBuild.controller.management.common.CMWidgetManagerController(this.view.getWidgetManager());

			if (!Ext.isEmpty(view)) {
				this.cardPanelController = new CMDBuild.controller.management.classes.CMCardPanelController(view, this, widgetControllerManager);

				this.mon(this.cardPanelController, this.cardPanelController.CMEVENTS.cardRemoved, function(idCard, idClass) {
					var et = _CMCardModuleState.entryType;

					this.gridController.onCardDeleted();
					this.view.reset(et.get('id')); // TODO change to notify the sub-controllers

					_CMCache.onClassContentChanged(idClass);
				}, this);

				this.mon(this.cardPanelController, this.cardPanelController.CMEVENTS.cardSaved, function(cardData) {
						var et = _CMCardModuleState.entryType;

						this.gridController.onCardSaved(cardData);
						this.mapController.onCardSaved(cardData);

						_CMCache.onClassContentChanged(et.get('id'));
				}, this);

				this.mon(this.cardPanelController, this.cardPanelController.CMEVENTS.editModeDidAcitvate, function() {
					this.mapController.editMode();
				}, this);

				this.mon(this.cardPanelController, this.cardPanelController.CMEVENTS.displayModeDidActivate, function() {
					this.mapController.displayMode();
				}, this);

				this.mon(this.cardPanelController, this.cardPanelController.CMEVENTS.cloneCard, function() {
					this.callForSubControllers('onCloneCard');
				}, this);

				this.subControllers.push(this.cardPanelController);

				this.view.cardTabPanel.add(view); // Add panel to view
			}
		},

		buildTabControllerDetails: function() {
			var view = this.view.getMDPanel();

			if (!Ext.isEmpty(view)) {
				this.mdController = new CMDBuild.controller.management.classes.masterDetails.CMMasterDetailsController(view, this);

				this.mon(this.mdController, 'empty', function(isVisible) {
					if (isVisible)
						this.view.cardTabPanel.activateFirstTab();
				}, this);

				this.subControllers.push(this.mdController);

				this.view.cardTabPanel.add(view); // Add panel to view
			}
		},

		buildTabControllerEmail: function() {
			this.controllerTabEmail = Ext.create('CMDBuild.controller.management.classes.tabs.Email', {
				parentDelegate: this
			});

			this.subControllers.push(this.controllerTabEmail);

			this.view.cardTabPanel.emailPanel = this.controllerTabEmail.getView(); // Creates tabPanel object

			this.view.cardTabPanel.add(this.controllerTabEmail.getView());
		},

		buildTabControllerHistory: function() {
			if (!Ext.Array.contains(
				_CMUIConfiguration.getDisabledCardTabs(),
				CMDBuild.model.CMUIConfigurationModel.cardTabs.history
			)) {
				this.controllerTabHistory = Ext.create('CMDBuild.controller.management.classes.tabs.History', {
					parentDelegate: this
				});

				this.subControllers.push(this.controllerTabHistory);

				this.view.cardTabPanel.cardHistoryPanel = this.controllerTabHistory.getView(); // Creates tabPanel object

				this.view.cardTabPanel.add(this.controllerTabHistory.getView());
			}
		},

		buildTabControllerNotes: function() {
			var view = this.view.getNotePanel();

			if (!Ext.isEmpty(view)) {
				this.noteController = new CMDBuild.controller.management.classes.CMNoteController(view);

				this.subControllers.push(this.noteController);

				this.view.cardTabPanel.add(view); // Add panel to view
			}
		},

		buildTabControllerRelations: function() {
			var view = this.view.getRelationsPanel();

			if (!Ext.isEmpty(view)) {
				this.relationsController = new CMDBuild.controller.management.classes.CMCardRelationsController(view, this);

				this.mon(this.relationsController, this.relationsController.CMEVENTS.serverOperationSuccess, function() {
					this.gridController.reload(true);
				}, this);

				this.subControllers.push(this.relationsController);

				this.view.cardTabPanel.add(view); // Add panel to view
			}
		},

		/**
		 * @param {Number} classId
		 */
		changeClassUIConfigurationForGroup: function(classId) {
			var privileges = _CMUtils.getClassPrivileges(classId);

			this.view.addCardButton.disabledForGroup = ! (privileges.write && ! privileges.crudDisabled.create);

			if (this.view.addCardButton.disabledForGroup) {
				this.view.addCardButton.disable();
			} else {
				this.view.addCardButton.enable();
			}

			this.cardPanelController.changeClassUIConfigurationForGroup(
				!(privileges.write && !privileges.crudDisabled.modify),
				!(privileges.write && !privileges.crudDisabled.clone),
				!(privileges.write && !privileges.crudDisabled.remove)
			);
		},

		/**
		 * To clear view if there are no loaded records
		 *
		 * @param (Object) args
		 * @param (Array) args[1] - loaded records array
		 */
		onGridLoad: function(args) {
			// TODO notify to sub-controllers?
			if (Ext.isEmpty(args[1])) {
				this.view.getCardPanel().displayMode();
				this.view.cardTabPanel.reset();
			}
		},

		onGridVisible: function(visible, selection) {
			if (
				visible
				&& this.entryType
				&& this.card
				&& selection
				&& selection[0]
				&& selection[0].get('Id') != this.card.get('Id')
			) {
				this.gridController.openCard(
					{
						IdClass: this.entryType.get('id'),
						Id: this.card.get('Id')
					},
					true
				);
			}
		},

		/**
		 * Forward onAbortCardClick event to email tab controller
		 */
		onAbortCardClick: function() {
			this.controllerTabEmail.onAbortCardClick();
		},

		/**
		 * Forward onModifyCardClick event to email tab controller
		 */
		onModifyCardClick: function() {
			this.controllerTabEmail.onModifyCardClick();
		},

		/**
		 * Forward onSaveCardClick event to email tab controller
		 */
		onSaveCardClick: function() {
			this.controllerTabEmail.onSaveCardClick();
		},

		/**
		 * Bind the CMCardModuleState
		 *
		 * @override
		 */
		setEntryType: function(entryTypeId, dc, filter) {
			var entryType = _CMCache.getEntryTypeById(entryTypeId);

			this.view.addCardButton.updateForEntry(entryType);
			this.view.mapAddCardButton.updateForEntry(entryType);
			this.view.updateTitleForEntry(entryType);

			if (!Ext.isEmpty(dc) && dc.activateFirstTab)
				this.view.activateFirstTab();

			_CMCardModuleState.setEntryType(entryType, dc, filter);
			_CMUIState.onlyGridIfFullScreen();

			this.changeClassUIConfigurationForGroup(entryTypeId);
		}
	});

	function buildGridController(me, grid) {
		if (grid) {
			me.gridController = new CMDBuild.controller.management.common.CMCardGridController(grid);
			me.mon(me.gridController, me.gridController.CMEVENTS.cardSelected, me.onCardSelected, me);
			me.mon(me.gridController, me.gridController.CMEVENTS.wrongSelection, onSelectionWentWrong, me);
			me.mon(me.gridController, me.gridController.CMEVENTS.gridVisible, me.onGridVisible, me);
			me.mon(me.gridController, me.gridController.CMEVENTS.load, me.onGridLoad, me);
			me.mon(me.gridController, me.gridController.CMEVENTS.itemdblclick, function() {
				var privileges = _CMUtils.getEntryTypePrivilegesByCard(me.cardPanelController.card);
				if (! privileges.crudDisabled.modify) {
					me.cardPanelController.onModifyCardClick();
					_CMUIState.onlyFormIfFullScreen();
				}
			}, me);

			me.subControllers.push(me.gridController);
		}
	}

	function buildMapController(me) {
		if (typeof me.view.getMapPanel == 'function') {
			me.mapController = new CMDBuild.controller.management.classes.CMMapController(me.view.getMapPanel(), me);
		} else {
			me.mapController = {
				onEntryTypeSelected: Ext.emptyFn,
				onAddCardButtonClick: Ext.emptyFn,
				onCardSaved: Ext.emptyFn,
				getValues: function() {return false;},
				refresh: Ext.emptyFn,
				editMode: Ext.emptyFn,
				displayMode: Ext.emptyFn
			};
		}

		me.subControllers.push(me.mapController);

		me.cardPanelController.addCardDataProviders(me.mapController);
	}

	function buildBimController(me, view) {
		if (view == null) {return;}

		if (CMDBuild.Config.bim.enabled) {
			new CMDBuild.bim.management.CMBimController(view);
		}
	}

	function onSelectionWentWrong() {
		this.view.cardTabPanel.reset(_CMCardModuleState.entryType.get('id'));
	}

	function onAddCardButtonClick(p) {
		this.setCard(null);
		this.callForSubControllers('onAddCardButtonClick', p.classId);
		this.view.activateFirstTab();

		_CMUIState.onlyFormIfFullScreen();
	}

})();