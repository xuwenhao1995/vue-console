<template>
  <div class="login-wrap">
    <el-form class="login-form" label-position="top" label-width="80px" :model="formdata">
      <h2>控制台</h2>
      <el-form-item>
        <el-input placeholder="请输入用户名" prefix-icon="el-icon-user-solid" v-model="formdata.userId"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input
          prefix-icon="el-icon-lock"
          @keydown.enter.native="login()"
          v-model="formdata.password"
          show-password
        ></el-input>
      </el-form-item>
      <el-button @click="login()" class="login-btn" type="primary">登录</el-button>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      formdata: {
        userId: "",
        password: ""
      }
    };
  },
  methods: {
    async login() {
      //同步方式
      const res = await this.jsp("/user.do?method=loginVue", this.formdata);

      const {
        //对象解构赋值
        success,
        msg,
        results
      } = res;
      if (success) {
        //保存token值
        localStorage.setItem("token", results);
        this.$store.commit("setUserName", this.formdata.userId);

        this.$router.push({ name: "home" });
        //element 提示框
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script >

<style lang="scss" scoped>
.login-wrap { 
  height: 100%;
  background-color: #909399;
  // 弹性盒布局
  display: flex;
  justify-content: center;
  align-items: center;

  .login-form {
    width: 400px;
    background-color: #fff;
    border-radius: 5px;
    padding: 30px;

    h2 {
      text-align: center;
    }

    .login-btn {
      width: 100%;
    }
  }
}
</style>