export default {
    created() {
        this.getPowerList()
    },
    methods: {
        //分页
        handleSizeChange(val) {
            this.pagesize = val;
            this.pagenum = 1;
            this.getPowerList();
        },
        handleCurrentChange(val) {
            this.pagenum = val;
            this.getPowerList();
        },

        showDialog() {
            this.title = '添加功放'

            this.dialogFormVisible = true

            this.$nextTick(() => {
                this.$refs.powerWin.init(null)
            })

        },

        showEditDialog(power) {
            this.title = '修改功放'

            this.dialogFormVisible = true

            this.$nextTick(() => {
                this.$refs.powerWin.init(power)
            })
        },

        showDel(power) {
            this.$confirm("删除功放?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.delPower(power.id);
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },

        async delPower(id) {
            const res = await this.jsp("/pa.do?method=deletePa", { id: id });
            const {
                msg,
                success,
            } = res;
            if (success) {
                this.getPowerList()
                this.$message.success(msg);
            } else {
                this.$message.error(msg);
            }
        },

        handleSelectionChange() { },
        switchPower(power) { },

        refreshPower() {
            this.getPowerList()
        },
        async getPowerList() {
            const res = await this.jsp("/pa.do?method=searchPa", {
                _dc: 1567652704564,
                page: this.pagenum,
                start: (this.pagenum - 1) * this.pagesize,
                limit: this.pagesize
            });
            const {
                //对象解构赋值
                msg,
                success,
                results
            } = res;
            if (success) {
                this.powerList = results;
                this.total = results.length;
            } else {
                this.$message.error(msg);
            }
        }
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
            powerList: [],


        }
    }
}