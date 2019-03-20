<template>
    <div class="content">
        <!-- <CommonTree  v-on:get-currentKey="getCurrentKey" :checked-nodes="SelectNode"  :checked-keys="SelectDatas" :expand-all="false" :set-width="width" :set-title='title' :btn-name='btnName' :switch-state='true' :max-length='2' :switch-pose='460020' ></CommonTree>
        <CommonTree  v-on:get-currentKey="getCurrentKey" :checked-nodes="SelectNode"  :checked-keys="SelectDatas" :expand-all="false" :set-width="width" :set-title='title' :btn-name='btnName' :industry-type='true' :max-length='4' :switch-pose='460020'></CommonTree> -->

    
    <div class="treeData">
        <el-menu
            mode="horizontal"
            menu-trigger='hover'
            unique-opened
            background-color="#fff">
            <NavMenu :navMenus="menuData" @nodeClick="navClick"></NavMenu>
        </el-menu>
    </div>
    </div>
</template>
<script>

import CommonTree from './Tree-common'
import NavMenu from './NavMenu.vue'
export default {
    components: {
       CommonTree,
       NavMenu
    },
  data() {
    return {
        SelectDatas:[],
        SelectNode:[],
        SelectState:false,
        checkCont:false,
        checkId:'',
        dataList:[],
        width:'30%',
        title:'控件',
        btnName:'弹出框',
        menuData:[]


    };
  },
  computed:{},
  methods: {
     getCurrentKey(takeDate,keyDate){
         console.log(takeDate,keyDate)
     },
     navClick(val){
         this.checkId=val.id;
         if(!this.IsContain(this.dataList,val)){
             this.dataList.push(val)
         }else{
             this.dataList.splice(this.dataList.indexOf(val), 1);   
         }

     },
     IsContain(arr,value)
        {
        for(var i=0;i<arr.length;i++)
        {
            if(arr[i].id==value.id)
            return true;
        }
        return false;
        }
  },
  mounted() {
  },
};
</script>


<style lang="less" >
.treeData{
    width: 1200px;
    height: 500px;
    margin: auto;
    margin-top: 100px;
    // .is-opened{
    //     float: left;
    // }
    
}
// .treeData>.navMenu{
//     .navMenu{
//         .el-submenu__title{float: left;}
//         .el-menu{float: left;}
//     }
// }
</style>
