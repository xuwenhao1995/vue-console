<template>
  <div class="box-card">
    <el-row class="search">
      <el-col>
        <el-button v-if="$store.state.user.userName == 'root'" plain @click="showDialog()" type="success">添加功放</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      size="mini"
      height="500px"
      :data="powerList"
      v-loading="loading"
      border
      style="width: 100%;margin-top: 10px;"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="index" width="30"></el-table-column>
      <el-table-column prop="paName" label="功放名称" width="100"></el-table-column>
      <el-table-column prop="manufactor" label="类型" width="80"></el-table-column>
      <el-table-column prop="ctrlWay" label="控制方式" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay === $store.state.PA_CRT_RS485">RS485</span>
          <span v-if="scope.row.ctrlWay === $store.state.PA_CRT_GPIO">GPIO</span>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="功放地址" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay === $store.state.PA_CRT_RS485">{{scope.row.address}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column prop="bands" label="适用频段" width="80"></el-table-column>
      <el-table-column prop="maxGain" label="功放最大增益" width="70">
        <template slot-scope="scope">
          <span>{{scope.row.maxGain}}(dB)</span>
        </template>
      </el-table-column>
      <el-table-column prop="maxOutputpower" label="功放最大输出功率">
        <template slot-scope="scope">
          <span>{{scope.row.maxOutputpower}}(dBm)</span>
        </template>
      </el-table-column>
      <el-table-column prop="paState" label="正常/故障" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.paState" style="color: green;">正常</span>
            <span v-else style="color: red;">故障</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="mPaState" label="开关状态" width="80">
        <template slot-scope="scope">
          <span v-if="!scope.row.paState">--</span>
          <el-switch
            v-else
            @change="switchPower(scope.row)"
            v-model="scope.row.mPaState"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

      <el-table-column prop="mPaOutputPower" label="输出(前向)功率" width="90">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mPaOutputPower">--</span>
            <span v-else>{{scope.row.mPaOutputPower}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mPaFaultAlarm" label="功放故障告警" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mPaFaultAlarm == null">--</span>
            <div v-else>
              <span v-if="scope.row.mPaFaultAlarm" style="color: red;">告警</span>
              <span v-else style="color: green;">正常</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mPaSwrAlarm" label="驻波比告警" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mPaSwrAlarm == null">--</span>
            <div v-else>
              <span v-if="scope.row.mPaSwrAlarm" style="color: red;">告警</span>
              <span v-else style="color: green;">正常</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mOverTempAlarm" label="温度告警" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mOverTempAlarm == null">--</span>
            <div v-else>
              <span v-if="scope.row.mOverTempAlarm" style="color: red;">告警</span>
              <span v-else style="color: green;">正常</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mOverPowerAlarm" label="过功率告警" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mOverPowerAlarm == null">--</span>
            <div v-else>
              <span v-if="scope.row.mOverPowerAlarm" style="color: red;">告警</span>
              <span v-else style="color: green;">正常</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mPaTemperatue" label="功放温度" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mPaTemperatue == null">--</span>
            <span v-else>{{scope.row.mPaTemperatue}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mPaALC" label="功放ALC" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mPaALC == null">--</span>
            <span v-else>{{scope.row.mPaALC}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mPaSWR" label="功放驻波比" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mPaSWR == null">--</span>
            <span v-else>{{scope.row.mPaSWR}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mPaATT" label="功放ATT" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mPaATT == null">--</span>
            <span v-else>{{scope.row.mPaATT}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="mPaBackwardPower" label="反向功率" width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.ctrlWay == $store.state.PA_CRT_GPIO"></span>
          <div v-else>
            <span v-if="scope.row.mPaBackwardPower == null">--</span>
            <span v-else>{{scope.row.mPaBackwardPower}}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        v-if="$store.state.user.userName == 'root'"
        size="mini"
        label="操作"
        width="100"
        fixed="right"
      >
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
        <el-button
          class="reflashBtn"
          @click="refreshPower()"
          icon="el-icon-refresh"
          circle
          size="mini"
        ></el-button>
      </el-col>
    </el-row>
    <power-win :ptitle="title" v-if="dialogFormVisible" ref="powerWin" />
  </div>
</template>

<script>
import mix from "./power-mixins.js";
import PowerWin from "./powerWin.vue";
export default {
  mixins: [mix],
  components: {
    PowerWin
  }
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;

  .page-row {
    margin-top: 10px;
    .reflashBtn {
      margin-left: 30px;
      margin-top: 4px;
    }
  }
}
</style>