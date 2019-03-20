<template>
    <div class="content">
        <div class="banner">
          <!-- <img src="../assets/temporary-img/index1/3D打印banner.png" alt=""> -->
            <div>
              <p>云3D打印 从虚拟到现实 一键打印</p>
            <!--   <div class="btn" @click="$router.push({path: '/auto-quotation', query:{serviceId: service.id, serviceName:service.serviceName}});">快速下单 >></div> -->
            <div class="btn-wrapper">
              <div class="btn" @click="autoQuote" v-if="(user.isValid&&!user.isManufacturer)||!user.isValid||(user.isValid&&user.isManufacturer&&user.isDemand)">自动报价 >></div>
              <div class="btn" @click="toPublish()" v-if="(user.isValid&&!user.isManufacturer)||!user.isValid||(user.isValid&&user.isManufacturer&&user.isDemand)">人工报价 >></div>
            </div>
            </div>
        </div>
        <div class="message">
          <div>
            <div>
              <img src="../../static/img/new.png" alt="">
              <p>最新发布</p>
            </div>
            <ul>
              <li>曹总 刚刚发布了新的需求</li>
              <li>灰姑娘 刚发布了新的需求</li>
              <li>王子加 刚刚发布了新的需求</li>
            </ul>
          </div>
        </div>
        <div class="wrapper">
            <div class="news">
              <div class="left">
                <div class="title">
                  <div class="name">行业资讯</div>
                  <div class="more">查看更多&gt;</div>
                </div>
                <ul>
                  <li>
                    <div class="top">
                      <img src="../assets/temporary-img/index1/走进人工智能.png" alt="">
                      <div>
                        <p class="common-ellipsis-1 modal-name">走近智能制造：3D打印“众生相”</p>
                        <div class="news-content common-ellipsis-3">在2018年全国科技活动周暨北京科技周活动主场，科技创新“惠民生”的智造生活展区，一台正在工作的...</div>
                      </div>
                    </div>
                    <div class="bottom">
                      <div class="mark">挑战不可能 3D打印助力“颅面复原技术”破获案件</div>
                      <div class="mark">3D打印人造色素可应用于传感器和可拉伸电子产品</div>
                      <div class="mark">3D打印生物陶瓷支架用于骨软再生及骨肿瘤治疗方</div>
                    </div>
                  </li>
                  <li>
                    <div class="top">
                      <img src="../assets/temporary-img/index1/耐克推出.png" alt="">
                      <div>
                        <p class="common-ellipsis-1 modal-name">耐克推出一款3D打印织坊鞋面的...</p>
                        <div class="news-content common-ellipsis-3">耐克一直在寻找制造鞋子和材料的新方法。该公司最新的创新产品名为Flyprint，被誉为第一款用于高性能鞋类....</div>
                      </div>
                    </div>
                    <div class="bottom">
                      <div class="mark">3D打印技术在骨科与康复辅具中的应用</div>
                      <div class="mark">国产电影《最后的锦衣卫》良心道具竟是3D打印而成</div>
                      <div class="mark">3D打印定制平台Shapeways再获1.9亿投资</div>
                    </div>
                  </li>
                </ul>
              </div>
              <div class="right">
                <div class="title">
                  <div class="name">最新询盘</div>
                  <div class="more">查看更多&gt;</div>
                </div>
                <ul>
                  <li>
                    <div>一组医疗三维模型建模</div>
                    <p>1小时前</p>
                  </li>
                  <li>
                    <div>3D打印具有特色的包装容器</div>
                    <p>2小时前</p>
                  </li>
                  <li>
                    <div>镂空的球体容器</div>
                    <p>6小时前</p>
                  </li>
                  <li>
                    <div>需求一个锤石魂灯模型</div>
                    <p>1天前</p>
                  </li>
                  <li>
                    <div>手机指环支架设计</div>
                    <p>4天前</p>
                  </li>
                  <li>
                    <div>需求一个锤石魂灯模型</div>
                    <p>5天前</p>
                  </li>
                  <li>
                    <div>镂空的球体容器</div>
                    <p>6天前</p>
                  </li>
                </ul>
              </div>
            </div>
            
        </div>
        <div class="wrapper">
          <div class="wrapper-row">
              <div class="row-title">产品案例</div>
              <div class="row-main case">
                <ul>
                  <li>
                    <img src="../assets/temporary-img/index1/3D-ANLI-1.png" alt="">
                    <div>
                      <div>机械键盘帽悟空头</div>
                      <p>工艺：3D打印</p>
                      <p>材料：光敏树脂</p>
                      <p>供应商：佛山还德森科技有限公司</p>
                    </div>
                  </li>
                  <li>
                    <img src="../assets/temporary-img/index1/3D-ANLI-2.png" alt="">
                    <div>
                      <div>孙悟空模型</div>
                      <p>工艺：3D打印</p>
                      <p>材料：PLA</p>
                      <p>供应商：苏州瓦诺科技有限公司</p>
                    </div>
                  </li>
                  <li>
                    <img src="../assets/temporary-img/index1/3D-ANLI-3.png" alt="">
                    <div>
                      <div>抽屉柜子</div>
                      <p>工艺：3D打印</p>
                      <p>材料：尼龙</p>
                      <p>供应商：慈溪市库瑞德塑业有限公司</p>
                    </div>
                  </li>
                  <li>
                    <img src="../assets/temporary-img/index1/3D-ANLI-4.png" alt="">
                    <div>
                      <div>青铜爵</div>
                      <p>工艺：3D打印</p>
                      <p>材料：金属</p>
                      <p>供应商：合肥高科科技股份有限公司 </p>
                    </div>
                  </li>
                </ul>
                <div class="page">
                  <span v-for="(item,index) in caseList" :class="item.selected?'selected':''" :key="index" @click="switchCase(item)"></span>
                </div>
              </div>
          </div>
          <div class="wrapper-row">
            <div class="row-title crafts-tab">
              <p>材料工艺</p>
              <div>
                <div class="selected">打印材料</div>
                <div>处理工艺</div>
              </div>
            </div>
            <div class="row-main crafts">
              <ul>
                <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index1/PLA.png" alt="">
                   </div>
                   <p class="name">PLA</p>
                   <p class="info">PLA（聚乳酸）是一种新型的生物降解材料，使用可再生的植物资源（如玉米）所提出的淀粉原料制成。PLA强度高无卷...，收缩率极低（0.3%）环保材料，堆肥可100%降解，成型性能优秀，热成型尺度稳定，层与层之间的粘合性好，同时也拥有良好的光泽性。PLA的相容性、可降解性、机械性能和物理性能良好，适用于吹塑、热塑等各种加工方法，加工方便，应用十分广泛。</p>
                 </li>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index1/CAILIAO2.png" alt="">
                   </div>
                   <p class="name">光敏树脂</p>
                   <p class="info">光敏树脂材料是SLA快速成型专用3D打印材料，立体印刷3D打印成型，也称液态光敏树脂选择性固化，通常简称为光固化...型。SLA技术是基于液态光敏树脂的光固化原理，这种树脂材料在一定波长和强度的紫外光（激光波长位于紫外波段,入一325nm）的照射下能迅速发生交联反应而生成固化物。</p>
                 </li>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index1/CAILIAO3.png" alt="">
                   </div>
                   <p class="name">光敏树脂</p>
                   <p class="info">尼龙为一种白色的粉末，SLS尼龙粉末材料具有质量轻，耐热，磨擦系数低，耐磨损等特点。粉末粒径小，制作模型精度...。烧结制件不需要特殊的后处理，即可以具有较高的抗拉伸强度。在颜色方面的选择没有像PLA和ABS这么广，但可以通过喷漆、浸染等方式进行色彩的选择和上色。材料热变形温度为110℃。</p>
                 </li>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index1/CAILIAO-4.png" alt="">
                   </div>
                   <p class="name">光敏树脂</p>
                   <p class="info">3D打印所使用的金属粉末一般要求纯净度高、球形度好、粒径分布窄、氧含量低。目前，应用于3D打印的金属粉末材料主...有钛合金、钴铬合金、不锈钢和铝合金材料等，此外还有用于打印首饰用的金、银等贵金属粉末材料。 金属3D打印材料的应用领域相当广泛，例如，石化工程应用、航空航天、汽车制造、注塑模具、轻金属合金铸造、食品加工、医疗、造纸、电力工业、珠宝、时装等</p>
                 </li>
              </ul>
            </div>
          </div>
          <div class="wrapper-row">
              <div class="row-title">供应商</div>
              <div class="row-main manufacturer">
               <ul>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index1/ZZS1.png" alt="">
                   </div>
                   <p class="name">佛山海德森科技有限公司</p>
                   <p class="info">工艺：机械加工 3D打印 注塑 模夹具</p>
                   <p class="info">行业：通讯设备 手机零件</p>
                   <p class="info">工厂面积：10000 ㎡</p>
                   <p class="info">区域：中国  佛山</p>
                   <p class="info star">评分：
                     <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                   </p>
                 </li>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index1/ZZS2.png" alt="">
                   </div>
                   <p class="name">慈溪市库瑞德塑业有限公司</p>
                   <p class="info">工艺：3D打印 塑胶成型  模具制造</p>
                   <p class="info">行业：机械及工具行业 塑料和橡胶</p>
                   <p class="info">工厂面积：80000 ㎡</p>
                   <p class="info">区域：中国  浙江</p>
                   <p class="info star">评分：
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                   </p>
                 </li>
                 <li>
                   <div class="img">
                      <img src="../assets/temporary-img/index1/ZZS3.png" alt="">
                   </div>
                   <p class="name">苏州瓦诺科技有限公司</p>
                   <p class="info">工艺：塑胶成型, 模具制造</p>
                   <p class="info">行业：包装, 医药工业, 塑料和橡胶工业 </p>
                   <p class="info">工厂面积：5000 ㎡</p>
                   <p class="info">区域：中国  苏州</p>
                   <p class="info star">评分：
                     <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                   </p>
                 </li>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index1/ZZS4.png" alt="">
                   </div>
                   <p class="name">合肥高科科技股份有限公司</p>
                   <p class="info">工艺： 模具制造, 塑胶成型	</p>
                   <p class="info">行业：机械及工具行业, 汽车工业 </p>
                   <p class="info">工厂面积：40000 ㎡</p>
                   <p class="info">区域：中国 安徽</p>
                   <p class="info star">评分：
                     <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                      <img class="star" src="../../static/img/star.png" alt="">
                   </p>
                 </li>
               </ul>
              </div>
            </div>
        </div>
    </div>
