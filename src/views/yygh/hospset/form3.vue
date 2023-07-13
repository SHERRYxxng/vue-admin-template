<template>
  <div class="app-container">

    <!--  :model 表单绑定的json -->
    <el-form
      :model="hospset"
      :rules="rules"
      ref="hospset"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="医院名称" prop="hosname">
        <el-input v-model="hospset.hosname"></el-input>
      </el-form-item>

      <el-form-item label="医院医院编号" prop="hoscode">
        <el-input v-model="hospset.hoscode"></el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('hospset')">立即创建</el-button>
        <el-button @click="resetForm('ruleForm')">重置</el-button>
      </el-form-item>

    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
        hospset: {},
        rules: {
        //    作用于hospset.hosname控件的规则
          hosname: [
            { required: true, message: '请输入医院名称', trigger: 'blur' },
            { min: 4, max: 10, message: '长度在 4 到 10 个字符', trigger: 'blur' }
          ]
        }
    };
  },
  methods: {
    submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //验证通过
            // alert('submit1!');
          } else {
            //验证失败
            // alert('submit2!');
            return false;
          }
        });
      }
  },
  created() {},
};
</script>
