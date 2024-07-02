sap.ui.define([
    "sap/ui/model/Filter", 
    "sap/ui/comp/smartfilterbar/SmartFilterBar", 
    "sap/m/ComboBox"
], function (Filter, SmartFilterBar, ComboBox) {
    "use strict";
    return {
        onInitSmartFilterBarExtension: function (oEvent) {
            this.oSmartFilterBar = oEvent.getSource();
            if (this.oSmartFilterBar.isInitialised()) {
                this.oSmartFilterBar.setLiveMode(true);
            }
        },
    };
});