<template>
  <div class="content">
    <el-row>
      <el-col class="left" :span="11">
        <el-card style="height: 350px;">
          <div slot="header" class="clearfix">
            <span style="font-size:20px">
              <b>设备运行状态</b>
            </span>
          </div>
          <el-row class="infoRow">
            <el-col :span="14">
              <span class="infoSpan" style="font-size:15px">CPU信息</span>
            </el-col>
            <el-col :span="10">
              <span class="infoSpan">{{info[0]}}</span>
            </el-col>
          </el-row>

          <el-row class="infoRow">
            <el-col :span="14">
              <span class="infoSpan" style="font-size:15px">内存信息</span>
            </el-col>
            <el-col :span="10">
              <span class="infoSpan">{{info[1]}}</span>
            </el-col>
          </el-row>

          <el-row class="infoRow">
            <el-col :span="14">
              <span class="infoSpan" style="font-size:15px">磁盘空间（剩余/总量）</span>
            </el-col>
            <el-col :span="10">
              <span class="infoSpan">{{info[2]}}</span>
            </el-col>
          </el-row>

          <el-row class="infoRow">
            <el-col :span="14">
              <span class="infoSpan" style="font-size:15px">设备当前时间</span>
            </el-col>
            <el-col :span="10">
              <span class="infoSpan">{{info[3]}}</span>
            </el-col>
          </el-row>

          <el-row class="infoRow">
            <el-col :span="14">
              <span class="infoSpan" style="font-size:15px">主服务器侦码上号离线总数</span>
            </el-col>
            <el-col :span="10">
              <span class="infoSpan">{{info[5]}}</span>
            </el-col>
          </el-row>

          <el-row class="infoRow">
            <el-col :span="14">
              <span class="infoSpan" style="font-size:15px">第二服务器侦码上号离线总数</span>
            </el-col>
            <el-col :span="10">
              <span class="infoSpan">{{info[6]}}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>

      <el-col class="middle" :span="2">
        <el-button @click="reflash()" icon="el-icon-refresh" circle></el-button>
      </el-col>

      <el-col class="right" :span="11">
        <el-card style="height: 350px;">
          <div slot="header" class="clearfix">
            <span style="font-size:20px">
              <b>版本信息</b>
            </span>
          </div>
          <el-row class="infoRow" v-for="(item, i) in version" :key="i">
            <el-col :span="10">
              <span class="infoSpan" style="font-size:15px">{{item.name}}</span>
            </el-col>
            <el-col :span="14">
              <span class="infoSpan">{{item.value}}</span>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  created() {
    this.getInfo();
  },
  data() {
    return {
      info: [],
      version: []
    };
  },
  methods: {
    reflash() {
      this.getInfo();
    },
    async getInfo() {
      const res = await this.jsp("/system.do?method=state");
      const { msg, success, results } = res;
      if (success) {
        this.info = results;
        this.version = [];

        results[4].forEach(item => {
          var defaultItem = new Object();
          var version = item.split("：");
          defaultItem.name = version[0];
          defaultItem.value = version[1];
          this.version.push(defaultItem);
        });

        this.version;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  height: 500px;

  .infoRow {
    margin-bottom: 30px;
    .infoSpan {
      font-size: 18px;
    }
  }

  .middle {
    text-align: center;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both;
  }
}
</style>