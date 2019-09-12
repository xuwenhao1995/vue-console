import { log } from "util";

export default {
    created() { },

    data() {
        return {
            subMode: [
                {
                    id: 0,
                    name: "侦码"
                },
                // {
                //   id: 1,
                //   name: "所有IMSI到GSM"
                // },
                {
                    id: 2,
                    name: "重定向到2G"
                },
                {
                    id: 3,
                    name: "定位"
                },
                {
                    id: 4,
                    name: "重定向到4G(指定IMSI)"
                },
                {
                    id: 5,
                    name: "重定向到4G(所有IMSI)"
                },
                {
                    id: 6,
                    name: "指定IMSI到4G，其它IMSI到2G"
                },
                // {
                //   id: 7,
                //   name: "所有IMSI到CDMA1xRTT "
                // },
                {
                    id: 8,
                    name: "黑名单反制"
                },
                {
                    id: 9,
                    name: "全反制"
                },
                {
                    id: 10,
                    name: "白名单反制"
                }
            ],
            //界面控制
            userdFlag: true,
            redirect4G: true,
            redirect2G: true,
            snifferFlag: false,
            waitGuiCfgFlag: false,
            syncModeFlag: false,
            macroFlag: true,

            title: "",
            dialogFormVisible: false,
            dialogPlmnVisible: false,
            dialogFileVisible: false,

            maxTxpowerDbm: 0,
            core: {},
            paramForm: {},
            rules: {
                mcc: [
                    { required: true, message: "请选择MCC", trigger: "blur" },
                ],
                mnc: [
                    { required: true, message: "请选择MNC", trigger: "blur" },
                ],
                redirect4GUarfcn: [
                    { required: true, message: "请输入重定向到4G频点", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                redirectGsmCellUarfcn: [
                    { required: true, message: "请输入重定向到2G频点", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                nasRejCause: [
                    { required: true, message: "请输入NAS拒绝原因", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                specBoardVersion: [
                    { required: true, message: "请输入扫网RxGain", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                uarfcn: [
                    { required: true, message: "请输入UARFCN", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                phyCellId: [
                    { required: true, message: "请输入PCI", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                tac: [
                    { required: true, message: "请输入TAC", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                refBroadcastPower: [
                    { required: true, message: "请输入参考广播功率", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                txPower: [
                    { required: true, message: "请输入输出功率", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                rxGain: [
                    { required: true, message: "请输入RxGain", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                syncToMacroUarfcn: [
                    { required: true, message: "请输入同步宏站频点", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                syncToMacroPCI: [
                    { required: true, message: "请输入同步宏站PCI", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                syncToGPSAdjustValue: [
                    { required: true, message: "请输入GPS调整值", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                configsnifuarfcn: [
                    { required: true, message: "请输入扫频频点", trigger: "blur" },
                    { pattern: /^((0|([1-9]\d{0,4}))[,]){0,15}(0|([1-9]\d{0,4}))$/, message: "只能输入1~16个由英文逗号分隔的数字" },
                ],
            }
        };
    },

    methods: {
        init(core) {
            this.core = core;
            this.maxTxpowerDbm = core.maxTxpowerDbm
            this.title = core.name + "-" + "参数设置";
            this.getParam();
            this.dialogFormVisible = true;
        },
        initParamForm() {
            this.paramForm.id = this.core.id
            this.paramForm.paramsXtype = this.core.xtype
        },
        showPlmn() {
            this.dialogPlmnVisible = true
            var xtype = this.core.xtype == this.$store.state.XTYPE_TDD ? this.$store.state.TDD_LTE : this.$store.state.FDD_LTE
            this.$nextTick(() => {
                this.$refs.plmn.initPlmn(xtype, this.paramForm.mcc, this.paramForm.mnc)
            })
        },
        updateParentPlmn(mcc, mnc) {
            this.paramForm.mcc = mcc
            this.paramForm.mnc = mnc
        },
        exportParam() {
            this.$alert('导出【' + this.core.name + '】的全部参数，确认进行?', '导出参数', {
                confirmButtonText: '确定',
                type: 'success',
                callback: async action => {
                    const url = this.$store.state.baseUrl + "/coreBoard.do?method=export&ip=" + this.core.ip
                    const link = document.createElement('a')
                    link.href = url
                    link.setAttribute('download', '')
                    document.body.appendChild(link)
                    link.click()
                }
            });

        },
        async importParam() {
            this.dialogFileVisible = true
            this.$nextTick(() => {
                this.$refs.uploadFile.initFile("导入参数", "只能上传xml文件", ".xml", this.core)
            })
        },

        async setParam(formName) {

            var formVal = this.util.checkForm(this, formName)
            if (!formVal) {
                return;
            }
            var flag = this.checkUarfcn()
            if (!flag) {
                return;
            }

            const res = await this.jsp("/coreBoard.do?method=setParams", this.paramForm);
            const { msg, success } = res;
            if (success) {
                this.$alert('保存参数成功', '提示', {
                    confirmButtonText: '确定',
                    type: 'success',
                    callback: action => {
                        this.dialogFormVisible = false
                    }
                });
            } else {
                this.util.showMsg(this, msg)
            }
        },

        checkUarfcn() {
            var uarfcns = this.paramForm.configsnifuarfcn.split(",");
            var flag = true;
            var xtypeStr = (this.core.xtype == this.$store.state.XTYPE_TDD ? "TDD" : "FDD");
            for (var i = 0; i < uarfcns.length; i++) {

                if (this.util.checkUarfcn0(uarfcns[i])) {
                    var message = '输入的扫频频点:' + uarfcns[i] + '不能以0开头！';
                    this.util.showMsg(this, message)
                    flag = false;
                    return flag;
                }

                flag = this.util.checkUarfcnByXtype(uarfcns[i], this.core.xtype);

                if (!flag) {
                    var message = '输入的扫频频点:' + uarfcns[i] + '不在' + xtypeStr + '频点范围中！请参看右侧问号上的提示';
                    this.util.showMsg(this, message)
                    flag = false;
                    return flag;
                }
            }

            var uarfcn = this.paramForm.uarfcn
            var fband = this.core.fband
            flag = this.util.checkUarfcnByBandType(uarfcn, fband);
            if (!flag) {
                var message = '输入的频点:' + uarfcn + '不在' + fband + '频段中！';
                this.util.showMsg(this, message)
                flag = false;
                return flag;
            }

            return flag
        },

        async getParam() {
            this.paramForm = {};

            const res = await this.jsp("/coreBoard.do?method=queryParams", {
                id: this.core.id
            });
            const { msg, success, results } = res;
            if (success) {
                this.paramForm = JSON.parse(results);
            } else {
                this.paramForm = JSON.parse(results);
                this.$message.error(msg);
            }
            this.initParamForm()
            this.initFlag();
        },

        //界面控制方法
        changeFollow3UserdFlag(value) {
            if (value === 1) {
                this.userdFlag = false;
                this.changeSubMode(this.paramForm.defaultWorkingModeSubMode)
            } else {
                this.userdFlag = true;
                this.redirect2G = true;
                this.redirect4G = true;
            }
        },
        changeSubMode(value) {
            if (value == 2) {
                this.redirect2G = false;
                this.redirect4G = true;
            } else if (value == 4 || value == 5) {
                this.redirect2G = true;
                this.redirect4G = false;
            } else if (value == 6) {
                this.redirect2G = false;
                this.redirect4G = false;
            } else {
                this.redirect2G = true;
                this.redirect4G = true;
            }
        },

        changeFastSnifferFlag(value) {
            if (value === 0) {
                this.snifferFlag = false;
            } else {
                this.snifferFlag = true;
            }
        },

        changeWaitGuiCfgFlag(value) {
            if (value === 0) {
                this.waitGuiCfgFlag = false;
            } else {
                this.waitGuiCfgFlag = true;
            }
        },
        changeSyncMode(value) {
            if (value == 0 || value == 3) {
                this.syncModeFlag = false;
                if (this.paramForm.syncToMacroMode == 1) {
                    this.macroFlag = false;
                }
            } else {
                this.syncModeFlag = true;
                this.macroFlag = true;
            }
        },
        changeMacroMode(value) {
            if (value == 1) {
                this.macroFlag = false;
            } else {
                this.macroFlag = true;
            }
        },

        initFlag() {
            this.syncModeFlag =
                this.paramForm.syncMode == 1 || this.paramForm.syncMode == 2;

            this.macroFlag = this.paramForm.syncToMacroMode == 0;

            if (this.syncModeFlag) {
                this.macroFlag = true;
            }

            this.waitGuiCfgFlag = this.paramForm.waitGuiCfgFlag == 255;
            this.snifferFlag = this.paramForm.fastSnifferFlag == 1;

            this.redirect2G = !(
                this.paramForm.defaultWorkingModeSubMode == 2 ||
                this.paramForm.defaultWorkingModeSubMode == 6
            );
            this.redirect4G = !(
                this.paramForm.defaultWorkingModeSubMode == 4 ||
                this.paramForm.defaultWorkingModeSubMode == 5
            );
            this.userdFlag = this.paramForm.follow3UserdFlag == 0;
        }
    },

    props: ["pcore"]
};