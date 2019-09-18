<template>
  <el-card class="box-card">
    <el-row class="search">
      <el-col>
        <el-button plain @click="showDialog()" type="success">添加约束</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="500px" :data="signalList" style="width: 100%">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="fband" label="约束频段">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            style=" margin-top: 1px;"
            v-for="(item,i) in scope.row.fband.split(',')"
            :key="i"
          >{{item}}</el-tag>
        </template>
      </el-table-column>

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
        <el-button class="reflashBtn" @click="refresh()" icon="el-icon-refresh" circle size="mini"></el-button>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="1050px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
        <el-form-item label="名称" label-width="60px" prop="name">
          <el-input v-model="ruleForm.name" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>

      <el-row style=" margin-top: 10px;margin-left: 20px;">
        <el-checkbox-group v-model="bandCheckList">
          <el-col style="margin-top: 10px;" :span="12" v-for="(item, i) in bandList" :key="i">
            <el-checkbox
              @change="handleCheckChange(item)"
              :indeterminate="item.checked"
              style=" margin-right: 10px;width: 80px;"
              :label="item.band"
            >{{item.str}}</el-checkbox>
            <el-input-number
              :disabled="!item.checked"
              :precision="0"
              :step="1"
              style=" margin-right: 10px;"
              v-model="item.start"
              controls-position="right"
              :min="item.min"
              :max="item.max"
            ></el-input-number>
            <el-input-number
              :precision="0"
              :step="1"
              :disabled="!item.checked"
              controls-position="right"
              v-model="item.end"
              :min="item.min"
              :max="item.max"
            ></el-input-number>
          </el-col>
        </el-checkbox-group>
      </el-row>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEdit('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import fbands from "./fbands-mixins.js";
export default {
  mixins: [fbands],
  created() {
    this.getSignalList();
  },
  data() {
    return {
      //page
      total: -1,
      pagenum: 1,
      pagesize: 50,

      title: "",
      dialogFormVisible: false,

      band: [],
      bandCheckList: [],
      bandList: [],
      ruleForm: {},
      signalList: [],
      rules: {
        name: [
          { required: true, message: "请输入名称", trigger: "blur" },
          { min: 0, max: 50, message: "最多50个字符" }
        ]
      }
    };
  },
  methods: {
    //分页
    handleSizeChange(val) {
      this.pagesize = val;
      this.pagenum = 1;
      this.getUserList();
    },
    handleCurrentChange(val) {
      this.pagenum = val;
      this.getUserList();
    },

    setFbandData() {
      this.bandList = [];
      this.bandList.push(...this.fddBandList);
      this.bandList.push(...this.tddBandList);
      this.bandList.push(...this.gsmBandList);
    },

    setEditData(signalChannel) {
      this.ruleForm = signalChannel;
      this.bandCheckList = [];
      this.setFbandData();
      this.band = this.ruleForm.fband.split(",");

      if (this.band) {
        for (var i = 0; i < this.band.length; i++) {
          var tmp1 = this.band[i].split(":");
          var tmp2 = tmp1[1].split("-");

          var band = tmp1[0];
          var start = tmp2[0];
          var end = tmp2[1];

          for (var j = 0; j < this.bandList.length; j++) {
            if (this.bandList[j].band == band) {
              this.bandCheckList.push(band);
              this.bandList[j].start = start;
              this.bandList[j].end = end;
              this.bandList[j].checked = true;
              break;
            }
          }
        }
      }
    },

    showDialog() {
      this.title = "添加信号通道约束";
      this.setFbandData();
      this.dialogFormVisible = true;
    },

    showEditDialog(signalChannel) {
      this.title = "修改信号通道约束";
      this.setEditData(signalChannel);
      this.dialogFormVisible = true;
    },

    showDel(signalChannel) {
      this.$confirm("删除信号通道约束?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delChannel(signalChannel);
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async delChannel(signalChannel) {
      const res = await this.jsp("/signalChannel.do?method=delete", {
        id: signalChannel.id
      });
      const { msg, success } = res;
      if (success) {
        this.getSignalList();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },

    handleCheckChange(item) {
      item.checked = !item.checked;
    },

    setFband() {
      this.ruleForm.fband = "";
      this.bandList.forEach(item => {
        if (item.checked) {
          if (this.ruleForm.fband === "") {
            this.ruleForm.fband += this.getFbandStr(
              item.band,
              item.start,
              item.end
            );
          } else {
            this.ruleForm.fband +=
              "," + this.getFbandStr(item.band, item.start, item.end);
          }
        }
      });
    },

    getFbandStr(band, start, end) {
      return band + ":" + start + "-" + end;
    },

    async addOrEdit(ruleForm) {
      var formVal = this.util.checkForm(this, ruleForm);
      if (!formVal) {
        return;
      }

      if (this.bandCheckList.length < 2) {
        this.util.showMsg(this, "请至少选择两个频段");
        return;
      }

      this.setFband();

      if (this.title == "添加信号通道约束") {
        const res = await this.jsp(
          "/signalChannel.do?method=add",
          this.ruleForm
        );
        const { msg, success } = res;
        if (success) {
          this.getSignalList();
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      } else {
        const res = await this.jsp(
          "/signalChannel.do?method=update",
          this.ruleForm
        );
        const { msg, success } = res;
        if (success) {
          this.getSignalList();
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      }

      this.dialogFormVisible = false;
    },
    refresh() {
      this.getSignalList();
    },
    async getSignalList() {
      const res = await this.jsp("/signalChannel.do?method=search", {
        _dc: 1567652704564,
        page: this.pagenum,
        start: (this.pagenum - 1) * this.pagesize,
        limit: this.pagesize
      });
      const { msg, success, results } = res;
      if (success) {
        this.signalList = results;
        this.total = results.length;
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