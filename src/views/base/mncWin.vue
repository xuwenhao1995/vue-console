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
      label-width="130px"
      :model="mncForm"
      status-icon
      :rules="rules"
      ref="mncForm"
    >
      <el-form-item label="MCC" prop="mcc">
        <el-input :disabled="true" placeholder="请输入Mcc" v-model="mncForm.mcc" clearable></el-input>
      </el-form-item>
      <el-form-item label="MNC" prop="mnc">
        <el-input :disabled="mncDisabled" placeholder="请输入Mnc" v-model="mncForm.mnc" clearable></el-input>
      </el-form-item>
      <el-form-item label="运营商" prop="operator">
        <el-input placeholder="请输入运营商" v-model="mncForm.operator" clearable></el-input>
      </el-form-item>
      <el-form-item label="制式">
        <el-checkbox-group v-model="networkTypeList">
          <el-checkbox :label="1">TDD-LTE</el-checkbox>
          <el-checkbox :label="2">FDD-LTE</el-checkbox>
          <el-checkbox :label="3" @change="gsm900Change">GSM900</el-checkbox>
          <el-checkbox :label="4" @change="dcs1800Change">DCS1800</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item v-if="gsm900Check" label="GSM900频点范围">
        <el-col :span="11">
          <el-form-item prop="gsm900start">
            <el-input-number
              style="width: 100%;"
              placeholder="最小值为1"
              :precision="0"
              :step="1"
              v-model="mncForm.gsm900start"
              controls-position="right"
              :min="1"
              :max="124"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="gsm900end">
            <el-input-number
              style="width: 100%;"
              placeholder="最大值为124"
              :precision="0"
              :step="1"
              controls-position="right"
              v-model="mncForm.gsm900end"
              :min="1"
              :max="124"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item v-if="dcs1800Check" label="DCS1800频点范围">
        <el-col :span="11">
          <el-form-item prop="gsm1800start">
            <el-input-number
              style="width: 100%;"
              placeholder="最小值为512"
              :precision="0"
              :step="1"
              v-model="mncForm.gsm1800start"
              controls-position="right"
              :min="512"
              :max="885"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col class="line" :span="2">-</el-col>
        <el-col :span="11">
          <el-form-item prop="gsm1800end">
            <el-input-number
              style="width: 100%;"
              placeholder="最大值为885"
              :precision="0"
              :step="1"
              controls-position="right"
              v-model="mncForm.gsm1800end"
              :min="512"
              :max="885"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
      <el-button size="medium" type="primary" icon="el-icon-folder" @click="cfgMnc('mncForm')">保存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import mix from "./mncWin-mixins.js";
export default {
  mixins: [mix]
};
</script>

<style lang="scss" scoped>
.form {
  margin: -8px auto;

  .line {
    text-align: center;
  }
}

.dialog-footer {
  margin-top: -30px;
}
</style>