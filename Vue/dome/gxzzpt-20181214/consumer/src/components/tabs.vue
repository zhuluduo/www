<template>
    <ul class="tabs">
        <!-- <li v-for="(tab,index) in tabs" :key="index" :class="index == activeIndex?'checked':''" @click="changeTab(tab, index)">{{tab.name}}</li> -->
        <li v-for="(tab,index) in tabs" :key="index" :class="tab.isCheck?'checked':''" @click="changeTab(tab, index)">{{tab.name}}</li>
    </ul>
</template>
<script>
export default {
    props:{
        tabs:Array
    },
    data() {
        return {
            activeIndex: 0
        }
    },
    methods:{
        changeTab(tab, index) {
            this.tabs.map(( item ) => {
                item.isCheck = false;
            })
            tab.isCheck = true;
            this.$emit('click', tab);
        }
    }
}
</script>
<style scoped lang="less">
  @common-color:#3f8def;
 .tabs {
    display: flex;
    li {
      padding: 5px 10px;
      min-width: 66px;
      box-sizing: border-box;
      text-align: center;
      cursor: pointer;
      & + li {
        margin-left: 12px;
      }
    }
    .checked {
      background: @common-color;
      color: #fff;
    }
  }
</style>
