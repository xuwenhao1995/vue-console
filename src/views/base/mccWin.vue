<template>
  <el-dialog
    style=" margin-top: 100px;"
    :title="title"
    :visible.sync="dialogVisible"
    width="40%"
    append-to-body
  >
    <el-form
      class="form"
      label-width="120px"
      :model="mccForm"
      status-icon
      :rules="rules"
      ref="mccForm"
    >
      <el-form-item label="MCC" prop="mcc">
        <el-input :disabled="mccDisabled" placeholder="请输入Mcc" v-model="mccForm.mcc" clearable></el-input>
      </el-form-item>
      <el-form-item label="国家/区域" prop="countryRegion">
        <el-input placeholder="请输入国家/区域" v-model="mccForm.countryRegion" clearable></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
      <el-button size="medium" type="primary" icon="el-icon-folder" @click="cfgMcc('mccForm')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      dialogVisible: false,
      mccDisabled: false,
      mccForm: {},
      rules: {
        mcc: [
          { required: true, message: "请输入Mcc", trigger: "blur" },
          { pattern: /^[1-9][0-9][0-9]$/, message: "3位数字字符，如：460" }
        ],
        countryRegion: [
          { required: true, message: "请输入国家/区域", trigger: "blur" },
          { min: 1, max: 128, message: "最多128个字符", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    init(title, mccForm) {
      this.title = title;
      if (mccForm != null) {
        this.mccForm = mccForm;
        this.mccDisabled = true;
      } else {
        this.mccForm = {};
        this.mccDisabled = false;
      }
      this.dialogVisible = true;
      this.resetForm("mccForm");
    },
    async cfgMcc(formName) {
      var formVal = this.util.checkForm(this, formName);
      if (!formVal) {
        return;
      }

      if (this.title == "新增受限Mcc") {
        this.setLimitMcc();
      } else if (this.title == "修改受限Mcc") {
        this.editLimitMcc();
      } else if (this.title == "新增Mcc") {
        this.addMcc();
      } else if (this.title == "修改Mcc") {
        this.editMcc();
      }
    },
    async editMcc() {
      const res = await this.jsp("/mcc.do?method=updateMcc", this.mccForm);
      const { msg, success } = res;
      if (success) {
        this.$emit("reflash");
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      this.dialogVisible = false;
    },
    async addMcc() {
      const res = await this.jsp("/mcc.do?method=addMcc", this.mccForm);
      const { msg, success } = res;
      if (success) {
        this.$emit("reflash");
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      this.dialogVisible = false;
    },
    async setLimitMcc() {
      const res = await this.jsp("/mcc.do?method=addLimitMcc", this.mccForm);
      const { msg, success } = res;
      if (success) {
        this.$emit("reflash");
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      this.dialogVisible = false;
    },
    async editLimitMcc() {
      const res = await this.jsp("/mcc.do?method=updateLimitMcc", this.mccForm);
      const { msg, success } = res;
      if (success) {
        this.$emit("reflash");
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
      this.dialogVisible = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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