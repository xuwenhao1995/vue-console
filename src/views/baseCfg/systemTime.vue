<template>
  <div class="content">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">设备时间</span>
        <el-button @click="setTime()" style="float: right; padding: 3px 0" type="text">设置</el-button>
      </div>

      <el-row>
        <el-col :span="8">
          <span>设备当前时间:</span>
        </el-col>
        <el-col :span="16">
          <span>{{currentTime}}</span>
        </el-col>
      </el-row>

      <el-row class="bottom">
        <el-col :span="8">
          <span>修改设备时间:</span>
        </el-col>
        <el-col :span="16">
          <el-date-picker
            :disabled="checked"
            v-model="dateTime"
            :editable="false"
            :clearable="false"
            type="datetime"
            placeholder="选择日期时间"
            :default-value="new Date()"
          ></el-date-picker>
          <el-checkbox v-model="checked">与计算机时间同步</el-checkbox>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
let moment = require("moment");
export default {
  created() {
    this.id = setInterval(() => {
      this.getCurrentTime();
    }, 1000);
  },
  destroyed() {
    clearInterval(this.id);
  },
  data() {
    return {
      currentTime: "",
      dateTime: new Date(),
      checked: false,
      id: -1
    };
  },
  methods: {
    async setTime() {
      this.dateTime = this.checked
        ? moment(new Date()).format("YYYY-MM-DD HH:mm:ss")
        : moment(this.dateTime).format("YYYY-MM-DD HH:mm:ss");

      const res = await this.jsp("/systemTime/save.do?", {
        dateTime: this.dateTime
      });
      const { msg, success } = res;
      if (success) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async getCurrentTime() {
      const res = await this.jsp("/systemTime/findTime.do");
      const { msg, success } = res;
      if (success) {
        this.currentTime = msg;
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
    width: 850px;
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