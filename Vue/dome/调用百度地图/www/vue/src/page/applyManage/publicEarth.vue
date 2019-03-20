<template>
  <div>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24">
        <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>共建地球</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="container pull-top">
       <el-button type="primary" size="small" @click="$router.push('areaManage')">区域管理</el-button>
       <el-button type="primary" size="small" @click="$router.push('EventAnalysis')">事件分析</el-button>
      </el-col>
       <el-col :span="24"  class="container pull-top">
        <div class="summary-section-content">
          <el-col :xs="24" :sm="8" :md="6" :lg="6" class="box-content-line-1 box-content-spacing box-content-before">
            <span class="summary-section-icon icon-color-1 pull-left"><i class="el-icon-service"></i></span>
            <span class="summary-section-text" style="position:absolute;">
              <strong class="text-success">任务总量</strong>
              1234,567
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-3 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
            </span>
          </el-col>
        </div>
      </el-col>
       <el-col :span="24" class="container pull-top">
        <div class="summary-section-content">
          <el-col :xs="24" :sm="8" :md="6" :lg="6" class="box-content-line-1 box-content-spacing box-content-before">
            <span class="summary-section-icon icon-color-1 pull-left"><i class="el-icon-service"></i></span>
            <span class="summary-section-text" style="position:absolute;">
              <strong class="text-success">任务总量</strong>
              1234,567
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-asce"><i data-v-48df4bf2="" class="el-icon-caret-top"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-desce"><i data-v-48df4bf2="" class="el-icon-caret-top"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-asce"><i data-v-48df4bf2="" class="el-icon-caret-top"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-asce"><i data-v-48df4bf2="" class="el-icon-caret-top"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-3 box-content-spacing content-detail-item">
              <!-- <a  @click="this.$router.push('areaManage')" class="item">区域管理</a> -->
              <span @click="$router.push('areaManage')" class="item">区域管理</span>
              <span @click="$router.push('ReviewOperation')" class="item">评审操作</span>
              <span @click="$router.push('versionManage')" class="item">版本管理</span>
          </el-col>
        </div>
      </el-col>
      <el-col :span="24" class="container pull-top">
        <div class="summary-section-content">
          <el-col :xs="24" :sm="8" :md="6" :lg="6" class="box-content-line-1 box-content-spacing box-content-before">
            <span class="summary-section-icon icon-color-1 pull-left"><i class="el-icon-service"></i></span>
            <span class="summary-section-text" style="position:absolute;">
              <strong class="text-success">任务总量</strong>
              1234,567
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-asce"><i data-v-48df4bf2="" class="el-icon-caret-top"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-asce"><i data-v-48df4bf2="" class="el-icon-caret-top"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-asce"><i data-v-48df4bf2="" class="el-icon-caret-top"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-2 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-desce"><i data-v-48df4bf2="" class="el-icon-caret-bottom"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
          <el-col :span="4" class="box-content-line-3 box-content-spacing">
            <span class="summary-section-text">
              <strong class="text-success">任务总量</strong>
              1234798
              <i class="pull-block ">
              <strong  class="text-success text-Proportion pull-left text-Proportion-asce"><i data-v-48df4bf2="" class="el-icon-caret-top"></i>10%</strong>
              <strong  class="text-success">任务总量</strong>
              </i>
            </span>
          </el-col>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  },
  methods:{

  },
  mounted(){

  },
}
</script>

<style scoped lang='less'>
  .container{
    text-align: initial;
    line-height: initial;
      span{display: inline-block;}
      .icon-color-1{background-color: #3aa1f2;}
  }
  .summary-section-content{
    width: 100%;
    overflow: hidden;
    box-sizing: border-box;
    border: 1px solid #dedede;
      .box-content-spacing{
        padding: 18px;
      }
      .box-content-before{
         &::before{
          content: '';
          width: 1px;
          height: 60px;
          border: 1px solid #e6e6e68c;
          float: right;
          margin-right: 30px;
        }
      }
      .content-detail-item{
        .item{
          display: block;
          text-decoration: none;
          color: #3aa1f2;
          font-size: 14px;
          padding-bottom: 5px;
          cursor: pointer;
          &:hover{
            color: #1d90ea;
            text-decoration: underline;
          }
        }
      }
  }
  .summary-section-icon{
    width: 60px;
    height:60px;
    border-radius: 50%;
    text-align: center;
    line-height: 60px;
    font-size: 29px;
    color: #fff;
    margin: 0 25px 0 15px;
  }
  .summary-section-text{
      font-family: '微软雅黑 Regular', '微软雅黑';
      font-weight: 410;
      font-style: normal;
      font-size: 28px;
      color: #666666;
    .text-success{
      font-size: 12px;
      color: #989898;
      font-family: '微软雅黑';
      font-weight: 400;
      font-style: normal;
      display: block;
      padding: 2px 0 5px 0;
    }
    .text-Proportion{padding-right: 5px;}
    .text-Proportion-asce{color: #2eba07}
    .text-Proportion-desce{color: #fd6010}
  }
</style>