<template>
  <div class="content">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">设备信息</span>
        <el-button @click="showEdit()" style="float: right; padding: 3px 0" type="text">修改</el-button>
      </div>

      <el-row>
        <el-col :span="12">
          <span>设备ID:</span>
        </el-col>
        <el-col :span="12">
          <span>{{device.deviceId }}</span>
        </el-col>
      </el-row>

      <el-row class="bottom">
        <el-col :span="12">
          <span>设备类型:</span>
        </el-col>
        <el-col :span="12">
          <span>{{device.deviceTypeString }}</span>
        </el-col>
      </el-row>
    </el-card>

    <project-set v-if="dialogFormVisible" ref="projectSet" />
  </div>
</template>

<script>
import ProjectSet from "./projectSet.vue";

export default {
  components: {
    ProjectSet
  },
  created() {
    this.getDeviceInfo();
  },
  data() {
    return {
      dialogFormVisible: false,
      device: {}
    };
  },
  methods: {
    showEdit() {
      this.dialogFormVisible = true;

      this.$nextTick(() => {
        this.$refs.projectSet.init("修改设备信息");
      });
    },
    async getDeviceInfo() {
      const res = await this.jsp("/projectCfg.do?method=queryDeviceInfo");
      const { msg, success, results } = res;
      if (success) {
        this.device = {};
        this.device = JSON.parse(results);
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

  .box-card {
    margin: 0 auto;
    margin-top: 30px;
    width: 450px;
    height: 250px;

    .title {
      font-weight: bold;
    }

    .bottom {
      margin-top: 20px;
    }

    .text {
      margin-top: 10px;
    }
  }
}
</style>