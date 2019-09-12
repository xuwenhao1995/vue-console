export default {

    data() {
        return {
            menus: [
                {
                    name: "基站管理",
                    id: 2,
                    icon: "iconfont icon-tongxin",
                    path: "device",
                    children: [
                        {
                            name: "核心板管理",
                            id: 21,
                            icon: "el-icon-cpu",
                            path: "coremanagement"
                        },
                        {
                            name: "功放管理",
                            id: 22,
                            icon: "iconfont icon-shebei",
                            path: "power"
                        },

                    ]
                },
                {
                    name: "系统控制",
                    id: 1,
                    icon: "el-icon-setting",
                    path: "users",
                    children: [
                        {
                            name: "用户管理",
                            id: 11,
                            icon: "el-icon-user",
                            path: "users"
                        },
                        {
                            name: "修改密码",
                            id: 12,
                            icon: "el-icon-key",
                            path: "changePwd"
                        },
                        {
                            name: "告警日志",
                            id: 13,
                            icon: "iconfont icon-log-a-04",
                            path: "alarmLog"
                        },
                        {
                            name: "日志下载",
                            id: 14,
                            icon: "el-icon-download",
                            path: "logs"
                        }
                    ]
                },
            ]
        }
    }
};