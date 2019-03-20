import Vue from 'vue'
import ElementUI from 'element-ui';
Vue.use(ElementUI)
var myGeneralTools = new Vue()

const Clipboard={}

//复制到剪贴板
Clipboard.copy=function(text,cont){
    var oInput = document.createElement('input');
    oInput.value = text;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display='none';
    myGeneralTools.$message({
      message: cont!=undefined?cont:'复制成功',
      type: 'success',
      duration:1500
    });
}

export default Clipboard;