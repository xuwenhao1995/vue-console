<template>
  <el-dialog :title="title" :visible.sync="dialogFormVisible" width="1250px">
    <el-form
      class="form"
      label-width="130px"
      :model="paramForm"
      status-icon
      :rules="rules"
      ref="paramForm"
    >
      <el-divider content-position="left">基本参数</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="小区id" prop="address">
            <el-input-number
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.cellId"
              :min="1"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="MCC" prop="mcc">
            <el-input
              class="input"
              :readonly="true"
              size="medium"
              controls-position="right"
              v-model="paramForm.mcc"
            >
              <template slot="append">
                <el-button @click="showPlmn()" type="primary" icon="el-icon-circle-plus"></el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="MNC" prop="mnc">
            <el-input
              :readonly="true"
              class="inputLong"
              size="medium"
              controls-position="right"
              v-model="paramForm.mnc"
            >
              <template slot="append">
                <el-button @click="showPlmn()" type="primary" icon="el-icon-circle-plus"></el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="工作模式" prop="workingMode">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.workingMode"
              placeholder="请选择"
            >
              <el-option label="采集" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="工作带宽" prop="workingBandWidth">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.workingBandWidth"
              placeholder="请选择"
            >
              <el-option label="20M" :value="0"></el-option>
              <el-option label="10M" :value="1"></el-option>
              <el-option label="5M" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="步增覆盖参数" prop="phyInitRSP">
            <el-select class="input" size="medium" v-model="paramForm.phyInitRSP" placeholder="请选择">
              <el-option v-for="i in 6" :key="i" :label="i" :value="i"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="收发是否分离" prop="seperatedRxTxAnt">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.seperatedRxTxAnt"
              placeholder="请选择"
            >
              <el-option label="分离" :value="1"></el-option>
              <el-option label="不分离" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider class="divider"></el-divider>

      <el-divider content-position="left">特殊参数</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="本组参数是否有效" prop="follow3UserdFlag">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.follow3UserdFlag"
              placeholder="请选择"
              @change="changeFollow3UserdFlag"
            >
              <el-option label="有效" :value="1"></el-option>
              <el-option label="无效" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="默认子模式" prop="defaultWorkingModeSubMode">
            <el-select
              @change="changeSubMode"
              :disabled="userdFlag"
              class="inputLong"
              size="medium"
              v-model="paramForm.defaultWorkingModeSubMode"
              placeholder="请选择"
            >
              <el-option v-for="(item, i) in subMode" :key="i" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="重定向到4G频点" prop="redirect4GUarfcn">
            <el-input-number
              :disabled="redirect4G"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.redirect4GUarfcn"
              :min="0"
              :max="65535"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="重定向到2G频点" prop="redirectGsmCellUarfcn">
            <el-input-number
              :disabled="redirect2G"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.redirectGsmCellUarfcn"
              :min="0"
              :max="65535"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="Mode3Flag1" prop="mode3Flag1">
            <el-select
              :disabled="userdFlag"
              class="input"
              size="medium"
              v-model="paramForm.mode3Flag1"
              placeholder="请选择"
            >
              <el-option label="0" :value="0"></el-option>
              <el-option label="1" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="NAS拒绝原因" prop="nasRejCause">
            <el-input-number
              :disabled="userdFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.nasRejCause"
              :min="0"
              :max="255"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider class="divider"></el-divider>

      <el-divider content-position="left">重启扫网参数</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="重启是否扫网" prop="fastSnifferFlag">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.fastSnifferFlag"
              placeholder="请选择"
              @change="changeFastSnifferFlag"
            >
              <el-option label="不扫网" :value="1"></el-option>
              <el-option label="扫网" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="扫网RxGain" prop="specBoardVersion">
            <el-input-number
              :disabled="snifferFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.specBoardVersion"
              :min="0"
              :max="255"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="自动补全扫网频点" prop="scanAddSib5Uarfcn">
            <el-select
              :disabled="snifferFlag"
              class="input"
              size="medium"
              v-model="paramForm.scanAddSib5Uarfcn"
              placeholder="请选择"
            >
              <el-option label="允许" :value="1"></el-option>
              <el-option label="禁止" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider class="divider"></el-divider>

      <el-divider content-position="left">小区参数</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="等待GUI配置" prop="waitGuiCfgFlag">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.waitGuiCfgFlag"
              placeholder="请选择"
              @change="changeWaitGuiCfgFlag"
            >
              <!-- <el-option label="一直等待" :value="255"></el-option> -->
              <el-option label="不等待" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="UARFCN" prop="uarfcn">
            <el-input-number
              :disabled="waitGuiCfgFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.uarfcn"
              :min="0"
              :max="65535"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item :hidden="true" label="上行频点(仅FDD有效)" prop="specialUlFreq">
            <el-input-number
              :disabled="waitGuiCfgFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.specialUlFreq"
              :min="0"
              :max="65535"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="PCI" prop="phyCellId">
            <el-input-number
              :disabled="waitGuiCfgFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.phyCellId"
              :min="0"
              :max="503"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="TAC" prop="tac">
            <el-input-number
              :disabled="waitGuiCfgFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.tac"
              :min="0"
              :max="65535"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="6">
          <el-form-item label="参考广播功率" prop="refBroadcastPower">
            <el-input-number
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.refBroadcastPower"
              :min="-60"
              :max="50"
            ></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="输出功率(dBm)" prop="txPower">
            <el-input-number
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.txPower"
              :min="0"
              :max="maxTxpowerDbm"
            >
              <template slot="append">dBm</template>
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="RxGain" prop="rxGain">
            <el-input-number
              :disabled="waitGuiCfgFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.rxGain"
              :min="0"
              :max="255"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider class="divider"></el-divider>

      <el-divider v-if="core.xtype == $store.state.XTYPE_TDD" content-position="left">TDD同步参数</el-divider>
      <el-row v-if="core.xtype == $store.state.XTYPE_TDD">
        <el-col :span="6">
          <el-form-item label="同步源" prop="syncMode">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.syncMode"
              placeholder="请选择"
              @change="changeSyncMode"
            >
              <el-option label="宏站" :value="0"></el-option>
              <el-option label="GPS" :value="1"></el-option>
              <el-option label="GPS同步且不扫网" :value="2"></el-option>
              <el-option label="宏站同步且不扫网" :value="3"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="宏站同步方式" prop="syncToMacroMode">
            <el-select
              :disabled="syncModeFlag"
              class="input"
              size="medium"
              v-model="paramForm.syncToMacroMode"
              placeholder="请选择"
              @change="changeMacroMode"
            >
              <el-option label="手动" :value="1"></el-option>
              <el-option label="自动" :value="0"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="同步宏站频点" prop="syncToMacroUarfcn">
            <el-input-number
              :disabled="macroFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.syncToMacroUarfcn"
              :min="0"
              :max="65535"
            ></el-input-number>
          </el-form-item>
        </el-col>

        <el-col :span="6">
          <el-form-item label="同步宏站PCI" prop="syncToMacroPCI">
            <el-input-number
              :disabled="macroFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.syncToMacroPCI"
              :min="0"
              :max="503"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="core.xtype == $store.state.XTYPE_TDD">
        <el-col :span="6">
          <el-form-item label="同步宏站带宽" prop="syncToMacroBandWidth">
            <el-select
              :disabled="macroFlag"
              class="input"
              size="medium"
              v-model="paramForm.syncToMacroBandWidth"
              placeholder="请选择"
            >
              <el-option label="20M" :value="100"></el-option>
              <el-option label="10M" :value="50"></el-option>
              <el-option label="5M" :value="25"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="同步宏站特殊时隙" prop="syncToMacroSpecialSFCfg">
            <el-select
              :disabled="macroFlag"
              class="input"
              size="medium"
              v-model="paramForm.syncToMacroSpecialSFCfg"
              placeholder="请选择"
            >
              <el-option label="5" :value="5"></el-option>
              <el-option label="7" :value="7"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="GPS调整值" prop="syncToGPSAdjustValue">
            <el-input-number
              :disabled="!syncModeFlag"
              class="input"
              size="medium"
              controls-position="right"
              v-model="paramForm.syncToGPSAdjustValue"
              :min="-2147483648"
              :max="65535"
            ></el-input-number>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider v-if="core.xtype == $store.state.XTYPE_TDD" class="divider"></el-divider>

      <el-divider v-if="core.xtype == $store.state.XTYPE_TDD" content-position="left">TDD特殊参数</el-divider>
      <el-row v-if="core.xtype == $store.state.XTYPE_TDD">
        <el-col :span="6">
          <el-form-item label="TDD上下行子侦" prop="ulDlCfg">
            <el-select class="input" size="medium" v-model="paramForm.ulDlCfg" placeholder="请选择">
              <el-option label="1" :value="1"></el-option>
              <el-option label="2" :value="2"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="TDD特殊子侦" prop="specSlotCfg">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.specSlotCfg"
              placeholder="请选择"
            >
              <el-option label="5" :value="5"></el-option>
              <el-option label="7" :value="7"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="SF7分配标志" prop="onlySf7AllocResource">
            <el-select
              class="input"
              size="medium"
              v-model="paramForm.onlySf7AllocResource"
              placeholder="请选择"
            >
              <el-option label="所有上行" :value="0"></el-option>
              <el-option label="只在SF7" :value="1"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider v-if="core.xtype == $store.state.XTYPE_TDD" class="divider"></el-divider>

      <el-divider content-position="left">其它参数</el-divider>
      <el-row>
        <el-col :span="6">
          <el-form-item label="定位imsi的RB资源" prop="rbParamUsableFlag">
            <el-radio v-model="paramForm.rbParamUsableFlag" :label="0">不使用</el-radio>
            <el-radio v-model="paramForm.rbParamUsableFlag" :label="1">使用</el-radio>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="天线类型" prop="specSlotCfg">
            <el-radio v-model="paramForm.antType" :label="0">自带</el-radio>
            <el-radio v-model="paramForm.antType" :label="1">外接</el-radio>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col>
          <el-form-item label-width="190px" label="扫频频点(以英文逗号分隔)" prop="configsnifuarfcn">
            <el-input
              style="width: 100%;"
              size="medium"
              controls-position="right"
              v-model="paramForm.configsnifuarfcn"
            >
              <template slot="append">
                <el-tooltip class="item" effect="light" placement="right-end">
                  <div slot="content">
                    FDD支持的扫网频点：
                    <br />B1：0~599
                    <br />B3：1200~1949
                    <br />B5：2400~2649
                    <br />B8：3450~3799
                    <br />TDD支持的扫网频点：
                    <br />B34： 36200~36349
                    <br />B38：37750~38249
                    <br />B39：38250~38649
                    <br />B40：38650~39649
                    <br />B41：39650~41589
                    <br />
                  </div>
                  <el-button type="primary" icon="el-icon-question"></el-button>
                </el-tooltip>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider class="divider"></el-divider>
    </el-form>

    <plmn @plmn="updateParentPlmn" v-if="dialogPlmnVisible" ref="plmn" />
    <upload-file v-if="dialogFileVisible" ref="uploadFile"/>

    <div slot="footer" class="dialog-footer">
      <el-row>
        <el-col class="left" :span="6">
          <el-button size="medium" type="primary" @click="exportParam()">导出参数</el-button>
          <el-button size="medium" type="primary" @click="importParam()">导入参数</el-button>
        </el-col>
        <el-col :span="18">
          <el-button size="medium" type="primary" icon="el-icon-search" @click="getParam()">刷新参数</el-button>
          <el-button size="medium" @click="dialogFormVisible = false">取 消</el-button>
          <el-button
            size="medium"
            type="primary"
            icon="el-icon-folder"
            @click="setParam('paramForm')"
          >保存参数</el-button>
        </el-col>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import mix from "./stsLteParam-mixins.js";
import Plmn from "../../../base/plmnSet.vue";
import UploadFile from "../../../base/uploadFile.vue";
export default {
  mixins: [mix],
  components: {
    Plmn,
    UploadFile
  }
};
</script>

<style lang="scss" scoped>
.form {
  margin: -8px auto;

  .divider {
    margin-top: -5px;
  }

  .input {
    width: 150px;
  }
  .inputLong {
    width: 450px;
  }
}
.dialog-footer {
  margin-top: -40px;

  .left {
    margin-left: -45px;
  }
}
</style>