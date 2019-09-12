<template>
  <el-card class="box-card">
    <el-row class="search">
      <el-col>
        <el-date-picker
          v-model="startTime"
          :editable="false"
          :clearable="false"
          align="right"
          type="date"
          placeholder="选择开始日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <span>-</span>
        <el-date-picker
          v-model="endTime"
          :editable="false"
          :clearable="false"
          align="right"
          type="date"
          placeholder="选择结束日期"
          :picker-options="pickerOptions"
        ></el-date-picker>
        <el-button @click="search()" icon="el-icon-search" type="primary" plain>查询</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="500px" :data="alarmLogList" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column width="300px" prop="messageResource" label="告警源"></el-table-column>
      <el-table-column width="800px" prop="message" label="告警消息"></el-table-column>
      <el-table-column prop="creationTime" label="告警时间">
        <template slot-scope="scope">{{scope.row.creationTime | fmtdate}}</template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-row class="page-row" :gutter="20">
      <el-col :span="9">
        <el-pagination
          class="pagination"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagenum"
          :page-sizes="[10,50]"
          :page-size="pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </el-col>
      <el-col :span="15">
        <el-button
          class="reflashBtn"
          @click="getAlarmLogList()"
          icon="el-icon-refresh"
          circle
          size="mini"
        ></el-button>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
let moment = require("moment");
export default {
  created() {
    this.getAlarmLogList();
  },
  data() {
    return {
      //page
      total: -1,
      pagenum: 1,
      pagesize: 50,
      startTime: moment(
        moment(new Date()).format("YYYY-MM-DD") + " " + "00:00:00"
      ).format("YYYY-MM-DD HH:mm:ss"),
      endTime: moment(
        moment(new Date()).format("YYYY-MM-DD") + " " + "23:59:59"
      ).format("YYYY-MM-DD HH:mm:ss"),

      alarmLogList: [],

      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "昨天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "一周前",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getAlarmLogList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getAlarmLogList();
    },

    search() {
      this.startTime = this.getStartTime();
      this.endTime = this.getEndTime();
      this.getAlarmLogList();
    },

    getStartTime() {
      return moment(
        moment(this.startTime).format("YYYY-MM-DD") + " " + "00:00:00"
      ).format("YYYY-MM-DD HH:mm:ss");
    },

    getEndTime() {
      return moment(
        moment(this.endTime).format("YYYY-MM-DD") + " " + "23:59:59"
      ).format("YYYY-MM-DD HH:mm:ss");
    },

    async getAlarmLogList() {
      const res = await this.jsp("/alarmLog/find.do?", {
        _dc: 1567652704564,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.pagenum,
        start: (this.pagenum - 1) * this.pagesize,
        limit: this.pagesize
      });
      const { msg, success, results, total } = res;
      if (success) {
        this.alarmLogList = results;
        this.total = total;
      } else {
        this.$message.error(msg);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;

  .dialog-footer {
    margin-top: -20px;
  }

  .page-row {
    margin-top: 10px;
    .reflashBtn {
      margin-left: -10px;
      margin-top: 4px;
    }
  }
}
</style>