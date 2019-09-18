<template>
  <el-card class="box-card">
    <el-row>
      <el-col :span="10">
        <el-button plain @click="showDialog()" type="success">添加Mcc</el-button>

        <!-- 表格 -->
        <el-table
          border
          highlight-current-row
          @current-change="handleCurrentChange"
          ref="mccTable"
          height="400px"
          :data="mccList"
          style="width: 100%"
        >
          <el-table-column type="index" width="30"></el-table-column>
          <el-table-column prop="mcc" label="MCC" width="60"></el-table-column>
          <el-table-column prop="countryRegion" label="国家/区域"></el-table-column>

          <el-table-column label="操作" width="95">
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
      </el-col>

      <el-col :span="14">
        <el-button plain @click="showMncDialog()" type="success">添加Mnc</el-button>

        <!-- 表格 -->
        <el-table height="550px" :data="mncList" border style="width: 100%">
          <el-table-column type="index" width="30"></el-table-column>
          <el-table-column prop="mnc" label="MNC" width="60"></el-table-column>
          <el-table-column prop="operator" label="运营商"></el-table-column>
          <el-table-column prop="networkType" label="制式" width="160">
            <template slot-scope="scope">
              <el-tag
                size="mini"
                style=" margin-top: 1px;margin-left: 3px"
                v-for="(item,i) in getNetworkTypeList(scope.row)"
                :key="i"
              >{{item}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="gsm900Uarfcns" label="GSM900频点范围"></el-table-column>
          <el-table-column prop="gsm1800Uarfcns" label="DCS1800频点范围"></el-table-column>

          <el-table-column label="操作" width="95">
            <template slot-scope="scope">
              <el-button
                @click="showMncEditDialog(scope.row)"
                size="mini"
                plain
                type="primary"
                icon="el-icon-edit"
                circle
              ></el-button>
              <el-button
                @click="showMncDel(scope.row)"
                size="mini"
                plain
                type="danger"
                icon="el-icon-delete"
                circle
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <mcc-win @reflash="getMccList" v-if="dialogMccWinVisible" ref="mccWin" />
    <mnc-win @reflash="getMncList" v-if="dialogMncWinVisible" ref="mncWin" />
  </el-card>
</template>

<script>
import mix from "./plmnMana-mixins.js";
export default {
  mixins: [mix]
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
}
</style>