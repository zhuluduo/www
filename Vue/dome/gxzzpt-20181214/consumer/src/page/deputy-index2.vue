<template>
    <div class="content">
        <div class="banner">
            <!-- <img src="../assets/temporary-img/index2/机械加工banner.png" alt=""> -->
             <div>
              <p>优质企业 专业设备 精准报价</p>
              <div class="btn" @click="toPublish" v-if="(user.isValid&&!user.isManufacturer)||!user.isValid||(user.isValid&&user.isManufacturer&&user.isDemand)">发布需求 >></div>
            </div>
        </div>
        <div class="message">
          <div>
            <div>
              <img src="../../static/img/new.png" alt="">
              <p>最新发布</p>
            </div>
            <ul>
              <li>陶小姐 刚刚发布了新的需求</li>
              <li>马姑娘 刚发布了新的需求</li>
              <li>晓友 刚发布了新的需求</li>
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
                      <img src="../assets/temporary-img/index2/1.png" alt="">
                      <div>
                        <p class="common-ellipsis-1 modal-name">成品零件的数控加工过程中误差</p>
                        <div class="news-content common-ellipsis-3">数控加工技术是现代机械加工技术的重要基础，应用数控加工技术可以实现对各种精密零件的精细加工。但在加工过程中，会由于某些原因而产生不可接受的误差，致使零件精度达不到要求。如何快速准确地辨识数控加工过程中产生的误差已成为一项重要任务。从图纸到成品零件的数控加工过程中，误差的主要来源可概括为主观原因和客观原因。笔者将从不同方面分析产生误差的原因，并指出可以采取哪些措施来减小误差。</div>
                      </div>
                    </div>
                    <div class="bottom">
                      <div class="mark">专用设备行业投资研究报告：中国正阔步进入“光加工”时代</div>
                      <div class="mark">你知道机械切削刀具刃口钝化的重要性吗</div>
                      <div class="mark">大型120型台式大理石切割机使用技巧</div>
                    </div>
                  </li>
                  <li>
                    <div class="top">
                      <img src="../assets/temporary-img/index2/8.png" alt="">
                      <div>
                        <p class="common-ellipsis-1 modal-name">一文辨识机械加工和涂装岗位42个危险因素</p>
                        <div class="news-content common-ellipsis-3">防护罩缺损，自动进刀手柄 (轮)无弹出防护装置，导致设备部件和加工件飞出伤人。主要防范措施
                          (1)有可能造成缠绕、吸入或卷入、刺割等危险的运动部件和传动装置应设置防护罩</div>
                      </div>
                    </div>
                    <div class="bottom">
                      <div class="mark">机械加工铝和压铸铝的区别</div>
                      <div class="mark">机械行业投资策略报告效率精度优势显现 激光加工开启工艺替代</div>
                      <div class="mark">2018台中自动化机械暨智慧制造展</div>
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
                    <div>非标活结紧固件螺丝加工</div>
                    <p>1小时前</p>
                  </li>
                  <li>
                    <div>定制锌合金产品</div>
                    <p> </p>
                  </li>
                  <li>
                    <div>铝合金CNC加工件</div>
                    <p>6小时前</p>
                  </li>
                  <li>
                    <div>塑料制品加工</div>
                    <p>1天前</p>
                  </li>
                  <li>
                    <div>汽车发动机齿轮精锻件</div>
                    <p>2天前</p>
                  </li>
                  <li>
                    <div>风扇电机马达轴心</div>
                    <p>4天前</p>
                  </li>
                  <li>
                    <div>丝杆螺母</div>
                    <p>5天前</p>
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
                    <img src="../assets/temporary-img/index2/1.金属零件.jpg" alt="">
                    <div>
                      <div>金属零件</div>
                      <p>工艺：机加工</p>
                      <p>材料：铝</p>
                      <p>单价：￥10-20/件</p>
                    </div>
                  </li>
                  <li>
                    <img src="../assets/temporary-img/index2/2.金属配件.jpg" alt="">
                    <div>
                      <div>金属配件</div>
                      <p>工艺：机加工</p>
                      <p>材料：铜</p>
                      <p>单价：￥5-6/件</p>
                    </div>
                  </li>
                  <li>
                    <img src="../assets/temporary-img/index2/3.螺帽.jpg" alt="">
                    <div>
                      <div>螺帽</div>
                      <p>工艺：机加工</p>
                      <p>材料：铁</p>
                      <p>供应商：单价：￥0.5-1/件</p>
                    </div>
                  </li>
                  <li>
                    <img src="../assets/temporary-img/index2/4.刀具.jpg" alt="">
                    <div>
                      <div>刀具</div>
                      <p>工艺：机加工</p>
                      <p>材料：镍铬合金</p>
                      <p>单价：￥20-30/件</p>
                    </div>
                  </li>
                </ul>
                <div class="page">
                  <span v-for="(item,index) in caseList" :class="item.selected?'selected':'unselected'" :key="index" @click="switchCase(item)"></span>
                </div>
              </div>
          </div>
          <div class="wrapper-row">
            <div class="row-title crafts-tab">
              <p>材料工艺</p>
              <div class="tab-box">
                <div class="selected">打印材料</div>
                <div>处理工艺</div>
              </div>
            </div>
            <div class="row-main crafts">
              <ul>
                <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index2/PVC.jpg" alt="">
                   </div>
                   <p class="name">PVC</p>
                   <p class="info">PVC为无定形结构的白色粉末，支化度较小，相对密度1.4左右，玻璃化温度77~90℃，170℃左右开始分解 ，对光和热的稳定性差，在100℃以上或经长时间阳光曝晒，就会分解而产生氯化氢，并进一步自动催化分解，引起变色，物理机械性能也迅速下降，在实际应用中必须加入稳定剂以提高对热和光的稳定性。</p>
                 </li>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index2/钴铬合金.jpg" alt="">
                   </div>
                   <p class="name">钴铬合金</p>
                   <p class="info">钴铬合金一种基于钴铬钼超耐热合金的复合材料，具有优秀的机械性能、高抗腐蚀及抗温特性，被广泛应用于生物医学及航空航天。</p>
                 </li>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index2/铝合金.gif" alt="">
                   </div>
                   <p class="name">铝合金</p>
                   <p class="info">铝合金是工业中应用最广泛的一类有色金属结构材料，在航空、航天、汽车、机械制造、船舶及化学工业中已大量应用。工业经济的飞速发展，对铝合金焊接结构件的需求日益增多，使铝合金的焊接性研究也随之深入。目前铝合金是应用最多的合金。</p>
                 </li>
                 <li>
                   <div class="img">
                    <img src="../assets/temporary-img/index2/钛合金SUS408.jpg" alt="">
                   </div>
                   <p class="name">钛合金SUS408</p>
                   <p class="info">耐热性好，弱抗腐蚀性，11%的Cr，8%的Ni。基体为奥氏体或马氏体组织，沉淀硬化不锈钢的常用牌号有04Cr13Ni8Mo2Al等。其能通过沉淀硬化（又称时效硬化）处理使其硬（强）化的不锈钢。</p>
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
                    <img src="../assets/temporary-img/index2/海安县能达电气有限公司.png" alt="">
                   </div>
                   <p class="name">海安县能达电气有限公司</p>
                   <p class="info">工艺：机械加工 表面处理</p>
                   <p class="info">行业：电子产品与电子元器件行业</p>
                   <p class="info">工厂面积：0-1000㎡</p>
                   <p class="info">区域：江苏南通市</p>
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
                    <img src="../assets/temporary-img/index2/上海金鑫电子有限公司.jpg" alt="">
                   </div>
                   <p class="name">上海金鑫电子有限公司</p>
                   <p class="info">工艺：模具制造 模具制造</p>
                   <p class="info">行业：金属制品行业</p>
                   <p class="info">工厂面积：0-1000㎡</p>
                   <p class="info">区域：上海浦东新区</p>
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
                    <img src="../assets/temporary-img/index2/深圳市环瑞电子有限公司.jpg" alt="">
                   </div>
                   <p class="name">深圳市环瑞电子有限公司</p>
                   <p class="info">工艺：模具制造 模具制造	</p>
                   <p class="info">行业：金属制品行业 </p>
                   <p class="info">工厂面积：0-1000㎡</p>
                   <p class="info">区域：广东深圳市</p>
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
                    <img src="../assets/temporary-img/index2/深圳市祥富精密工业有限公司.jpg" alt="">
                   </div>
                   <p class="name">深圳市祥富精密工业有限公司</p>
                   <p class="info">工艺：机械加工 表面处理 锻造</p>
                   <p class="info">行业：机械及工具行业</p>
                   <p class="info">工厂面积：0-1000㎡</p>
                   <p class="info">区域：广东深圳</p>
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
  computed: {
        ...mapState({
            user: state => state.user,
        }),
    },
  methods: {
    toPublish() {
      if ( this.user.isValid ) {
        this.$router.push({path: '/quote/manual', query:{techniqueType:530020}});
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
  background: url("../assets/temporary-img/index2/机械加工banner.png");
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
    .btn {
      margin: 72px 0 0 0; 
      width: 170px;
      height: 50px;
      background-color: #3f8def;
      // border-radius: 22px;
      text-align: center;
      line-height: 50px;
      color: #fff;
      font-size: 22px;
      cursor: pointer;
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
              margin-top: 17px;
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
      border-left: 3px solid @common-color;
      line-height: 16px;
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
          width: 246px;
          height: 103px;
          background-color: #ffffff;
          border: solid 1px #e2e2e2;
          margin: auto;
          // margin-top: 21px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          img{
            display: block;
            width: 246px;
            height: 103px;
            overflow: hidden;
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
      margin-top: 15px;
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
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.05);
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
