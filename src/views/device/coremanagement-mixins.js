export default {
    created() {
        this.getCoreList();
    },

    methods: {
        //分页
        handleSizeChange(val) {
            this.pagesize = val;
            this.pagenum = 1;
            this.getCoreList();
        },
        handleCurrentChange(val) {
            this.pagenum = val;
            this.getCoreList();
        },

        handleSelectionChange() { },

        async showDialog() {
            this.title = "增加核心板";
            this.resetData()
            this.disabled = false;
            //获取厂家信息
            this.getManufactors()
            //获取功放信息
            this.getAllpa()

            this.dialogFormVisible = true;
        },
        resetData() {
            this.resetCoreForm();
            this.bandList = []
            this.band = []
            this.bandCheckList = []
            this.resetList()
        },
        showEditFband() {
            this.setFbandData()
            this.dialogFormVisibleFband = true;
        },
        setFbandData() {
            if (this.coreForm.xtype === this.$store.state.XTYPE_FDD) {
                this.bandList = this.fddBandList
            } else if (this.coreForm.xtype === this.$store.state.XTYPE_TDD) {
                this.bandList = this.tddBandList
            } else if (this.coreForm.xtype === this.$store.state.XTYPE_GSM) {
                this.bandList = this.gsmBandList
            }
        },
        setFband() {
            this.band = []
            this.coreForm.fband = ''
            this.bandList.forEach(item => {
                if (item.checked) {
                    if (this.coreForm.fband === '') {
                        this.coreForm.fband += this.getFbandStr(item.band, item.start, item.end)
                    } else {
                        this.coreForm.fband += ',' + this.getFbandStr(item.band, item.start, item.end)
                    }
                }
            })
            this.band = this.coreForm.fband.split(',');
            this.dialogFormVisibleFband = false;

        },
        getFbandStr(band, start, end) {
            return band + ':' + start + "-" + end
        },
        showEditDialog(core) {
            this.title = "修改核心板";
            this.setEditData(core)
            this.dialogFormVisible = true;
        },

        setEditData(core) {
            this.coreForm = core
            this.disabled = true;
            this.bandCheckList = []
            //获取厂家信息
            this.getManufactors()
            //获取功放信息
            this.getAllpa()

            this.setFbandData()
            this.band = this.coreForm.fband.split(',');

            if (this.band) {
                for (var i = 0; i < this.band.length; i++) {

                    var tmp1 = this.band[i].split(":");
                    var tmp2 = tmp1[1].split("-");

                    var band = tmp1[0];
                    var start = tmp2[0];
                    var end = tmp2[1];

                    for (var j = 0; j < this.bandList.length; j++) {
                        if (this.bandList[j].band == band) {
                            this.bandCheckList.push(band)
                            this.bandList[j].start = start
                            this.bandList[j].end = end
                            this.bandList[j].checked = true
                            break;
                        }
                    }
                }
            }
        },

        async addOrEditCore(formName) {
            var formVal = this.util.checkForm(this, formName);
            if (!formVal) {
                return;
            }

            if (this.title == '增加核心板') {
                const res = await this.jsp("/coreBoard.do?method=add", this.coreForm);
                const {
                    msg,
                    success,
                } = res;
                if (success) {
                    this.getCoreList()
                    this.$message.success(msg);
                } else {
                    this.$message.error(msg);
                }
            } else {
                const res = await this.jsp("/coreBoard.do?method=update", this.coreForm);
                const {
                    msg,
                    success,
                } = res;
                if (success) {
                    this.getCoreList()
                    this.$message.success(msg);
                } else {
                    this.$message.error(msg);
                }
            }

            this.dialogFormVisible = false;
        },
        showPaEdit(paId) { },
        refreshCores() {
            this.getCoreList()
        },
        reboot(core) {
            this.$confirm("是否重启核心板: " + core.name, "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.rebootCore(core.id);
                })
                .catch(() => {
                    this.$message.info("已取消重启");
                });


        },
        async rebootCore(id) {
            const res = await this.jsp("/coreBoard.do?method=restart", { id: id });
            const {
                msg,
                success,
            } = res;
            if (success) {
                this.getCoreList()
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
        },
        cfgRf(core, zb) {
            if (core.extraInfo.rfStatus == 1) {
                this.openRf(core, zb)
            } else {
                this.closeRf(core, zb)
            }
        },
        cfgGsmRf(onOff, core, zb) {
            if (core.extraInfo.rfStatus == 1) {
                this.openRf(core, zb)
            } else {
                this.closeRf(core, zb)
            }
        },
        async openRf(core, zb) {
            const res = await this.jsp("/coreBoard.do?method=openRf", { ip: core.ip, zb: zb });
            const {
                msg,
                success,
            } = res;
            if (success) {
                this.getCoreList()
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
        },
        async closeRf(core, zb) {
            const res = await this.jsp("/coreBoard.do?method=closeRf", { ip: core.ip, zb: zb });
            const {
                msg,
                success,
            } = res;
            if (success) {
                this.getCoreList()
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
        },

        async getManufactors() {
            if (this.manufactors.length > 0) {
                return
            }
            const res = await this.jsp("/coreBoard.do?method=queryAllManufactor");
            const {
                msg,
                success,
                results
            } = res;
            if (success) {
                var defaultItem = new Object();
                var data = eval(results);
                for (var key in data) {
                    var defaultItem = new Object();
                    defaultItem.codeValue = key;
                    defaultItem.codeValue = Number(defaultItem.codeValue)
                    defaultItem.manuFactorName = data[key];
                    this.manufactors.push(defaultItem);
                }
            } else {
                this.$message.error(msg);
            }
        },
        async getAllpa() {
            if (this.paAddress.length > 0) {
                return
            }
            const res = await this.jsp("/coreBoard.do?method=queryAllPaAddress");
            const {
                msg,
                success,
                results
            } = res;
            if (success) {
                var defaultItem = new Object();
                var data = eval(results);
                for (var key in data) {
                    var defaultItem = new Object();
                    defaultItem.codeValue = key;
                    defaultItem.codeValue = Number(defaultItem.codeValue)
                    defaultItem.manuFactorName = data[key];
                    this.paAddress.push(defaultItem);
                }
            } else {
                this.$message.error(msg);
            }
        },
        async getCoreList() {
            const res = await this.jsp("/coreBoard.do?method=search", {
                _dc: 1567652704564,
                page: this.pagenum,
                start: (this.pagenum - 1) * this.pagesize,
                limit: this.pagesize
            });
            const {
                msg,
                success,
                results
            } = res;
            if (success) {
                this.coreList = results;
                this.total = results.length;
            } else {
                this.$message.error(msg);
            }
        },
        showDel(core) {
            this.$confirm("删除核心板?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.delCore(core);
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },
        async delCore(core) {
            const res = await this.jsp("/coreBoard.do?method=delete", { id: core.id });
            const {
                msg,
                success,
            } = res;
            if (success) {
                this.getCoreList()
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
        },
        manufactorChange(value) {
            this.resetData()
            this.coreForm.manufactor = value
        },
        handleCheckChange(item) {
            item.checked = !item.checked
        },
        resetCoreForm() {
            this.coreForm = {
                manufactor: '',
                id: '',
                name: '',
                boardType: '',
                xtype: -1,
                ip: '',
                maxOutputpower: '',
                scanType: 0,
                scanOrNot: 0,
                usePowerFlag: 0,
                relateWay: -1,
                paId: -1,
                fband: '',
            }
        },
        showAddPa() {

        },
        showSetParams(core) {
            this.dialogStsVisible = true

            this.$nextTick(() => {
                this.$refs.stsPatam.init(core)
            })
        },
    },
    data() {
        return {
            //page
            total: -1,
            pagenum: 1,
            pagesize: 50,

            title: "",
            disabled: false,
            dialogFormVisible: false,

            //参数
            dialogStsVisible: false,

            dialogFormVisibleFband: false,
            coreList: [],
            manufactors: [],
            paAddress: [],
            //表单校验

            rules: {
                name: [
                    { required: true, message: "请输入核心板名称", trigger: "blur" },
                    { min: 0, max: 50, message: "最多50个字符" }
                ],
                maxOutputpower: [
                    { required: true, message: "请输入最大输出功率", trigger: "blur" },
                    { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" },
                ],
                ip: [
                    { required: true, message: "请输入ip", trigger: "blur" },
                    { pattern: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/, message: "请输入正确ip" },
                ],
            },
            bandCheckList: [],
            coreForm: {
                manufactor: '',
                id: '',
                name: '',
                boardType: '',
                xtype: -1,
                ip: '',
                maxOutputpower: '',
                scanType: 0,
                scanOrNot: 0,
                usePowerFlag: 0,
                relateWay: -1,
                paId: -1,
                fband: '',
            },
            band: []
        };
    }
};