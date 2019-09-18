export default {

    data() {
        return {
            menus: [
                {
                    name: "设备信息",
                    id: 1,
                    icon: "el-icon-monitor",
                    path: "project",
                    children: [
                        {
                            name: "设备信息",
                            id: 11,
                            icon: "el-icon-monitor",
                            path: "project"
                        },
                        {
                            name: "RRC检测",
                            id: 12,
                            icon: "iconfont icon-RRCjianlichenggongshuai",
                            path: "rrcCheck"
                        },
                        {
                            name: "核心板定时重启",
                            id: 13,
                            icon: "iconfont icon-dingshi",
                            path: "restartFapCfgTime"
                        },
                    ]
                },
                {
                    name: "基本设置",
                    id: 2,
                    icon: "el-icon-s-tools",
                    path: "baseCfg",
                    children: [
                        {
                            name: "设备时间",
                            id: 21,
                            icon: "el-icon-time",
                            path: "systemTime"
                        },
                        {
                            name: "受限Mcc",
                            id: 22,
                            icon: "el-icon-remove",
                            path: "limitMcc"
                        },
                        {
                            name: "Plmn管理",
                            id: 23,
                            icon: "el-icon-mobile-phone",
                            path: "plmnMana"
                        },
                    ]
                },
                {
                    name: "基站管理",
                    id: 3,
                    icon: "iconfont icon-tongxin",
                    path: "device",
                    children: [
                        {
                            name: "核心板管理",
                            id: 31,
                            icon: "el-icon-cpu",
                            path: "coremanagement"
                        },
                        {
                            name: "功放管理",
                            id: 32,
                            icon: "iconfont icon-shebei",
                            path: "power"
                        },
                        {
                            name: "信号通道约束",
                            id: 33,
                            icon: "iconfont icon-tongxin-1",
                            path: "signalChannel"
                        },

                    ]
                },
                {
                    name: "系统控制",
                    id: 4,
                    icon: "el-icon-setting",
                    path: "users",
                    children: [
                        {
                            name: "用户管理",
                            id: 41,
                            icon: "el-icon-user",
                            path: "users"
                        },
                        {
                            name: "修改密码",
                            id: 42,
                            icon: "el-icon-key",
                            path: "changePwd"
                        },
                        {
                            name: "告警日志",
                            id: 43,
                            icon: "iconfont icon-log-a-04",
                            path: "alarmLog"
                        },
                        {
                            name: "日志下载",
                            id: 44,
                            icon: "el-icon-download",
                            path: "logs"
                        },
                        {
                            name: "路由追踪",
                            id: 45,
                            icon: "iconfont icon-luyouzhuizong-",
                            path: "router"
                        }
                    ]
                },
            ]
        }
    }
};