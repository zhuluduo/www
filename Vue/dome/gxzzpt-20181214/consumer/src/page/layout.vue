
<template>
    <div id="layout">
        <v-header></v-header>
        <router-view></router-view>
        <v-footer></v-footer>
        <v-onlineBox></v-onlineBox>
    </div>
</template>

<script>
import header from "../components/commonHeader";
import footer from "../components/footer";
import onlineBox from "../components/onlineBox"
export default {
    components: {
        "v-header": header,
        "v-footer": footer,
        "v-onlineBox": onlineBox
    },
    data(){
        return{
        }
    },
}
</script>
<style lang="less">
#layout{
    padding-top: 112px;
    background: #f5f5f5;
}
</style>



