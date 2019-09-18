export default {
    data() {
        var validate900End = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入GSM900结束频点"));
            } else if (value < this.mncForm.gsm900start) {
                callback(new Error("GSM900结束频点小于起始频点！"));
            } else {
                callback();
            }
        };
        var validate1800End = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入DCS1800结束频点"));
            } else if (value < this.mncForm.gsm1800start) {
                callback(new Error("DCS1800结束频点小于起始频点！"));
            } else {
                callback();
            }
        };
        return {
            title: "",
            dialogVisible: false,
            mncDisabled: false,
            gsm900Check: false,
            dcs1800Check: false,
            networkTypeList: [],
            mncForm: {},
            rules: {
                mnc: [
                    { required: true, message: "请输入Mnc", trigger: "blur" },
                    { pattern: /^[0-9][0-9]$/, message: "2位数字字符，如：01" }
                ],
                operator: [
                    { required: true, message: "请输入运营商", trigger: "blur" },
                    { min: 1, max: 128, message: "最多128个字符", trigger: "blur" }
                ],
                gsm900start: [
                    { required: true, message: "请输入GSM900起始频点", trigger: "blur" }
                ],
                gsm900end: [
                    { required: true, message: "请输入GSM900结束频点", trigger: "blur" },
                    { validator: validate900End, trigger: "blur" }
                ],
                gsm1800start: [
                    { required: true, message: "请输入DCS1800起始频点", trigger: "blur" }
                ],
                gsm1800end: [
                    { required: true, message: "请输入DCS1800结束频点", trigger: "blur" },
                    { validator: validate1800End, trigger: "blur" }
                ]
            },
        };
    },

    methods: {
        init(title, mcc, mncForm) {
            this.title = title;

            if (mncForm != null) {
                this.initEdit(mcc, mncForm);
            } else {
                this.mncForm = {};
                this.networkTypeList = []
                this.mncForm.mcc = mcc;
                this.gsm900Check = false;
                this.dcs1800Check = false;
                this.mncDisabled = false;
            }

            this.dialogVisible = true;
            this.resetForm("mncForm");
        },

        gsm900Change(val) {
            this.gsm900Check = val;
            if (!this.gsm900Check) {
                this.mncForm.gsm900start = 1;
                this.mncForm.gsm900end = 124;
            }
        },
        dcs1800Change(val) {
            this.dcs1800Check = val;
            if (!this.dcs1800Check) {
                this.mncForm.gsm1800start = 512;
                this.mncForm.gsm1800end = 885;
            }
        },

        initEdit(mcc, mncForm) {
            this.mncForm = mncForm;
            this.mncDisabled = true;
            var list = mncForm.networkType.split(",");
            this.networkTypeList = [];
            list.forEach(item => {
                this.networkTypeList.push(Number(item));
            });
            if (
                mncForm.networkType.indexOf("3") > -1 &&
                mncForm.gsm900Uarfcns != null &&
                mncForm.gsm900Uarfcns != ""
            ) {
                this.gsm900Check = true;
                var gsm900Uarfcns = mncForm.gsm900Uarfcns.split("-");
                this.mncForm.gsm900start = gsm900Uarfcns[0];
                this.mncForm.gsm900end = gsm900Uarfcns[1];
            } else {
                this.gsm900Check = false;
            }
            if (
                mncForm.networkType.indexOf("4") > -1 &&
                mncForm.gsm1800Uarfcns != null &&
                mncForm.gsm1800Uarfcns != ""
            ) {
                this.dcs1800Check = true;
                var gsm1800Uarfcns = mncForm.gsm1800Uarfcns.split("-");
                this.mncForm.gsm1800start = gsm1800Uarfcns[0];
                this.mncForm.gsm1800end = gsm1800Uarfcns[1];
            } else {
                this.dcs1800Check = false;
            }

            this.mncForm.mcc = mcc;
        },

        async cfgMnc(formName) {
            var formVal = this.util.checkForm(this, formName);
            if (!formVal) {
                return;
            }

            if (this.networkTypeList.length < 1) {
                this.util.showMsg(this, "请至少选择一个制式")
                return
            }

            this.mncForm.networkType = this.networkTypeList.join(",");
            if (this.gsm900Check) {
                this.mncForm.gsm900Uarfcns =
                    this.mncForm.gsm900start + "-" + this.mncForm.gsm900end;
            }
            if (this.dcs1800Check) {
                this.mncForm.gsm1800Uarfcns =
                    this.mncForm.gsm1800start + "-" + this.mncForm.gsm1800end;
            }

            if (this.title == "新增Mnc") {
                this.addMnc();
            } else if (this.title == "修改Mnc") {
                this.editMnc();
            }
        },
        async editMnc() {
            const res = await this.jsp("/mcc.do?method=updateMnc", this.mncForm);
            const { msg, success } = res;
            if (success) {
                this.$emit("reflash");
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
            this.dialogVisible = false;
        },
        async addMnc() {
            const res = await this.jsp("/mcc.do?method=addMnc", this.mncForm);
            const { msg, success } = res;
            if (success) {
                this.$emit("reflash");
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
            this.dialogVisible = false;
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        }
    }
};