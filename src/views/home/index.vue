<template>
  <el-container class="container">
    <el-header class="header">
      <div class="logo_tile">
        <h2>{{this.deviceInfo.deviceTypeString+'[ID:'+this.deviceInfo.deviceId+']'}}</h2>
      </div>
      <div class="right">
        <p>{{'您好，'+this.user.userName}}</p>
        <el-button
          icon="el-icon-lock"
          size="mini"
          :type="lockType"
          @click="lock"
          round
          v-if="$store.state.user.userName == 'root'"
        ></el-button>
        <el-button size="mini" type="danger" @click="restart" round>重启系统</el-button>
        <el-button size="mini" type="success" @click="logout" round>退出</el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside class="aside" :width="asideWith">

        <el-button
          style="margin-left: 5px;"
          icon="el-icon-arrow-right"
          @click="changeAsideWith()"
          v-if="isCollapse"
          circle
        ></el-button>

        <el-button
          style="margin-left: 150px;"
          icon="el-icon-arrow-left"
          @click="changeAsideWith()"
          v-if="!isCollapse"
          circle
        ></el-button>

        <el-menu
          :unique-opened="true"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
        >
          <el-submenu :index="item.id+''" v-for="(item,i) in menus" :key="i">
            <template slot="title">
              <i :class="item.icon"></i>
              <span>{{item.name}}</span>
            </template>

            <el-menu-item
              @click="addTab(item1)"
              v-for="(item1,i) in item.children"
              :key="i"
              :index="item1.path"
            >
              <i :class="item1.icon"></i>
              <span>{{item1.name}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main class="main">
        <el-tabs
          @tab-click="changeTab(editableTabsValue)"
          v-model="editableTabsValue"
          type="border-card"
          @tab-remove="removeTab"
        >
          <el-tab-pane :closable="false" label="首页" name="0">
            <info />
          </el-tab-pane>
          <el-tab-pane
            class="tabPane"
            closable
            v-for="(item, index) in editableTabs"
            :key="index"
            :label="item.title"
            :name="item.name"
          >
            <router-view></router-view>
          </el-tab-pane>
        </el-tabs>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import mix from "./home-mixins.js";
export default {
  mixins: [mix]
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  .header {
    background-color: #409eff;
    display: flex;
    justify-content: space-between; //均匀排列每个元素首个元素放置于起点，末尾元素放置于终点
    align-items: center;
    padding: 0;
    user-select: none; //文本不能被选择
    .logo_tile {
      display: flex;
      align-items: center;
      color: white;
      h2 {
        font-family: "微软雅黑";
        font-weight: bold;
        margin-left: 10px;
      }
    }
    .right {
      display: flex;
      margin-right: 10px;
      align-items: center;
      p {
        font-size: 15px;
        color: white;
        margin-right: 10px;
      }
    }
  }
  .aside {
    .switch {
      margin-left: 10px;
    }
    .el-menu-vertical-demo:not(.el-menu--collapse) {
      width: 200px;
      min-height: 400px;
    }
    margin-top: 20px;
  }
  .main {
    background-color: white;

    .tabPane {
      height: 100%;
    }

    el-tabs {
      height: 100%;
      background-color: #d3dce6;
    }
  }
}
</style>