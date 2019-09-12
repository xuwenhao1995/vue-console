export default {
    data() {
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请再次输入密码"));
            } else if (value !== this.ruleForm.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            //page
            total: -1,
            pagenum: 1,
            pagesize: 50,

            userList: [],
            multipleSelection: [], //被选中的
            title: "",
            disabled: false,

            dialogFormVisible: false,
            dialogFormVisibleRol: false,
            ruleForm: {
                userUUID: "",
                userName: "",
                realName: "",
                password: "",
                secondPassword: "",
                status: "",
                remark: ""
            },
            //表单校验

            rules: {
                userName: [
                    { required: true, message: "请输入用户名", trigger: "blur" },
                    { pattern: /^[0-9a-zA-Z]*$/, message: "只能输入字母或数字" },
                    { min: 0, max: 32, message: "最多32个字符" }
                ],
                realName: [{ min: 0, max: 50, message: "最多50个字符" }],
                password: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { pattern: /^[0-9a-zA-Z]*$/, message: "只能输入字母或数字" },
                    { min: 6, max: 15, message: "密码长度6到15位" }
                ],
                secondPassword: [
                    { required: true, message: "请输入密码", trigger: "blur" },
                    { pattern: /^[0-9a-zA-Z]*$/, message: "只能输入字母或数字" },
                    { min: 6, max: 15, message: "密码长度6到15位" },
                    { validator: validatePass, trigger: "blur" }
                ],
                status: [
                    { required: true, message: '请选择用户状态', trigger: 'change' }
                ],
                remark: [{ min: 0, max: 120, message: "最多120个字符" }],
            }
        };
    },
    created() {
        this.getUserList();
    },
    methods: {
        //分页
        handleSizeChange(val) {
            this.pagesize = val;
            this.pagenum = 1;
            this.getUserList();
        },
        handleCurrentChange(val) {
            this.pagenum = val;
            this.getUserList();
        },

        showDialog() {
            this.title = "增加用户";
            this.ruleForm = {};
            this.disabled = false;
            this.dialogFormVisible = true;
        },
        showEditDialog(user) {
            this.title = "修改用户";
            this.ruleForm = user;
            this.disabled = true;
            this.dialogFormVisible = true;
        },
        showDel(userId) {
            this.$confirm("删除用户?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(() => {
                    this.delUser(userId);
                })
                .catch(() => {
                    this.$message.info("已取消删除");
                });
        },

        handleSelectionChange(val) {
            this.multipleSelection = val;
        },

        delUsers() {
            var ids = [];
            this.multipleSelection.forEach((item, i) => {
                ids.push(item.userUUID);
            });
            this.delUser(ids.join(","));
        },

        resetPwd(user) {
            this.$confirm("确定对该用户的密码重置为：123456？", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            })
                .then(async () => {
                    const res = await this.jsp("/user.do?method=resetPwd", {
                        userName: user.userName
                    });
                    const {
                        msg,
                        success
                    } = res;
                    if (success) {
                        this.$message.success(msg);
                        this.getUserList();
                    } else {
                        this.$message.error(msg);
                    }
                })
                .catch(() => {
                });
        },

        async delUser(userId) {
            const res = await this.jsp("/user.do?method=delete", {
                userUUIDs: userId
            });
            const {
                //对象解构赋值
                msg,
                success
            } = res;
            if (success) {
                this.$message.success(msg);
                this.getUserList();
            } else {
                this.$message.error(msg);
            }
        },

        async addOrEditUser(formName) {
            var formVal = true
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                    formVal = false
                    this.$alert("请输入正确内容", "提示", {
                        confirmButtonText: "确定",
                        type: 'warning',
                        callback: action => {
                        }
                    });
                }
            });
            if (!formVal) {
                return
            }
            if (this.title === "修改用户") {
                const res = await this.jsp("/user.do?method=update", this.ruleForm);
                const {
                    //对象解构赋值
                    msg,
                    success
                } = res;
                if (success) {
                    this.$message.success(msg);
                    this.getUserList();
                } else {
                    this.$message.error(msg);
                }
                this.dialogFormVisible = false;
            } else {
                const res = await this.jsp("/user.do?method=register", this.ruleForm);
                const {
                    //对象解构赋值
                    msg,
                    success
                } = res;
                if (success) {
                    this.$message.success(msg);
                    this.getUserList();
                } else {
                    this.$message.error(msg);
                }
                this.dialogFormVisible = false;
            }
        },

        refreshUsers() {
            this.getUserList()
        },

        async getUserList() {
            const res = await this.jsp("/user.do?method=queryAllUser", {
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
                this.userList = results;
                this.total = results.length;
            } else {
                this.$message.error(msg);
            }
        }
    }
};