<template>
    <div id='print'>
        <button @click="printBtn">打 印</button>
        <div id="printContent">
            <table border="0" style="font-size: 9pt;" width="300px" align="center">
                <thead style="display: table-header-group; font-weight: bold">
                    <tr><td><span>sdfsd</span><span>sdfsd</span><span>sdfsd</span><span>sdfsd</span></td> </tr>  
                </thead>
                <tbody style="text-align: center">
                    <tr>
                       <td>
                           <p>1</p>
                           <p>1</p>
                           <p>1</p>
                           <p>1</p>
                           <p style="page-break-after: always;">1</p>
                           <p>1</p>
                           <p>1</p>
                           <p>1</p>
                           <p>1</p>
                           <p style="page-break-after: always;">1</p>
                           <p>1</p>
                           <p>1</p>
                           <p>1</p>
                           <p>1</p>
                           <p style="page-break-after: always;">1</p>
                        </td>
                    </tr>
                </tbody>
                <tfoot style="display: table-footer-group; font-weight: bold">
                    <tr>
                        <td>每页都有的表尾</td>                     
                    </tr>
                </tfoot>
            </table>
        </div>
    </div>
</template>

<script>
    // window.onbeforeunload = function(event) { 
    //     console.log('页面被刷新');
    //     return '您可能有数据没有保存';
    // }; 
    // window.onunload = (event)=>{ 
    //     console.log('页面被我关闭了');
    //     localStorage.setItem('leave','页面被我关闭了');
    // };
export default {
    data() {
        return {};
    },
    methods:{
         printBtn(e){
            let PrintHTML = document.getElementById('print').innerHTML;
            let oldHTML = document.body.innerHTML;
            document.body.innerHTML = PrintHTML;

            window.print();
            window.location.reload();
            document.body.innerHTML = oldHTML;
            return false;
        },
    },
    mounted() {

    },
};
</script>
<style media="print" lang='less' scoped>
@page {
  size: auto; /* auto is the initial value */
  /* margin: 0 10mm 0 10mm;  this affects the margin in the printer settings 最关键的还是这个 */
}
#printContent {
  text-align: center;
  div {
    height: 32px;
    background-color: red;
    margin: 10px;
  }
  span {
    margin: 10px;
  }
  td {
    border: 1px solid #efefef;
  }
}
</style>

<style lang="less" scoped>
#print {
  padding-top: 10px;
  width: 1200px;
  margin: auto;
  #dialogCare {
    margin-bottom: 10px;
  }
}
</style>

