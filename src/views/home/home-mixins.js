import Info from "./info.vue";
import mix from './menu-mixins.js'

export default {
    mixins: [mix],
    components: {
        info: Info
    },
    // //判断是否登陆
    // beforeCreate() {
    //     const token = localStorage.getItem("token");
    //     if (!token) {
    //         this.$router.push({ name: "login" });
    //     }
    // },

    data() {
        return {
            deviceInfo: {
                deviceId: "",
                deviceType: -1,
                deviceTypeString: "",
                lockFlag: ""
            },
            lockType: "danger",
            user: {
                userName: ""
            },
            editableTabsValue: "0",
            editableTabs: [],
            tabIndex: 0,
            isCollapse: false,
            asideWith: "200px"
        };
    },
    created() {
        //获取设备信息
        this.getDeviceInfo();
        //获取tip
        this.queryTipInfo();
        //获取用户
        this.getUser();
    },
    methods: {
        async queryTipInfo() {
            const res = await this.jsp("/projectCfg.do?method=queryTipInfo");
            const {
                //对象解构赋值
                msg,
                success,
                results
            } = res;
            if (success) {
                var str = "";
                let data = [];
                results.forEach((item, i) => {
                    str = i + 1 + "、" + item;
                    data.push(str);
                });

                let newDatas = [];
                const h = this.$createElement;
                for (let i in data) {
                    newDatas.push(h("p", null, data[i]));
                }
                this.$notify({
                    title: "注意",
                    type: "warning",
                    message: h("div", null, newDatas),
                    duration: 0,
                    position: "bottom-right"
                });
            } else {
                this.$message.error(msg);
            }
        },
        lock() {
            this.$confirm(
                "锁定后，将禁用以下功能： 设备信息的修改、核心板/功放的增删改。确定要进行锁定？",
                "锁定配置确认",
                {
                    confirmButtonText: "立即锁定",
                    cancelButtonText: "取消",
                    type: "warning"
                }
            )
                .then(async () => {
                    // const res = await this.jsp("/reboot/restart.do");
                    // const {
                    //   //对象解构赋值
                    //   msg,
                    //   success
                    // } = res;
                    // if (success) {
                    //   this.$message.success(msg);
                    // } else {
                    //   this.$message.error(msg);
                    // }
                })
                .catch(() => { });
        },
        changeAsideWith() {
            this.isCollapse = !this.isCollapse
            this.asideWith = this.isCollapse ? "60px" : "200px";
        },
        changeTab(editableTabsValue) {
            for (var i = 0; i < this.editableTabs.length; i++) {
                if (editableTabsValue == this.editableTabs[i].name) {
                    this.$router.push(this.editableTabs[i].path);
                    return;
                }
            }
        },
        addTab(menu) {
            for (var i = 0; i < this.editableTabs.length; i++) {
                if (menu.id == this.editableTabs[i].id) {
                    this.editableTabsValue = this.editableTabs[i].name;
                    return;
                }
            }

            let newTabName = ++this.tabIndex + "";
            this.editableTabs.push({
                title: menu.name,
                name: newTabName,
                id: menu.id,
                path: menu.path
            });
            this.editableTabsValue = newTabName;
        },
        removeTab(targetName) {
            let tabs = this.editableTabs;
            let activeName = this.editableTabsValue;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }

            this.editableTabsValue = activeName;

            this.editableTabs = tabs.filter(tab => tab.name !== targetName);

            if (this.editableTabs.length === 0) {
                this.editableTabsValue = "0";
            } else {
                for (var i = 0; i < this.editableTabs.length; i++) {
                    if (this.editableTabsValue == this.editableTabs[i].name) {
                        this.$router.push(this.editableTabs[i].path);
                        return;
                    }
                }
            }
        },

        async getUser() {
            const res = await this.jsp("/user.do?method=getUser");
            const {
                //对象解构赋值
                msg,
                success,
                results
            } = res;
            if (success) {
                this.user = results;
                //存入vuex
                this.$store.commit("setUserName", this.user);
            } else {
                this.$message.error(msg);
            }
        },

        restart() {
            this.$confirm("是否重启系统?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    const res = await this.jsp("/reboot/restart.do");
                    const {
                        msg,
                        success
                    } = res;
                    if (success) {
                        this.$message.success(msg);
                    } else {
                        this.$message.error(msg);
                    }
                })
                .catch(() => { });
        },

        async getDeviceInfo() {
            const res = await this.jsp("/projectCfg.do?method=queryDeviceInfo");
            const {
                msg,
                success,
                results
            } = res;

            if (success) {
                this.deviceInfo = JSON.parse(results);
                this.lockType = this.deviceInfo.lockFlag == 0 ? "danger" : "success";
                //存入vuex
                this.$store.commit("setDeviceInfo", this.deviceInfo);
            } else {
                this.$message.error(msg);
            }
        },

        logout() {
            localStorage.clear();
            this.$store.commit("setUserName", "");
            this.$message.success("已安全退出");
            this.$router.push({ name: "login" });
        },
    }
};