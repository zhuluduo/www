
<template>
  <div>
    <div class="btnbox">
      <div class="btn" @click="toShow">打开picker</div>
    </div>
    <div class="result">
      <p>----选择结果----</p>
      <p>{{res}}</p>
    </div>
    <vue-pickers
      :show="show"
      :columns="columns"
      :selectData="pickData"
      @cancel="close"
      @confirm="confirmFn"></vue-pickers>
  </div>
</template>

<script>
import vuePickers from 'vue-pickers'
export default {
  components: {
    vuePickers
  },
  data() {
    return {
      isCopy: '',
      show: false,
      columns: 1,
      defaultData: [
        {
          text: 1999,
          value: 1999
        }
      ],
      pickData: {
        // 第一列的数据结构
        data1: [
          {
            text: 1999,
            value: 1999
          },
          {
            text: 2001,
            value: 2001
          },
          {
            text: 2002,
            value: 2002
          },
          {
            text: 2003,
            value: 2003
          },
          {
            text: 2004,
            value: 2004
          },
          {
            text: 2005,
            value: 2005
          },
        ]
      },
      res: null
    }
  },
  methods: {
    close() {
      console.log(123)
      this.show = false
    },
    confirmFn(val) {
      console.log(val)
      this.show = false
      this.res = val
      this.defaultData = [val.select1]
    },
    toShow() {
      this.show = true
    }
  }
}
</script>

<style>
.btnbox{
  display: flex;
  justify-content: center;
}
.btn{
  background: #2e68fa;
  color: #fff;
  padding: 5px 10px;
  display: inline-block;
  margin: 0 10px;
  font-size: 14px;
  border-radius: 4px;
}
.result{
  text-align: center;
  padding: 10px;
}
.isCopy{
  margin: 10px;
  border: 1px dashed red;
  text-align: center
}
</style>


