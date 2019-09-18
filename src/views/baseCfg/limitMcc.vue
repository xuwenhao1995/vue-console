<template>
  <el-card class="box-card">
    <el-row class="search">
      <el-col>
        <el-button plain @click="showDialog()" type="success">添加受限Mcc</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table height="500px" :data="mccList" style="width: 100%">
      <el-table-column type="index" width="30"></el-table-column>
      <el-table-column prop="mcc" label="MCC"></el-table-column>
      <el-table-column prop="countryRegion" label="国家/区域"></el-table-column>

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
    <mcc-win @reflash="getMccList" v-if="dialogMccWinVisible" ref="mccWin" />
  </el-card>
</template>

<script>
import MccWin from "../../views/base/mccWin.vue";
export default {
  components: {
    MccWin
  },
  created() {
    this.getMccList();
  },
  data() {
    return {
      dialogMccWinVisible: false,
      mccList: []
    };
  },
  methods: {
    showDialog() {
      this.dialogMccWinVisible = true;
      this.$nextTick(() => {
        this.$refs.mccWin.init("新增受限Mcc", null);
      });
    },
    showEditDialog(mcc) {
      this.dialogMccWinVisible = true;
      this.$nextTick(() => {
        this.$refs.mccWin.init("修改受限Mcc", mcc);
      });
    },
    showDel(mcc) {
      this.$confirm("删除受限Mcc?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.delMcc(mcc.mcc);
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },
    async delMcc(mcc) {
      const res = await this.jsp("/mcc.do?method=delLimitMcc", {
        mcc: mcc
      });
      const { msg, success } = res;
      if (success) {
        this.getMccList();
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async getMccList() {
      const res = await this.jsp("/mcc.do?method=findLimitMcc");
      this.mccList = res;
    }
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
}
</style>