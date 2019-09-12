<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="590px">
    <el-form
      label-width="140px"
      class="form"
      :model="powerForm"
      status-icon
      :rules="rules"
      ref="powerForm"
    >
      <el-form-item label="厂家" prop="manufactorId">
        <el-select
          @change="manufactorChange(powerForm.manufactorId)"
          style="width: 100%;"
          v-model="powerForm.manufactorId"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, i) in manufactors"
            :key="i"
            :label="item.manuFactorName"
            :value="item.codeValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名称" prop="paName">
        <el-input size="medium" v-model="powerForm.paName" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="控制方式" prop="boardType">
        <el-radio v-model="powerForm.ctrlWay" :label="$store.state.PA_CRT_RS485">RS485</el-radio>
        <el-radio
          v-if="powerForm.manufactorId != $store.state.MOJI_PA"
          v-model="powerForm.ctrlWay"
          :label="$store.state.PA_CRT_GPIO"
        >GPIO</el-radio>
      </el-form-item>

      <el-form-item
        v-if="powerForm.ctrlWay != $store.state.PA_CRT_GPIO"
        label="功放地址"
        prop="address"
      >
        <el-input-number
          style="width: 100%;"
          controls-position="right"
          v-model="powerForm.address"
          :min="0"
          :max="50"
        ></el-input-number>
      </el-form-item>

      <el-form-item label="适用频段" prop="bands">
        <el-checkbox-group v-model="checkbands">
          <el-checkbox :label="1">1</el-checkbox>
          <el-checkbox :label="3">3</el-checkbox>
          <el-checkbox :label="5">5</el-checkbox>
          <el-checkbox :label="8">8</el-checkbox>
          <el-checkbox :label="34">34</el-checkbox>
          <el-checkbox :label="38">38</el-checkbox>
          <el-checkbox :label="39">39</el-checkbox>
          <el-checkbox :label="40">40</el-checkbox>
          <el-checkbox :label="41">41</el-checkbox>
          <el-checkbox :label="900">900</el-checkbox>
          <el-checkbox :label="1800">1800</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item label="功放最大增益" prop="maxGain">
        <el-input
          size="medium"
          style="width: 100%;"
          controls-position="right"
          v-model="powerForm.maxGain"
          :min="1"
        >
          <template slot="append">dB</template>
        </el-input>
      </el-form-item>

      <el-form-item label="功放最大输出功率" prop="maxOutputpower">
        <el-input
          size="medium"
          style="width: 100%;"
          controls-position="right"
          v-model="powerForm.maxOutputpower"
          :min="1"
        >
          <template slot="append">dBm</template>
        </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = false">取 消</el-button>
      <el-button type="primary" @click="addOrEditPower('powerForm')">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  created() {
    this.title = this.ptitle;
    this.powerForm = this.ppowerForm;
    this.getManufactors();
  },

  data() {
    return {
      manufactors: [],
      title: "",
      dialogFormVisible: false,
      checkbands: [],
      powerForm: {
        id: "",
        manufactorId: "",
        paName: "",
        ctrlWay: "",
        address: "",
        maxGain: "",
        maxOutputpower: "",
        bands: ""
      },
      rules: {
        manufactorId: [
          { required: true, message: "请选择厂家", trigger: "blur" }
        ],
        paName: [
          { required: true, message: "请输入功放名称", trigger: "blur" },
          { min: 0, max: 50, message: "最多50个字符" }
        ],
        ctrlWay: [
          { required: true, message: "请选择控制方式", trigger: "blur" }
        ],
        maxGain: [
          { required: true, message: "请输入功放最大增益", trigger: "blur" },
          { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" }
        ],
        maxOutputpower: [
          {
            required: true,
            message: "请输入功放最大输出功率",
            trigger: "blur"
          },
          { pattern: /^[-]{0,1}\d+$/, message: "只能输入整数" }
        ]
      }
    };
  },
  methods: {
    init(power) {
      if (this.title == "添加功放") {
        this.powerForm = {};
      }
      if (power) {
        this.powerForm = power;
        power.bands.split(",").forEach(item => {
          this.checkbands.push(Number(item));
        });
      }
      // this.getManufactors();
      this.dialogFormVisible = true;
    },
    async addOrEditPower(powerFormName) {
      var formVal = this.util.checkForm(this, powerFormName);
      if (!formVal) {
        return;
      }
      this.powerForm.bands = this.checkbands.join(",");

      if (!this.powerForm.bands) {
        this.$alert("请选择频段", "提示", {
          confirmButtonText: "确定",
          type: "warning",
          callback: action => {}
        });
        return;
      }

      if (this.title == "添加功放") {
        const res = await this.jsp("/pa.do?method=addPa", this.powerForm);
        const { msg, success } = res;
        if (success) {
          this.getManufactors();
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      } else {
        const res = await this.jsp("/pa.do?method=updatePa", this.powerForm);
        const { msg, success } = res;
        if (success) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
      }

      this.$parent.getPowerList();
      this.dialogFormVisible = false;
    },

    manufactorChange(manufactorId) {
      this.powerForm = {};
      this.powerForm.manufactorId = manufactorId;
    },

    async getManufactors() {
      this.manufactors = [];
      const res = await this.jsp("/coreBoard.do?method=queryAllPaManufactor");
      const { msg, success, results } = res;
      if (success) {
        var defaultItem = new Object();
        var data = eval(results);
        for (var key in data) {
          var defaultItem = new Object();
          defaultItem.codeValue = key;
          defaultItem.codeValue = Number(defaultItem.codeValue);
          defaultItem.manuFactorName = data[key];
          this.manufactors.push(defaultItem);
        }
      } else {
        this.$message.error(msg);
      }
    }
  },
  props: ["ptitle", "ppowerForm"]
};
</script>

<style lang="scss" scoped>
.form {
  margin: -8px auto;
}
.dialog-footer {
  margin-top: -20px;
}
</style>