import MccWin from "../../views/base/mccWin.vue";
import MncWin from '../../views/base/mncWin.vue'
export default {
    components: {
        MccWin,
        MncWin
    },
    created() {
        this.getMccList();
    },
    data() {
        return {
            dialogMccWinVisible: false,
            dialogMncWinVisible: false,

            selectMcc: {},
            mccList: [],
            mncList: [],
        };
    },
    methods: {
        handleCurrentChange(val) {
            this.selectMcc = val
            this.getMncList()
        },

        showDialog() {
            this.dialogMccWinVisible = true;
            this.$nextTick(() => {
                this.$refs.mccWin.init("新增Mcc", null);
            });
        },
        showEditDialog(mcc) {
            this.dialogMccWinVisible = true;
            this.$nextTick(() => {
                this.$refs.mccWin.init("修改Mcc", mcc);
            });
        },
        showMncDialog() {
            this.dialogMncWinVisible = true;
            this.$nextTick(() => {
                this.$refs.mncWin.init("新增Mnc", this.selectMcc.mcc, null);
            });
        },
        showMncEditDialog(mnc) {
            this.dialogMncWinVisible = true;
            this.$nextTick(() => {
                this.$refs.mncWin.init("修改Mnc", this.selectMcc.mcc, mnc);
            });
        },
        showMncDel(mnc) {
            this.$confirm("确定删除此mnc?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.delMnc(mnc);
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },
        showDel(mcc) {
            this.$confirm("删除该MCC将同时删除对应的MNC。是否删除?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.delMcc(mcc.mcc);
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },
        async delMnc(mnc) {
            const res = await this.jsp("/mcc.do?method=delMnc", {
                mcc: mnc.mcc,
                mnc: mnc.mnc
            });
            const { msg, success } = res;
            if (success) {
                this.getMncList();
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
        },
        async delMcc(mcc) {
            const res = await this.jsp("/mcc.do?method=delMcc", {
                mcc: mcc
            });
            const { msg, success } = res;
            if (success) {
                this.getMccList();
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
        },
        async getMccList() {
            const res = await this.jsp("/mcc.do?method=find");
            this.mccList = res;
            //默认选中第一行
            this.$refs.mccTable.setCurrentRow(this.mccList[0]);
        },
        async getMncList() {
            if (this.selectMcc == null) {
                return
            }
            const res = await this.jsp("/mnc/find.do?", { mcc: this.selectMcc.mcc, type: 1, xtype: 5 });
            this.mncList = res;
        },
        getNetworkTypeList(mnc) {
            var networkType = mnc.networkType.split(",")
            var networkTypeList = []
            networkType.forEach(item => {
                if (item == this.$store.state.TDD_LTE) {
                    networkTypeList.push("TDD_LTE")
                } else if (item == this.$store.state.FDD_LTE) {
                    networkTypeList.push("FDD_LTE")
                } else if (item == this.$store.state.GSM900) {
                    networkTypeList.push("GSM900")
                } else if (item == this.$store.state.GSM1800) {
                    networkTypeList.push("GSM1800")
                }
            })
            return networkTypeList
        }

    }
};