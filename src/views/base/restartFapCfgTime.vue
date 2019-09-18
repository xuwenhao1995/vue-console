<template>
  <div class="content">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="title">核心板定时重启</span>
        <el-button @click="cfgTime()" style="float: right; padding: 3px 0" type="text">保存</el-button>
      </div>

      <el-row>
        <el-col :span="24">
          <el-checkbox @change="changeFlag" v-model="useFlag">核心板每隔</el-checkbox>
          <el-input-number
            placeholder="请输入天数"
            :disabled="disuseFlag"
            :precision="0"
            :step="1"
            v-model="days"
            controls-position="right"
            :min="0"
          ></el-input-number>
          <span class="text">天的</span>
          <el-time-select
            :disabled="disuseFlag"
            v-model="time"
            :picker-options="{
                    start: '00:00',
                    step: '00:05',
                    end: '23:55'
                }"
            placeholder="时间"
          ></el-time-select>
          <span class="text">重启</span>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getCfgTime();
  },
  data() {
    return {
      disuseFlag: true,
      useFlag: 0,
      days: 0,
      time: ""
    };
  },
  methods: {
    changeFlag(val) {
      this.disuseFlag = !val;
    },
    async cfgTime() {
      if (this.days == undefined) {
        this.util.showMsg(this, "请输入天数");
        return;
      }
      if (this.time == undefined) {
        this.util.showMsg(this, "请选择时间");
        return;
      }
      var flag = this.useFlag ? 1 : 0;
      this.time = this.time + ":00";

      const res = await this.jsp(
        "/coreBoard.do?method=editFapAutoRestartTime",
        {
          useFlag: flag,
          days: this.days,
          time: this.time
        }
      );
      const { msg, success } = res;
      if (success) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async getCfgTime() {
      const res = await this.jsp(
        "/coreBoard.do?method=queryFapAutoRestartTime"
      );
      const { msg, success, results } = res;
      if (success) {
        this.useFlag = results.useFlag == 1;
        if (this.useFlag) {
          this.disuseFlag = false;
        } else {
          this.disuseFlag = true;
        }
        this.days = results.days;
        this.time = results.time;
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
    width: 650px;
    height: 200px;

    .title {
      font-weight: bold;
    }

    .bottom {
      margin-top: 20px;
    }

    .text {
      margin-left: 3px;
    }
  }
}
</style>