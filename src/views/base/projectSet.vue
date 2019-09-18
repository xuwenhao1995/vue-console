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
      label-width="180px"
      :model="projectForm"
      status-icon
      :rules="rules"
      ref="projectForm"
    >
      <el-form-item label="设备ID" prop="deviceId">
        <el-input-number
          style="width: 50%;"
          :precision="0"
          :step="1"
          v-model="projectForm.deviceId"
          controls-position="right"
          :min="1"
          :max="9999999999"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="设备类型" prop="deviceType">
        <el-select style="width:100%;" v-model="projectForm.deviceType" placeholder="请选择">
          <el-option
            v-for="item in projectList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
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
        @click="setProject('projectForm')"
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

      projectList: [],
      projectForm: {},
      rules: {
        deviceId: [
          {
            required: true,
            message: "请输入设备ID",
            trigger: "blur"
          }
        ],
        deviceType: [
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
    init(title) {
      this.title = title;
      this.getDeviceInfo();
      this.getProjectList();
      this.dialogVisible = true;
    },

    async getProjectList() {
      this.projectList = [];
      const res = await this.jsp("/projectCfg.do?method=queryProjectTypeMap");
      const { msg, success, results } = res;
      if (success) {
        var defaultItem = new Object();
        var data = eval(results);
        for (var key in data) {
          var defaultItem = new Object();
          defaultItem.value = key;
          defaultItem.value = Number(defaultItem.value);
          defaultItem.name = data[key];
          this.projectList.push(defaultItem);
        }
      } else {
        this.$message.error(msg);
      }
    },

    async setProject(projectFormName) {
      var formVal = this.util.checkForm(this, projectFormName);
      if (!formVal) {
        return;
      }

      const res = await this.jsp(
        "/projectCfg.do?method=updateDeviceCfg",
        this.projectForm
      );
      const { msg, success } = res;
      if (success) {
        this.$parent.getDeviceInfo();
        if (msg) {
          this.$confirm(msg, "提示", {
            confirmButtonText: "重启",
            cancelButtonText: "取消",
            type: "success"
          })
            .then(() => {
              this.reboot();
            })
            .catch(() => {});
        }
      } else {
        this.$message.error(msg);
      }

      this.dialogVisible = false;
    },

    async reboot() {
      const res = await this.jsp("/reboot/restart.do");
      const { msg, success } = res;
      if (success) {
        this.$message.success(msg);
      } else {
        this.$message.error(msg);
      }
    },
    async getDeviceInfo() {
      const res = await this.jsp("/projectCfg.do?method=queryDeviceInfo");
      const { msg, success, results } = res;
      if (success) {
        this.projectForm = JSON.parse(results);
      } else {
        this.$message.error(msg);
      }
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