<template>
  <el-card class="box-card">
    <el-row class="search">
      <el-col>
        <el-button plain @click="showDialog()" type="success">添加用户</el-button>
        <el-button
          v-if="this.multipleSelection.length > 0"
          plain
          @click="delUsers()"
          type="danger"
        >批量删除</el-button>
      </el-col>
    </el-row>

    <!-- 表格 -->
    <el-table
      height="500px"
      :data="userList"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column prop="userName" label="用户名"></el-table-column>
      <el-table-column prop="realName" label="真实姓名"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1" style="color: green;">启用</span>
          <span v-if="scope.row.status !== 1" style="color: red;">禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>

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
          <el-button @click="resetPwd(scope.row)" type="warning" icon="el-icon-key" circle size="mini" plain></el-button>
          <el-button
            @click="showDel(scope.row.userUUID)"
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
          @click="refreshUsers()"
          icon="el-icon-refresh"
          circle
          size="mini"
        ></el-button>
      </el-col>
    </el-row>

    <el-dialog :title="title" :visible.sync="dialogFormVisible" width="550px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" label-width="100px" prop="userName">
          <el-input :disabled="disabled" v-model="ruleForm.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" label-width="100px" prop="realName">
          <el-input v-model="ruleForm.realName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="title!='修改用户'" label="密码" label-width="100px" prop="password">
          <el-input v-model="ruleForm.password" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item v-if="title!='修改用户'" label="确认密码" label-width="100px" prop="secondPassword">
          <el-input v-model="ruleForm.secondPassword" autocomplete="off" show-password></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px" prop="status">
          <el-select v-model="ruleForm.status" placeholder="请选择">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="禁用" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" label-width="100px" prop="remark">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="ruleForm.remark"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addOrEditUser('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import mix from "./users-mixins.js";
export default {
  mixins: [mix]
};
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;

  .dialog-footer {
    margin-top: -20px;
  }

  .page-row {
    margin-top: 10px;
    .reflashBtn {
      margin-left: -10px;
      margin-top: 4px;
    }
  }
}
</style>