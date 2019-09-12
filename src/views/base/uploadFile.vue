<template>
  <el-dialog
    style=" margin-top: 150px;"
    :title="title"
    :visible.sync="dialogVisible"
    width="30%"
    append-to-body
  >
    <!-- :on-success="getResult" -->
    <el-upload
      class="upload-demo"
      ref="upload"
      :action="url"
      :http-request="submitFile"
      :on-change="handleChange"
      :file-list="fileList"
      :auto-upload="false"
      :accept="fileType"
      :limit="1"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <div slot="tip" class="el-upload__tip">{{tip}}</div>
    </el-upload>

    <div slot="footer" class="dialog-footer">
      <el-button size="medium" @click="dialogVisible = false">取 消</el-button>
      <el-button size="medium" type="primary" icon="el-icon-folder" @click="submitUpload()">上传</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      dialogVisible: false,
      tip: "",
      fileType: "",
      core: {},

      file: "",
      fileName: "",
      fileList: [],
      url:
        // this.$store.state.baseUrl +
        // "/coreBoard.do?method=importFapParam&filename="
        "/coreBoard.do?method=importFapParam"
    };
  },
  methods: {
    initFile(title, tip, fileType, core) {
      this.title = title;
      this.tip = tip;
      this.fileType = fileType;
      this.core = core;

      this.dialogVisible = true;
    },
    submitFile() {
      var form = new FormData();
      form.append("file", this.file);
      form.append("filename", this.fileName);
      form.append("ip", this.core.ip);
      form.append("manufactor", this.core.manufactor);
      form.append("boardType", this.core.boardType);

        console.log(form.get('file'))

      const res = this.$http.post(this.url, form);

      console.log(res);
    },
    submitUpload() {
      //   this.url +=
      //     this.fileName +
      //     "&ip=" +
      //     this.core.ip +
      //     "&manufactor=" +
      //     this.core.manufactor +
      //     "&boardType=" +
      //     this.core.boardType;
      this.$refs.upload.submit();
    },
    getResult(res) {
      console.log(res);
    },
    handleChange(file, fileList) {
      this.fileName = file.name;
      this.file = file.row;
    }
  }
};
</script>

<style lang="scss" scoped>
.dialog-footer {
  margin-top: -40px;
}
</style>