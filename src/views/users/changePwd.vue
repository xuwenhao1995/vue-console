<template>
  <div class="content">
    <el-card class="card">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" label-width="100px" prop="userName">
          <el-input :disabled="true" v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="原密码" label-width="100px" prop="oldPassword">
          <el-input v-model="ruleForm.oldPassword" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px" prop="password">
          <el-input v-model="ruleForm.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码" label-width="100px" prop="password2">
          <el-input v-model="ruleForm.password2" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="resetBtn" type="primary" @click="resetPwd('ruleForm')">修改密码</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUser();
  },

  methods: {
    async resetPwd(formName) {
      var formVal = true;
      this.$refs[formName].validate(valid => {
        if (!valid) {
          formVal = false;
          this.$alert("请输入正确内容", "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {}
          });
        }
      });
      if (!formVal) {
        return;
      }
      const res = await this.jsp("/user.do?method=changePwd", this.ruleForm);
      const { msg, success } = res;
      if (success) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
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
        this.ruleForm = results;
        this.ruleForm.password = "";
      } else {
        this.$message.error(msg);
      }
    }
  },
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
      ruleForm: {
        userName: "",
        oldPassword: "",
        password: "",
        password2: ""
      },
      //表单校验

      rules: {
        oldPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { pattern: /^[0-9a-zA-Z]*$/, message: "只能输入字母或数字" },
          { min: 6, max: 15, message: "密码长度6到15位" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { pattern: /^[0-9a-zA-Z]*$/, message: "只能输入字母或数字" },
          { min: 6, max: 15, message: "密码长度6到15位" }
        ],
        password2: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { pattern: /^[0-9a-zA-Z]*$/, message: "只能输入字母或数字" },
          { min: 6, max: 15, message: "密码长度6到15位" },
          { validator: validatePass, trigger: "blur" }
        ]
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 500px;
  .card {
    width: 500px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .resetBtn {
      margin-left: 200px;
    }
  }
}
</style>