</template>
<script>
import { mapState, mapActions } from 'vuex';
import p1 from "../../static/img/最新询盘-板金.png";
import p2 from "../../static/img/最新询盘-冲压.png";
import p3 from "../../static/img/最新询盘-机加工.png";
export default {
  data() {
    return {
      service:'',
      caseList: [{ selected: true }, { selected: false }, { selected: false }],
      select: {},
      inputContent: "",
      data1: [
        {
          name: "板金",
          data: [
            { url: p1, name: "不锈钢", num: "50,000件" },
            { url: p2, name: "热塑性塑料", num: "50,000件" }
          ],
          current: 0
        },
        {
          name: "塑胶成型",
          data: [
            { url: p3, name: "热塑性塑料", num: "20,000件" },
            { url: p2, name: "铝", num: "50,000件" }
          ],
          current: 0
        },
        {
          name: "机加工",
          data: [{ url: p1, name: "铝", num: "1,000件" }],
          current: 0
        },
        {
          name: "板金",
          data: [{ url: p2, name: "紫铜", num: "1,000件" }],
          current: 0
        },
        {
          name: "冲压",
          data: [{ url: p1, name: "紫铜", num: "1,000件" }],
          current: 0
        }
      ]
    };
  },
  created() {
    this.getService();
  },
  computed: {
      ...mapState({
          user: state => state.user,
      }),
  },
  methods: {
    //获取服务
    getService() {
      this.$http.post('/custom/service/all').then(( res ) => {
        if ( res.data.code == 200 ) {
          this.service = res.data.data[0];
        }
      })
    },

    autoQuote() {
      if ( this.user.isValid ) {
        this.$router.push({path: '/quote/auto', query:{serviceId:this.service.id}});
      } else {
        this.$login({});
      }

    },

    toPublish() {
      if ( this.user.isValid ) {
        this.$router.push({path: '/quote/3d', query:{techniqueType:530010}});
      } else {
        this.$login({});
      }
    },
    switchCase(row) {
      if (row.selected) return;
      this.caseList.map(ele => {
        ele.selected = false;
      });
      row.selected = true;
    },
    goNext(item, i) {
      if (item.current == this.data1[i].data.length - 1) {
        item.current = 0;
        return;
      }
      item.current += 1;
    },
    goPre(item, i) {
      if (item.current == 0) {
        item.current = this.data1[i].data.length - 1;
        return;
      }
      item.current -= 1;
    }
  }
};
</script>
<style lang="less" scoped>
@common-color: #3f8def;
.content {
  padding-bottom: 50px;
}
.banner {
  width: 100%;
  background: url("../assets/temporary-img/index1/3D打印banner.png");
  background-repeat: no-repeat;
  background-position: center;
  div{
    margin: auto;
    width: 1200px;
    height: 379px;
    p {
      height: 40px;
      font-size: 40px;
      line-height: 1;
      // letter-spacing: 2px;
      color: #ffffff;
      padding-top: 115px;
    }
    .btn-wrapper{
      display: flex;
      justify-content: center;
      height: 50px;
      margin-top: 72px;
      .btn {
      //  margin: 72px 0 0 0; 
        width: 170px;
        height: 50px;
        background-color: #3f8def;
        // border-radius: 22px;
        text-align: center;
        line-height: 50px;
        color: #fff;
        font-size: 22px;
        cursor: pointer;
        margin: 0 50px;
      }
    }
  }
}
.wrapper {
  width: 1200px;
  margin: auto;
}
.news {
  height: 268px;
  background-color: #ffffff;
  border: solid 1px #e2e2e2;
  display: flex;
  margin-top: 30px;
  .left {
    width: 813px;
    border-right: 1px solid #e2e2e2;
    ul {
      // width: 100%;
      display: flex;
      padding: 15px;
      li {
        width: 376px;
        & + li {
          margin-left: 41px;
        }
        .top {
          height: 88px;
          display: flex;
          > img {
            width: 130px;
            height: 88px;
          }
          > div {
            margin-left: 9px;
            flex: 1;
            overflow: hidden;
            color: #919191;
            p {
              color: #333;
              font-weight: bold;
              height: 14px;
              line-height: 14px;
              margin-bottom: 5px;
            }
            .news-content{
              height: 70px;
              line-height: 25px;
            }
          }
        }
        .bottom {
          margin-top: 24px;
          font-size: 13px;
          color: #333;
          > div {
            & + div {
              margin-top: 15px;
            }
          }
          .mark {
            text-indent: 6px;
            position: relative;
            cursor: pointer;
            padding: 0 0 0 4px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            &:before {
              position: absolute;
              content: "";
              width: 4px;
              height: 4px;
              border-radius: 50%;
              background: #919191;
              left: 0px;
              top: 50%;
              margin-top: -2px;
            }
            &:hover {
              color: @common-color;
              text-decoration: underline;
            }
          }
        }
      }
    }
    .modal-name {
      white-space: nowrap;
      cursor: pointer;
      &:hover {
        color: @common-color;
        text-decoration: underline;
      }
    }
  }
  .right {
    flex: 1;
    ul {
      // width: 100%;
      padding: 15px 15px;
      li {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: #333333;
        & + li {
          margin-top: 10px;
        }
        div {
          cursor: pointer;
          &:hover {
            color: @common-color;
            text-decoration: underline;
          }
        }
        p {
          color: #9c9c9c;
          font-size: 13px;
        }
      }
    }
  }
  .title {
    height: 40px;
    border-bottom: 1px solid #e2e2e2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 15px;
    .name {
      font-size: 16px;
      line-height: 16px;
      border-left: 3px solid @common-color;
      text-indent: 8px;
      color: #2e2e2e;
    }
    .more {
      color: @common-color;
      // text-decoration: underline;
      font-size: 12px;
    }
  }
}
.wrapper-row {
  margin-top: 40px;
  .row-title {
    height: 24px;
    line-height: 24px;
    font-size: 20px;
    color: #3f8def;
    border-left: 4px solid @common-color;
    text-indent: 8px;
    display: flex;
    width: 100%;
    > p {
      // width: 86px;
    }
    > div {
      flex: 1;
      display: flex;
      margin-left: 51px;
      font-size: 16px;
      > div {
        border-bottom: 1px solid #fff;
        text-indent: 0px;
        cursor: pointer;
        & + div {
          margin-left: 33px;
        }
      }
    }
  }
  .tab-box{
    color: #8c8c8c;
    font-size: 16px;
    .selected{
      color: #333333;
      border-bottom: 2px solid #3f8def;
      height: 24px;
    }
  }
  .row-main {
    margin-top: 8px;
  background: #fff;
    
  }

  .crafts {
    border: 1px solid #e2e2e2;
    height: 334px;
    display: flex;
    ul {
      width: 100%;
      height: 100%;
      display: flex;
      li {
        flex: 1;
        padding:12px;
        & + li {
          border-left: 1px solid #e2e2e2;
        }
        .img {
          width: 100%;
          height: 188px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .name {
          font-size: 18px;
          color: #333333;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 18px;
        }
        .info {
          // font-size: 14px;
          color: #a09f9f;
          height: 60px;
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
      }
    }
  }
  .manufacturer {
    border: 1px solid #e2e2e2;
    height: 334px;
    display: flex;
    ul {
      width: 100%;
      height: 100%;
      display: flex;
      li {
        flex: 1;
        padding: 21px;

        & + li {
          border-left: 1px solid #e2e2e2;
        }
        .img {
          display: block;
          width: 246px;
          height: 103px;
          background-color: #ffffff;
          border: solid 1px #e2e2e2;
          margin: auto;
          box-sizing: border-box;
          overflow: hidden;
          img{
            display: block;
            width: 246px;
            height: 103px;
          }
        }
        .name {
          font-size: 18px;
          color: #333333;
          font-weight: bold;
          margin-top: 20px;
          margin-bottom: 18px;
        }
        .info {
          font-size: 14px;
          color: #a09f9f;
          & + p {
            margin-top: 10px;
          }
        }
      }
    }
  }
  .inquiry {
    border: 1px solid #e2e2e2;
    height: 356px;
    ul {
      width: 100%;
      height: 100%;
      display: flex;
      li {
        flex: 1;
        // padding:16px 16px 0 16px;
        box-sizing: border-box;
        position: relative;
        & + li {
          border-left: 1px solid #e2e2e2;
        }
        .btn {
          background: #fff;
          display: inline-block;
          width: 100px;
          height: 40px;
          border-radius: 4px;
          border: solid 1px #b9b9b9;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
          position: absolute;
          bottom: 36px;
          left: 50%;
          margin-left: -50px;
          color: #9a9999;
          &:hover {
            background: @common-color;
            color: #fff;
            border-color: @common-color;
          }
        }
        > p {
          font-size: 18px;
          color: #7f7f7f;
          margin-top: 16px;
          padding: 0 16px;
        }
        > div {
          color: #9a9999;
          position: relative;
          .page {
            text-align: right;
            font-size: 14px;
            padding: 0 16px;
          }
          .carousel {
            // display: flex;
            // justify-content: center;
            // align-items: center;
            width: 169px;
            // height: 94px;
            margin: auto;
            .slider-content {
              width: 100%;
              // height: 94px;
              img {
                width: 94px;
                height: 94px;
                margin: auto;
                display: block;
                margin-bottom: 31px;
              }
              p {
                text-align: center;
                color: #9a9999;
                font-size: 16px;
                margin-top: 13px;
              }
            }
            .pre-arrow {
              cursor: pointer;
              margin-right: 28px;
              position: absolute;
              top: 57px;
              left: 32px;
            }
            .next-arrow {
              cursor: pointer;
              margin-left: 28px;
              position: absolute;
              top: 57px;
              right: 32px;
            }
          }
        }
      }
    }
  }
  .case {
    // display: flex;
    .page {
      text-align: center;
      padding-top: 15px;
    //  background: #f5f5f5;
      > span {
        width: 12px;
        height: 12px;
        border: solid 1px rgba(46, 46, 46, 0.5);
        display: inline-block;
        border-radius: 50%;
        cursor: pointer;
        box-sizing: border-box;
        & + span {
          margin-left: 10px;
        }
      }
      .selected {
        border: 2px solid #2e2e2e;
      }
    }
    ul {
      height: 298px;
      display: flex;
      width: 100%;
      justify-content: space-between;
      li {
        width: 284px;
        box-shadow: 0px 0px 22px 0px rgba(0, 0, 0, 0.08);
        display: flex;
        flex-flow: column;

        > img {
          width: 100%;
          height: 180px;
        }
        > div {
          padding: 15px 9px 0px 9px;
          color: #333333;

          > div {
            font-size: 14px;
            font-weight: bold;
          }
          > p {
            color: #6f6f6f;
            margin-top: 5px;
          }
        }
      }
    }
  }
}
.message{
  height: 42px;
  width: 100%;
  background: #fff;
  box-shadow: 0px 2px 4px 0px 
rgba(0, 0, 0, 0.05);
  >div{
    width: 1200px;
    margin:auto;
    height: 100%;
    display: flex;
    >div{
      display: flex;
      align-items: center;
      height: 100%;
      
    }
    >ul{
      flex:1;
      display: flex;
      align-items: center;
      font-size: 13px;
      color: #333;
      li{
        flex:1;
        text-align: center;
      }
    }
  }
}
.data {
  width: 100%;
  height: 186px;
  background: url("../../static/img/数据背景.png");
  margin-top: 42px;
  .list {
    width: 1200px;
    height: 100%;
    margin: auto;
    display: flex;
    color: #fff;
    > div {
      flex: 1;
      text-align: center;
      padding-top: 26px;
      > div {
        width: 44px;
        height: 44px;
        margin: auto;
      }
      .num {
        margin-top: 23px;
        font-size: 30px;
      }
      .line {
        width: 40px;
        height: 2px;
        background-color: #3f8def;
        margin: auto;
        margin-top: 6px;
      }
      .name {
        font-size: 18px;
        margin-top: 8px;
      }
    }
  }
}
@keyframes leftMove {
  0% {
    left: -250px;
  }
  100% {
    left: 0px;
  }
}
@keyframes rightMove {
  0% {
    transform: translate3d(100%, 0, 0);
  }
  100% {
    transform: translate3d(0%, 0, 0);
  }
}
</style>
