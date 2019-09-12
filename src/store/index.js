//全局静态变量与储存的全局信息

import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    baseUrl:'http://192.168.43.186',

    deviceInfo: {
        deviceId: "",
        deviceType: -1,
        deviceTypeString: "",
        lockFlag: ""
    },

    user: {
        userName: ""
    },
    //厂家代号。常量
    INVALID_MANUFACTOR: 0,//无效值
    FAP_MANUFACTOR_CORE_STS: 1,//超讯
    FAP_MANUFACTOR_CORE_TCX: 2,//同创鑫
    FAP_MANUFACTOR_CORE_BCB: 3,//BCB

    //plmn制式
    TDD_LTE: 1,
    FDD_LTE: 2,
    GSM900: 3,
    GSM1800: 4,
    ALL: 5,

    //功放控制类型
    PA_CRT_RS485: 0,
    PA_CRT_GPIO: 1,

    //扫网设定
    SCAN_SINGLE: 0,
    SCAN_TDD_GROUP: 1,
    SCAN_FDD_GROUP: 2,

    SCAN_YES: 0,
    SCAN_NO: 1,

    //核心板类别
    XTYPE_TDD: 0, // 表TDD核心板
    XTYPE_FDD: 1,// 表FDD核心板
    XTYPE_GSM: 2,// 表GSM核心板
    XTYPE_CDMA: 3,// 表CDMA核心板

    BOARDTYPE_BIG: 0,//大板
    BOARDTYPE_SMALL_SINGLE: 1,//小板单制式板型
    BOARDTYPE_SMALL_DOUBLE: 2,//小板双制式板型

    TYPE_900: 0,//GSM900
    TYPE_1800: 1,//GSM1800

    PA_INVALID: -1,

    HRCX_PA: 1,//厂家恒锐创信
    MOJI_PA: 2,//厂家魔极

    OUTLAY_PA: 1,//外置功放
    WITHOUT_PA: 0,//无功放

    RELATE_WAY_BOUND: 0,  //绑定
    RELATE_WAY_FREE: 1,      //自由选择

}

var mutations = {
    setDeviceInfo(state, device) {
        state.deviceInfo = device
    },
    setUserName(state, userInfo) {
        state.user = userInfo
    }
}

const getters = {
    getDeviceInfo(state) {
        return state.deviceInfo;
    },
    getUserName(state) {
        return state.user;
    },
}

const store = new Vuex.Store({
    state,
    mutations,
    getters
})

export default store