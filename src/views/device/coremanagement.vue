<template>
  <div class="box-card">
    <el-row class="search">
      <el-col>
        <el-button
          v-if="$store.state.user.userName == 'root'"
          plain
          @click="showDialog()"
          type="success"
        >添加核心板</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      size="mini"
      height="600px"
      :data="coreList"
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" width="30"></el-table-column>
      <el-table-column prop="name" label="名称" width="140"></el-table-column>
      <el-table-column prop="manufactorName" label="厂家" width="60"></el-table-column>
      <el-table-column prop="boardType" label="板型" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.boardType === $store.state.BOARDTYPE_BIG" style="color: green;">大板</span>
          <span
            v-if="scope.row.boardType === $store.state.BOARDTYPE_SMALL_SINGLE"
            style="color: green;"
          >单制式小板</span>
          <span
            v-if="scope.row.boardType === $store.state.BOARDTYPE_SMALL_DOUBLE"
            style="color: green;"
          >双制式小板</span>
        </template>
      </el-table-column>
      <el-table-column prop="xtype" label="核心板类型" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.xtype === $store.state.XTYPE_TDD" style="color: green;">TDD</span>
          <span v-if="scope.row.xtype === $store.state.XTYPE_FDD" style="color: green;">FDD</span>
          <span v-if="scope.row.xtype === $store.state.XTYPE_GSM" style="color: green;">GSM</span>
          <span v-if="scope.row.xtype === $store.state.XTYPE_CDMA" style="color: green;">CDMA</span>
        </template>
      </el-table-column>
      <el-table-column prop="fband" label="工作频段" width="140">
        <template slot-scope="scope">
          <el-tag
            size="mini"
            style=" margin-top: 1px;"
            v-for="(item,i) in scope.row.fband.split(',')"
            :key="i"
          >{{item}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ip" label="IP" width="130"></el-table-column>
      <el-table-column prop="isOnline" label="在线状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isOnline == 0" style="color: red;">离线</span>
          <span v-if="scope.row.isOnline == 1" style="color: green;">在线</span>
        </template>
      </el-table-column>
      <el-table-column prop="sysStatus" label="工作状态" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isOnline == 0">--</span>
          <div v-else>
            <span v-if="scope.row.sysStatus == 0" style="color: green;">参数检查中</span>
            <span v-if="scope.row.sysStatus == 1" style="color: green;">扫网中</span>
            <span v-if="scope.row.sysStatus == 2" style="color: green;">等待配置频点PCI</span>
            <span v-if="scope.row.sysStatus == 3" style="color: green;">小区建立中</span>
            <span v-if="scope.row.sysStatus == 4" style="color: green;">工作中</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="小区状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.xtype === $store.state.XTYPE_GSM">
            <span v-if="scope.row.isOnline == 0">--</span>
            <div v-else>
              <span v-if="scope.row.sysStatus == 1" style="color: red;">未建立</span>
              <span v-else style="color: green;">建立成功</span>
            </div>
          </div>
          <div v-else>
            <span v-if="scope.row.isOnline == 0">--</span>
            <div v-else>
              <span v-if="scope.row.status == 2" style="color: red;">未建立</span>
              <span v-if="scope.row.status == 1" style="color: green;">建立成功</span>
              <span v-if="scope.row.status == 0" style="color: red;">建立失败</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="syncStatus" label="同步状态" width="80">
        <template slot-scope="scope">
          <span
            v-if="scope.row.xtype === $store.state.XTYPE_GSM || scope.row.xtype != $store.state.XTYPE_TDD"
          ></span>
          <div v-else>
            <span v-if="scope.row.isOnline == 0"></span>
            <div v-else>
              <span v-if="scope.row.syncStatus == 2" style="color: red;">失步</span>
              <span v-if="scope.row.syncStatus == 1" style="color: green;">同步</span>
              <span v-if="scope.row.syncStatus == 0" style="color: red;">未同步</span>
              <span v-else>--</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="rfStatus" label="射频状态" width="80">
        <template slot-scope="scope">
          <div v-if="scope.row.xtype === $store.state.XTYPE_GSM">
            <span v-if="scope.row.isOnline == 0">--</span>
            <div v-else>
              <el-switch
                @change="cfgGsmRf(scope.row.gsmStatus.rfStatus.signal1RfOnOffStatus ,scope.row, $store.state.TYPE_900)"
                v-model="scope.row.gsmStatus.rfStatus.signal1RfOnOffStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
              <el-switch
                @change="cfgGsmRf(scope.row.gsmStatus.rfStatus.signal2RfOnOffStatus ,scope.row, $store.state.TYPE_1800)"
                v-model="scope.row.gsmStatus.rfStatus.signal2RfOnOffStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
              ></el-switch>
            </div>
          </div>
          <div v-else>
            <span v-if="scope.row.isOnline == 0">--</span>
            <div v-else>
              <el-switch
                @change="cfgRf(scope.row, 0)"
                v-model="scope.row.extraInfo.rfStatus"
                active-color="#13ce66"
                inactive-color="#ff4949"
                :active-value="1"
                :inactive-value="0"
              ></el-switch>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="maxOutputpower" label="最大输出功率" width="110">
        <template slot-scope="scope">
          <span v-if="scope.row.xtype === $store.state.XTYPE_GSM"></span>
          <span v-else>{{scope.row.maxOutputpower}}dBm</span>
        </template>
      </el-table-column>

      <el-table-column prop="scanType" label="扫网设定" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.manufactor !== $store.state.FAP_MANUFACTOR_CORE_STS"></span>
          <div v-else>
            <span v-if="scope.row.scanType === $store.state.SCAN_SINGLE">独立扫网</span>
            <span
              v-if="scope.row.scanType === $store.state.SCAN_TDD_GROUP && scope.row.scanOrNot === $store.state.SCAN_YES"
            >TDD扫网组【扫网】</span>
            <span
              v-if="scope.row.scanType === $store.state.SCAN_TDD_GROUP && scope.row.scanOrNot === $store.state.SCAN_NO"
            >TDD扫网组【扫网】</span>
            <span
              v-if="scope.row.scanType === $store.state.SCAN_FDD_GROUP && scope.row.scanOrNot === $store.state.SCAN_YES"
            >FDD扫网组【扫网】</span>
            <span
              v-if="scope.row.scanType === $store.state.SCAN_FDD_GROUP && scope.row.scanOrNot === $store.state.SCAN_NO"
            >FDD扫网组【扫网】</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="usePowerFlag" label="功放" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.usePowerFlag == $store.state.WITHOUT_PA" style="color: #409EFF;">无</span>
          <span v-if="scope.row.usePowerFlag == $store.state.OUTLAY_PA" style="color: #409EFF;">外置功放</span>
        </template>
      </el-table-column>

      <el-table-column prop="relateWay" label="关联方式" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.relateWay == -1" style="color: #409EFF;">无</span>
          <span v-if="scope.row.relateWay == 0" style="color: #409EFF;">绑定</span>
          <span v-if="scope.row.relateWay == 1" style="color: #409EFF;">自动选择</span>
        </template>
      </el-table-column>

      <el-table-column prop="paName" label="功放名称" width="120">
        <template slot-scope="scope">
          <span v-if="!scope.row.paName" style="color: #409EFF;"></span>
          <div v-else>
            <el-tag
              size="medium"
              v-if="$store.state.user.userName == 'root'"
              @onclick="showPaEdit(scope.row.paId)"
              style="cursor: pointer;"
            >{{scope.row.paName}}</el-tag>
            <el-tag size="medium" v-else style="color:blue;">{{scope.row.paName}}</el-tag>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="version" label="版本" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.isOnline == 0">--</span>
          <span v-else>{{scope.row.version}}</span>
        </template>
      </el-table-column>

      <el-table-column size="mini" label="操作" width="60" align="right" fixed="left" type="expand">
        <template slot-scope="scope">
          <el-button
            v-if="$store.state.user.userName == 'root'"
            @click="showEditDialog(scope.row)"
            plain
            type="primary"
            size="medium"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="reboot(scope.row)"
            type="warning"
            size="medium"
            icon="el-icon-switch-button"
            circle
            plain
          ></el-button>
          <el-button
            v-if="$store.state.user.userName == 'root'"
            @click="showDel(scope.row)"
            plain
            size="medium"
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            @click="showSetParams(scope.row)"
            plain
            size="medium"
            type="primary"
            icon="el-icon-setting"
            round
          >参数设置</el-button>
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
        <el-button
          class="reflashBtn"
          @click="refreshCores()"
          icon="el-icon-refresh"
          circle
          size="mini"
        ></el-button>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="560px">
      <el-form
        label-width="110px"
        class="form"
        :model="coreForm"
        status-icon
        :rules="rules"
        ref="coreForm"
      >
        <el-form-item label="厂家" prop="manufactor">
          <el-select
            @change="manufactorChange(coreForm.manufactor)"
            style="width: 100%;"
            v-model="coreForm.manufactor"
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
        <el-form-item label="核心板名称" prop="name">
          <el-input size="medium" v-model="coreForm.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item
          v-if="coreForm.manufactor == $store.state.FAP_MANUFACTOR_CORE_STS"
          label="板型"
          prop="boardType"
        >
          <el-radio v-model="coreForm.boardType" :label="$store.state.BOARDTYPE_BIG">大板</el-radio>
          <el-radio v-model="coreForm.boardType" :label="$store.state.BOARDTYPE_SMALL_SINGLE">单制式小板</el-radio>
          <el-radio v-model="coreForm.boardType" :label="$store.state.BOARDTYPE_SMALL_DOUBLE">双制式小板</el-radio>
        </el-form-item>

        <el-form-item label="板型" prop="xtype">
          <el-radio v-model="coreForm.xtype" :label="$store.state.XTYPE_TDD">TDD</el-radio>
          <el-radio v-model="coreForm.xtype" :label="$store.state.XTYPE_FDD">FDD</el-radio>
          <el-radio
            v-if="coreForm.manufactor == $store.state.FAP_MANUFACTOR_CORE_TCX"
            v-model="coreForm.xtype"
            :label="$store.state.XTYPE_GSM"
          >GSM</el-radio>
          <el-radio v-if="false" v-model="coreForm.xtype" :label="$store.state.XTYPE_CDMA">CDMA</el-radio>
        </el-form-item>
        <el-form-item label="工作频段" prop="fband">
          <el-row>
            <el-col>
              <el-button
                size="mini"
                v-if="coreForm.xtype == 0 || coreForm.xtype == 1 || coreForm.xtype == 2|| coreForm.xtype == 3 "
                type="primary"
                @click="showEditFband()"
              >配置频段</el-button>
              <br />
              <el-tag
                size="medium"
                style=" margin-right: 3px;"
                v-for="(item,i) in band"
                :key="i"
              >{{item}}</el-tag>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="IP" prop="ip">
          <el-input size="medium" style="width: 100%;" controls-position="ip" v-model="coreForm.ip"></el-input>
        </el-form-item>

        <el-form-item label="最大输出功率" prop="maxOutputpower">
          <el-input
            size="medium"
            style="width: 100%;"
            controls-position="right"
            v-model="coreForm.maxOutputpower"
            :min="0"
          >
            <template slot="append">dBm</template>
          </el-input>
        </el-form-item>

        <el-divider v-if="coreForm.manufactor == $store.state.FAP_MANUFACTOR_CORE_STS"></el-divider>

        <el-form-item
          v-if="coreForm.manufactor == $store.state.FAP_MANUFACTOR_CORE_STS"
          label="扫网设定"
          prop="scanType"
        >
          <el-radio v-model="coreForm.scanType" :label="$store.state.SCAN_SINGLE">独立扫网</el-radio>
          <el-radio
            v-if="coreForm.xtype == $store.state.XTYPE_TDD"
            v-model="coreForm.scanType"
            :label="$store.state.SCAN_TDD_GROUP"
          >加入TDD扫网组</el-radio>
          <el-radio
            v-if="coreForm.xtype == $store.state.XTYPE_FDD"
            v-model="coreForm.scanType"
            :label="$store.state.SCAN_FDD_GROUP"
          >加入FDD扫网组</el-radio>
        </el-form-item>

        <el-form-item
          v-if="coreForm.scanType == $store.state.SCAN_TDD_GROUP || coreForm.scanType == $store.state.SCAN_FDD_GROUP"
          label="是否扫网"
          prop="scanOrNot"
        >
          <el-radio v-model="coreForm.scanOrNot" :label="$store.state.SCAN_YES">扫网</el-radio>
          <el-radio v-model="coreForm.scanOrNot" :label="$store.state.SCAN_NO">不扫网</el-radio>
        </el-form-item>

        <el-divider></el-divider>

        <el-form-item label="功放" prop="usePowerFlag">
          <el-radio v-model="coreForm.usePowerFlag" :label="$store.state.WITHOUT_PA">无</el-radio>
          <el-radio v-model="coreForm.usePowerFlag" :label="$store.state.OUTLAY_PA">外置功放</el-radio>
        </el-form-item>

        <el-form-item
          v-if="coreForm.usePowerFlag == $store.state.OUTLAY_PA"
          label="关联方式"
          prop="relateWay"
        >
          <el-radio v-model="coreForm.relateWay" :label="$store.state.RELATE_WAY_BOUND">绑定</el-radio>
          <el-radio v-model="coreForm.relateWay" :label="$store.state.RELATE_WAY_FREE">自动选择</el-radio>
        </el-form-item>

        <el-form-item
          v-if="coreForm.relateWay == $store.state.RELATE_WAY_BOUND && coreForm.usePowerFlag == $store.state.OUTLAY_PA"
          label="选择"
          prop="paId"
        >
          <el-select style="width: 100%;" v-model="coreForm.paId" placeholder="请选择">
            <el-option label="请选择" :value="-1" hidden="true"></el-option>
            <el-option
              v-for="(item, i) in paAddress"
              :key="i"
              :label="item.manuFactorName"
              :value="item.codeValue"
            ></el-option>
          </el-select>
          <el-button size="medium" hidden="true" type="primary" @click="showAddPa()">增加功放</el-button>
        </el-form-item>
      </el-form>

      <el-dialog width="550px" title="配置工作频段" :visible.sync="dialogFormVisibleFband" append-to-body>
        <el-row v-for="(item, i) in bandList" :key="i">
          <el-checkbox-group v-model="bandCheckList">
            <el-col style=" margin-top: 10px;margin-left: 20px;">
              <el-checkbox
                @change="handleCheckChange(item)"
                :indeterminate="item.checked"
                style=" margin-right: 10px;width: 80px;"
                :label="item.band"
              >{{item.str}}</el-checkbox>
              <el-input-number
                :precision="0"
                :step="1"
                :disabled="!item.checked"
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
          <el-button @click="dialogFormVisibleFband = false">取 消</el-button>
          <el-button type="primary" @click="setFband()">保 存</el-button>
        </div>
      </el-dialog>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditCore('coreForm')">确 定</el-button>
      </div>
    </el-dialog>

    <sts-patam v-if="dialogStsVisible" ref="stsPatam" />
  </div>
</template>

<script>
import mix from "./coremanagement-mixins.js";
import fbands from "./fbands-mixins.js";
import StsPatam from "./fapParam/sts/stsLteParam.vue";
export default {
  mixins: [mix, fbands],
  components: {
    StsPatam
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
  .form {
    margin: -8px auto;
  }
  .dialog-footer {
    margin-top: -20px;
  }

  .page-row {
    margin-top: 10px;
    .reflashBtn {
      margin-left: 30px;
      margin-top: 4px;
    }
  }
}
</style>