sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    'use strict';

    return {
        onInit: function (oEvent) {
            var that = this;
            this.oView = this.getView();
            this.oDataModel = this.getOwnerComponent().getModel();
            this._sIDPrefix = "com.rs.cf.grpldevicemaintenance::sap.suite.ui.generic.template.ObjectPage.view.Details::Device--";

            this.extensionAPI.attachPageDataLoaded(function (oEvent) {
                this.oContextObj = oEvent.context.getObject();
                this.sPath = oEvent.context.getPath();
              
                this.setReadOnlyFields();
                this.processConfigurations();
               this.checkDeviceInconsistencies();

            }.bind(this));

            this.oDataModel.attachBatchRequestCompleted(function () {
                if (this.sPath) {
                    this.oContextObj = this.oDataModel.getProperty(this.sPath);
                    this.setReadOnlyFields();
                    this.processConfigurations();
                    this.checkDeviceInconsistencies();
                }
            }.bind(this));
        },
        checkDeviceInconsistencies: function () {
                if (this.extensionAPI.setCustomMessage) {
                    if (this.oContextObj && this.oContextObj.HasInconsistency) {
                       var oConfigTab = this.oView.byId(this._sIDPrefix +
                             "objectPage-anchBar-com.rs.cf.grpldevicemaintenance::sap.suite.ui.generic.template.ObjectPage.view.Details::Device--_DeviceConfig::Section-anchor");
                        if(oConfigTab){
                           oConfigTab.firePress();
                        }
                        var oMsg = {
                            message: "Device has inconsistencies. " + this.oContextObj.InconsistenceReason, //"Device has inconsistencies. There are SDR(s) without configurations. Please create a Config Variant and assign it to the SDR(s).",
                            type: sap.ui.core.MessageType.Warning
                        };
                        this.extensionAPI.setCustomMessage(oMsg, this._sIDPrefix + "_DeviceConfig::Table");
                    } else {
                        this.extensionAPI.setCustomMessage(null, this._sIDPrefix + "_DeviceConfig::Table");
                    }
                }            
        },
        processConfigurations: function () {
            this.oContextObj = this.oDataModel.getProperty(this.sPath);
            if (this.oContextObj) {
                if (this.oContextObj.IsConfigurable === undefined) {
                    this.setFieldVisibility("ConfigMaterialNo", false);
                    this.setFieldVisibility("ManufacturerMaterialNo", false);
                } else {
                    this.setFieldVisibility("ConfigMaterialNo", this.oContextObj.IsConfigurable && this.oContextObj.MFRType === "01");
                    this.setFieldVisibility("ManufacturerMaterialNo", this.oContextObj.MFRType === "01" ? false : true);
                }
            }

        },
        setReadOnlyFields: function () {
            this.setReadOnlyField("VTLStatus");
            this.setReadOnlyField("EndDateRepMaint");
            this.setReadOnlyField("EndDateBestEffort");
            this.setReadOnlyField("ProfitCenter");
            this.setReadOnlyField("Designation");
            this.setReadOnlyField("CalibrationInterval");
            this.setReadOnlyField("WarrantyInterval");
            this.setReadOnlyField("AuthorizationGroup");
            this.setReadOnlyField("VirusScan");
            this.setReadOnlyField("DeviceName");
            this.setReadOnlyField("ConfigMaterialNo");
        },
        setFieldVisibility: function (sField, bVisisible) {
            var oField = this.getField(sField)
            if (oField) {
                oField.setVisible(bVisisible);
            }
        },
        setReadOnlyField: function (sField) {
            var oField = this.getField(sField)
            if (oField) {
                oField.setEditable(false);
            }
        },
        getField: function (sField) {
            return this.oView.byId(this._sIDPrefix + "Device::" + sField + "::Field");

        },
        onExit: function () {
            this.oDataModel.detachBatchRequestCompleted();
            this.extensionAPI.detachPageDataLoaded();
        }

    };
});