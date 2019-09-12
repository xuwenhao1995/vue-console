<template>
  <el-dialog
    style=" margin-top: 100px;"
    :title="title"
    :visible.sync="dialogVisible"
    width="50%"
    append-to-body
  >
    <el-form
      class="form"
      label-width="180px"
      :model="plmnForm"
      status-icon
      :rules="rules"
      ref="plmnForm"
    >
      <el-form-item label="MCC 移动设备国家代码" prop="mcc">
        <el-select @change="changeMcc()" style="width:50%" v-model="plmnForm.mcc" placeholder="请选择">
          <el-option
            v-for="item in mccList"
            :key="item.value"
            :label="item.countryRegion"
            :value="item.mcc"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="MNC 移动设备网络代码" prop="mnc">
        <el-select
          style="width:100%"
          :multiple="ismultiple"
          v-model="plmnForm.mnc"
          placeholder="请选择"
        >
          <el-option
            v-for="item in mncList"
            :key="item.value"
            :label="item.operator"
            :value="item.mnc"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
      <el-button
        size="medium"
        type="primary"
        icon="el-icon-folder"
        @click="updatePlmn('plmnForm')"
      >保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      dialogVisible: false,
      ismultiple: true,
      xtype: -1,
      mncList: [],
      mccList: [],
      plmnForm: {
        mcc: "",
        mnc: []
      },
      rules: {
        mcc: [
          {
            required: true,
            message: "请选择mcc",
            trigger: "change"
          }
        ],
        mnc: [
          {
            required: true,
            message: "请选择mnc",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
    initPlmn(xtype, mcc, mnc) {
      this.xtype = xtype;
      if (
        xtype == this.$store.state.TDD_LTE ||
        xtype == this.$store.state.FDD_LTE
      ) {
        this.ismultiple = true;
      } else {
        this.ismultiple = false;
      }
      this.getMccList();
      this.getMncList(mcc, mnc);

      this.plmnForm.mcc = mcc;

      this.title = "MCC, MNC设置";

      this.dialogVisible = true;
    },
    initPlmnForm() {
      this.plmnForm = {
        mcc: "",
        mnc: []
      };
    },
    initMnc(mnc) {
      var records = mnc.split(",");
      this.plmnForm.mnc = [];

      this.mncList.forEach(item => {
        records.forEach(record => {
          if (record == item.mnc) {
            this.plmnForm.mnc.push(record);
          }
        });
      });
    },
    async getMccList() {
      const res = await this.jsp("/mcc.do?method=find", { _dc: 1568086921174 });
      this.mccList = res;
    },
    async getMncList(mcc, mnc) {
      const res = await this.jsp("/mnc/find.do?_dc=1568086921174", {
        mcc: mcc,
        type: 1,
        xtype: this.xtype
      });

      this.mncList = res;

      this.initMnc(mnc);
    },
    changeMcc() {
      var mnc = this.plmnForm.mnc.join(",");
      this.getMncList(this.plmnForm.mcc, mnc);
    },
    updatePlmn(plmnFormName) {
      var formVal = true;
      this.$refs[plmnFormName].validate(valid => {
        if (!valid) {
          formVal = false;
          this.$alert("请输入正确内容", "提示", {
            confirmButtonText: "确定",
            type: "warning",
            callback: action => {}
          });
        }
      });
      if (!formVal) {
        return;
      }
      var mcc = this.plmnForm.mcc;
      var mnc = this.plmnForm.mnc.join(",");
      this.$emit("plmn", mcc, mnc);

      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.form {
  margin: -8px auto;
}

.dialog-footer {
  margin-top: -40px;
}
</style>