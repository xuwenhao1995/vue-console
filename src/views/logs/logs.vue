<template>
  <div class="content">
    <el-card class="card">
      <el-button
        @click="downloadCoreLog()"
        class="btn"
        icon="el-icon-download"
        type="primary"
      >下载主控日志</el-button>
      <el-button
        @click="downloadWifiLog()"
        class="btn"
        icon="el-icon-download"
        type="primary"
      >下载wifi日志</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    downloadCoreLog() {
      this.getLog();
      this.$alert("是否下载主控日志?", "主控日志", {
        confirmButtonText: "确定",
        type: "success",
        callback: async action => {
          this.getLog();
        }
      });
    },
    downloadWifiLog() {},
    async getLog() {
      const res = await this.$http("/system.do?method=downloadlog");
      const { msg, success } = res.data;
      if (success) {
        const url =
          this.$store.state.baseUrl +
          "/system.do?method=downloadlog&fileName=" +
          msg;
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "");
        document.body.appendChild(link);
        link.click();
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  height: 450px;
  .card {
    width: 500px;
    height: 200px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    .btn {
      margin-top: 60px;
    }
  }
}
</style>