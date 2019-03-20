<template>
  <div class="navMenu">
    <template v-for="navMenu in navMenus">    
      <!-- 最后一级菜单 -->
      <div v-if="!navMenu.children" :key="navMenu.id" class="menu-list">
      <!-- <el-menu-item class="menu-item-last" v-if="expandAll==false" :key="navMenu.id" :data="navMenu" :index="navMenu.techniqueCatalogName">
        <div slot="title" @click="checkboxGroup(navMenu,$event)">
            <span >{{navMenu.techniqueCatalogName}}</span>
        </div>
      </el-menu-item> -->
       <!-- <div class="menu-item-last" v-if="expandAll==true"  :key="navMenu.id" :data="navMenu" :index="navMenu.techniqueCatalogName">
        <div slot="title" @click="checkboxGroup(navMenu,$event)" class="menu-item-cont">
            <span>{{navMenu.techniqueCatalogName}}</span>
        </div>
        </div> -->
        <div class="menu-item-last"   :key="navMenu.id" :data="navMenu" :index="navMenu.name">
        <div slot="title" @click="checkboxGroup(navMenu,$event)" class="menu-item-cont">
            <span>{{navMenu.name}}</span>
        </div>
        </div>
      </div>
      <!-- 此菜单下还有子菜单 -->
      <el-submenu class="submenuList" v-if="navMenu.children" :key="navMenu.id" :data="navMenu" :index="navMenu.name" >
        <template slot="title" class="submenu-title">
          <span> {{navMenu.name}}</span>
        </template>
        <!-- 递归 -->
        <NavMenu :navMenus="navMenu.children"  @nodeClick="outClick"  :expand-all.sync="expandAlls"></NavMenu>
      </el-submenu>
    </template>
    <div class="btns">
    <div v-if="checkState==false">
      <div class="check-box" @click="checkStates">
        <span>多选</span><i class="el-icon-plus"></i>
      </div>
    </div>
    <div v-if="checkState==true">
      <div class="check-box nocheck" @click="closeCheck">
        <span>取消多选</span>
      </div>
    </div>
    </div>
  </div>
</template>
 <script>
export default {
  name: 'NavMenu',
  props: ['navMenus','expandAll',],
 data() {
 return {
    checkCont:false,
    checkState:false,
    checkID:'',
    checkDate:[],
    checkList:[],
    expandAlls:false,
 }
 },
watch:{

},
 methods: {
  //单选/多选状态
  checkStates(){
    this.checkState=true;
    this.expandAlls=true;
    this.$emit('update:expandAll', true)
  },
  closeCheck(){
    this.checkState=false;
    this.expandAlls=false;
    this.$emit('update:expandAll', false)
  },

  //获取选中的值
  checkboxGroup(val,eve){
    if(eve.srcElement.className=='checkActive'){
        eve.srcElement.className=''
    }else{
      eve.srcElement.className='checkActive'
    }
    if(this.expandAll==false){
      var names=document.getElementsByClassName('el-menu--horizontal')
      var i;
      for (i = 0; i < names.length; i++) {
          names[i].style.display = "none";
      }
    }
     this.$emit('nodeClick',val);
  },
  outClick(val){
     this.$emit('nodeClick',val);
  }
 },
mounted() {
},
}
</script>
 <style>

</style>
<style lang="less" >

.el-submenu__icon-arrow{
    right: 1px;
    margin-top: -4px;
}
.navMenu>.btns{display:none;}
.el-menu--horizontal{
  .el-submenu__title{
    color: #a09f9f!important;
    .el-submenu__icon-arrow{right: 5px;}
  }
  li.is-opened{
      .el-submenu__title i{
        color: #fff!important;
      }
  }
  ul.el-menu--popup{
    box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.22);
  }
  .el-menu--popup-bottom-start{
        margin-top: 2px;
  }
  ul{
    .btns{display:block;}
    .navMenu{
      li{
        .el-submenu__title{
          height: 22px;
          line-height: 22px;
          padding-right: 20px;
          &:hover{
           color: #fff;
           background-color: #3f8def!important;
          }
          span{
            display: block;
            color: #a09f9f;
            &:hover{
            color: #fff;
            }
          }
        }
        ul{
          .navMenu{
             .btns{display:none;} 
          }
        }
      }
    }
  }
  .menu-item-last{
    height: 22px!important;
    line-height: 20px!important;
    span{
      display: block;
      color: #a09f9f;
    }
    &:hover{
     background-color: #3f8def!important;
     span{ color: #fff!important;}
    }
  }
}

.treeData{
  padding-left: 17px;
  margin-left: -10px;
  .el-menu--horizontal{top:0!important}
  ul{
    .navMenu{
      .menu-list{display: inline-block;float: left;}
      li{
        float: left;
        margin: 0 15px 15px 0;
        position: relative;
        .el-submenu__title{
          width: 122px;
          height: 26px;
          line-height:24px;
          background-color: #f1f1f1!important;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          i{color: #b4b4b4;}
          .el-submenu__icon-arrow{right: 10px;}
        }
      }
      li.is-opened{
        &::before{
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          background: #fff;
          width: 122px;
          height: 11px;
          z-index: 2999;
        }
        .el-submenu__title{
          background-color: #fff!important;
          box-shadow: 0px 1px 16px 0px rgba(0, 0, 0, 0.22);
          i{color: #b4b4b4!important;}
        }
      }
    }
  }
}
.treeData>.el-menu--horizontal.el-menu{display:block!important}
.el-menu--horizontal{
  li{
    float:none;
  }
}
.submenuList{
  .el-menu--horizontal{
    top: 0!important
  }
}

</style>
<style lang="less" scoped>
.checkActive{color: #3f8def!important;}
.btns{
    overflow: hidden;
    margin-top:12px;
    margin-left: 10px;
    margin-bottom: 8px;
  .check-box+.check-box{margin-left: 5px;}
  .check-box{
    width:50px;
    height:26px;
    background-color: #fff;
    border: solid 1px #d0d0d0;
    text-align: center;
    line-height: 25px;
    float: left;
    border-radius: 4px;
    cursor: pointer;
    span{
    color: #777;  
    display: inline-block;
    }
    i{
      color: #8e8e8e;;
      padding-left: 2px;
    }
  }
  .nocheck{
      width: 70px;
  }
}
.menu-item-cont{
    height: 22px;
    line-height: 22px;
    padding: 0 10px;
    cursor: pointer;
    transition:all .2s;
    -moz-transition:all .2s; 
    -webkit-transition:all .2s; 
    -o-transition:all .2s;
    &:hover{
     background-color: #3f8def;
    }
}
</style>

