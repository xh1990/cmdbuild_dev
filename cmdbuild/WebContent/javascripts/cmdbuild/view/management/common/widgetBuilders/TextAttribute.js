(function() {
	TEXT_EDITOR_TYPE = {
		plain: "PLAIN",
		html: "HTML"
	};
/**
 * @class CMDBuild.WidgetBuilders.TextAttribute
 * @extends CMDBuild.WidgetBuilders.StringAttribute
 */
Ext.ns("CMDBuild.WidgetBuilders");
CMDBuild.WidgetBuilders.TextAttribute = function() {};
CMDBuild.extend(CMDBuild.WidgetBuilders.TextAttribute, CMDBuild.WidgetBuilders.StringAttribute);
/**
 * @override
 * @param attribute
 * @return Ext.form.TextArea
 */
CMDBuild.WidgetBuilders.TextAttribute.prototype.buildAttributeField = function(attribute) {
	if (attribute.editorType != TEXT_EDITOR_TYPE.html) {
		var attr = Ext.apply({},attribute);
		attr.len = this.MAXWIDTH + 1; // MAXWIDTH is the length for switching to a textarea
		return CMDBuild.WidgetBuilders.TextAttribute.superclass.buildAttributeField(attr);
	} else {
		var editor = Ext.create('CMDBuild.view.common.field.CMHtmlEditorField', {
			labelAlign: 'right',
			labelWidth: CMDBuild.LABEL_WIDTH,
			width: CMDBuild.HTML_EDITOR_WIDTH,
 			fieldLabel: attribute.description || attribute.name,
 			name: attribute.name,
 			disabled: false,
			CMAttribute: attribute
		});

		return editor;
	}
};
})();