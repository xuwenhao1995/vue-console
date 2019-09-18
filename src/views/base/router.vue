<template>
  <el-card class="box-card">
    <el-form class="form" :rules="rules" :model="routerForm" ref="routerForm">
      <el-form-item prop="ip">
        <el-input width="60%" placeholder="请输入IP" v-model="routerForm.ip">
          <el-button @click="ping('routerForm')" slot="append">ping</el-button>
        </el-input>
      </el-form-item>
    </el-form>

    <div
      class="loading"
      v-loading="loading"
      element-loading-text="拼命加载中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <span class="result" v-for="item in routerResult" :key="item">
        {{item}}
        <br />
      </span>
    </div>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      routerForm: {},
      loading: false,
      routerResult: [],
      rules: {
        ip: [
          { required: true, message: "请输入ip", trigger: "blur" },
          {
            pattern: /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/,
            message: "请输入正确ip"
          }
        ]
      }
    };
  },
  methods: {
    async ping(formName) {
      this.routerResult = [];

      var formVal = this.util.checkForm(this, formName);
      if (!formVal) {
        return;
      }

      this.loading = true;

      const res = await this.jsp("/router.do?method=ping", this.routerForm);
      const { msg, success, results } = res;
      if (success) {
        this.loading = false;
        this.routerResult = results;
      } else {
        this.loading = false;
        this.util.showMsg(this, msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 500px;
  width: 550px;
  margin: 0 auto;
  text-align: center;

  .form {
    margin-top: 50px;
  }

  .loading {
    width: 100%;
    margin-top: 10px;
    text-align: left;
  }

  .result {
    font-family: "微软雅黑"
  }
}
</style>