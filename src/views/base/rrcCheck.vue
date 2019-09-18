<template>
  <el-card class="box-card">
    <el-row class="search">
      <el-col>
        <el-button plain @click="showDialog()" type="success">添加RRC检测</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="500px" :data="rrcList" style="width: 100%">
      <el-table-column type="index" width="30"></el-table-column>
      <el-table-column prop="time" label="生效时段（时:分）" width="140">
        <template slot-scope="scope">
          <span>{{'['+scope.row.valid_starttime}}</span>-
          <span>{{scope.row.valid_endtime+']'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="rrc_check_time_interval" label="RRC检测间隔（分钟）" width="170"></el-table-column>
      <el-table-column prop="rrc_success_rate_lower_limit" label="RRC成功率的下限阈值（%）"></el-table-column>
      <el-table-column prop="rrc_success_rate_lower_appear_count" label="RRC成功率连续低于下限阈值达?次，则重启核心板"></el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showEditDialog(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="showDel(scope.row)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      @open="openDialog('rrcForm')"
      style=" margin-top: 100px;"
      :title="title"
      :visible.sync="dialogRRCWinVisible"
      width="740px"
      append-to-body
    >
      <el-form
        class="form"
        label-width="240px"
        :model="rrcForm"
        status-icon
        :rules="rules"
        ref="rrcForm"
      >
        <el-form-item label="生效时段（时:分）">
          <el-col :span="12">
            <el-form-item prop="valid_starttime">
              <el-time-select
                v-model="rrcForm.valid_starttime"
                :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:45'
                }"
                placeholder="起始时间"
              ></el-time-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="valid_endtime">
              <el-time-select
                v-model="rrcForm.valid_endtime"
                :picker-options="{
                    start: '00:00',
                    step: '00:15',
                    end: '23:45'
                }"
                placeholder="结束时间"
              ></el-time-select>
            </el-form-item>
          </el-col>
        </el-form-item>
        <el-form-item label="RRC检测间隔（分钟）" prop="rrc_check_time_interval">
          <el-input-number
            style="width: 100%;"
            placeholder="请输入RRC检测间隔"
            :precision="0"
            :step="1"
            v-model="rrcForm.rrc_check_time_interval"
            controls-position="right"
            :min="1"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="RRC成功率的下限阈值（%）" prop="rrc_success_rate_lower_limit">
          <el-input-number
            style="width: 100%;"
            placeholder="请输入RRC成功率的下限阈值"
            :precision="0"
            :step="1"
            v-model="rrcForm.rrc_success_rate_lower_limit"
            controls-position="right"
            :min="1"
            :max="100"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="RRC成功率连续低于下限阈值达" prop="rrc_success_rate_lower_appear_count">
          <el-col :span="18">
            <el-input-number
              style="width: 100%;"
              placeholder="请输入次数"
              :precision="0"
              :step="1"
              v-model="rrcForm.rrc_success_rate_lower_appear_count"
              controls-position="right"
              :min="1"
              :max="100"
            ></el-input-number>
          </el-col>
          <el-col :span="6">
            <span class="text">次，重启核心板</span>
          </el-col>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="dialogRRCWinVisible = false">取 消</el-button>
        <el-button size="medium" type="primary" icon="el-icon-folder" @click="cfgRRC('rrcForm')">保存</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  components: {},
  created() {
    this.getRrcList();
  },
  data() {
    return {
      dialogRRCWinVisible: false,
      rrcList: [],

      title: "",
      rrcForm: {},
      rules: {
        valid_starttime: [
          {
            // type: "date",
            required: true,
            message: "请选择起始时间",
            trigger: "change"
          }
        ],
        valid_endtime: [
          {
            // type: "date",
            required: true,
            message: "请选择结束时间",
            trigger: "change"
          }
        ],
        rrc_check_time_interval: [
          { required: true, message: "请输入RRC检测间隔", trigger: "blur" }
        ],
        rrc_success_rate_lower_limit: [
          {
            required: true,
            message: "请输入RRC成功率的下限阈值",
            trigger: "blur"
          }
        ],
        rrc_success_rate_lower_appear_count: [
          { required: true, message: "请输入次数", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    cfgRRC(formName) {
      var formVal = this.util.checkForm(this, formName);
      if (!formVal) {
        return;
      }

      if (this.title == "新增RRC检测") {
        this.addRRC();
      } else {
        this.editRRC();
      }

      this.dialogRRCWinVisible = false;
    },
    async addRRC() {
      const res = await this.jsp(
        "/rrcCheckCfgServlet.do?method=addRrc",
        this.rrcForm
      );
      const { msg, success } = res;
      if (success) {
        this.getRrcList();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async editRRC() {
      const res = await this.jsp(
        "/rrcCheckCfgServlet.do?method=updateRrc",
        this.rrcForm
      );
      const { msg, success } = res;
      if (success) {
        this.getRrcList();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },

    showDialog() {
      this.title = "新增RRC检测";
      this.dialogRRCWinVisible = true;
    },
    showEditDialog(rrc) {
      this.title = "修改RRC检测";
      this.rrcForm = this.util.getVal(rrc);
      this.dialogRRCWinVisible = true;
    },
    showDel(rrc) {
      this.$confirm("删除RRC检测?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delRRC(rrc.id);
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async delRRC(id) {
      const res = await this.jsp("/rrcCheckCfgServlet.do?method=deleteRrc", {
        id: id
      });
      const { msg, success } = res;
      if (success) {
        this.getRrcList();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async getRrcList() {
      const res = await this.jsp("/rrcCheckCfgServlet.do?method=queryRrc", {
        _dc: 1568790195569
      });
      const { msg, results, success } = res;
      if (success) {
        this.rrcList = results;
      } else {
        this.$message.error(msg);
      }
    },
    openDialog(formName) {
      this.resetForm(formName);
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
}
.form {
  margin: -8px auto;

  .line {
    text-align: center;
  }
  .text {
    margin-left: 4px;
  }
}

.dialog-footer {
  margin-top: -20px;
}
</style>