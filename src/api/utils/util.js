export default {
    //核心板类别
    XTYPE_TDD: 0, // 表TDD核心板
    XTYPE_FDD: 1,// 表FDD核心板
    XTYPE_GSM: 2,// 表GSM核心板
    XTYPE_CDMA: 3,// 表CDMA核心板

    //TDD
    BAND_34: 34,
    BAND_38: 38,
    BAND_39: 39,
    BAND_40: 40,
    BAND_41: 41,

    //FDD
    BAND_1: 1,
    BAND_3: 3,
    BAND_5: 5,
    BAND_8: 8,

    //未知
    BAND_INVALID: 0,

    getFddBand: function (bands) {
        var bandArray = bands.split(",");
        var result = new Array();
        for (var i = 0; i < bandArray.length; i++) {
            var tmp1 = bandArray[i].split(":");
            var bandNum = tmp1[0];
            if (bandNum == this.BAND_1 || bandNum == this.BAND_3 || bandNum == this.BAND_5
                || bandNum == this.BAND_8) {
                result.push(bandArray[i]);
            }
        }
        return result.join(",");
    },

    getTddBand: function (bands) {
        var bandArray = bands.split(",");
        var result = new Array();
        for (var i = 0; i < bandArray.length; i++) {
            var tmp1 = bandArray[i].split(":");
            var bandNum = tmp1[0];
            if (bandNum == this.BAND_34 || bandNum == this.BAND_38 || bandNum == this.BAND_39
                || bandNum == this.BAND_40 || bandNum == this.BAND_41) {
                result.push(bandArray[i]);
            }
        }
        return result.join(",");
    },

    checkUarfcnByBandType: function (uarfcn, bands) {
        var bandArray = bands.split(",");

        for (var i = 0; i < bandArray.length; i++) {
            var tmp1 = bandArray[i].split(":");
            var tmp2 = tmp1[1].split("-");

            var bandNum = tmp1[0];
            var start = tmp2[0];
            var end = tmp2[1];

            if (parseInt(uarfcn) >= parseInt(start) && parseInt(uarfcn) <= parseInt(end)) {
                return true;
            }
        }
        return false;
    },

    checkUarfcn0: function (uarfcn) {
        if (uarfcn.length > 1 && parseInt(uarfcn.substring(0, 1)) == 0) {
            return true;
        }
        return false;
    },

    checkForm(content, formName) {
        var formVal = true;
        content.$refs[formName].validate(valid => {
            if (!valid) {
                formVal = false;
                this.showMsg(content, "请输入正确内容")
            }
        });
        return formVal;
    },

    showMsg(content, msg) {
        content.$alert(msg, "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => { }
        });
    },


	/**
	 * 判断频点是否属于TDD或FDD
	 */
    checkUarfcnByXtype: function (uarfcn, xtype) {
        if (xtype == this.XTYPE_FDD) {//FDD
            if (parseInt(uarfcn) >= 0 && parseInt(uarfcn) <= 599
                || parseInt(uarfcn) >= 1200 && parseInt(uarfcn) <= 1949
                || parseInt(uarfcn) >= 2400 && parseInt(uarfcn) <= 2649
                || parseInt(uarfcn) >= 3450 && parseInt(uarfcn) <= 3799) {
                return true;
            }

        } else {//TDD
            if (parseInt(uarfcn) >= 36200 && parseInt(uarfcn) <= 36349
                || parseInt(uarfcn) >= 37750 && parseInt(uarfcn) <= 38249
                || parseInt(uarfcn) >= 38250 && parseInt(uarfcn) <= 38649
                || parseInt(uarfcn) >= 38650 && parseInt(uarfcn) <= 39649
                || parseInt(uarfcn) >= 39650 && parseInt(uarfcn) <= 41589) {
                return true;
            }
        }

        return false;
    }

}