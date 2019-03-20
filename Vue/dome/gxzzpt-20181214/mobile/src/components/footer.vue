<template>
    <footer id='footer'>
       <div class="content">
           <p>更多操作，请在PC端进行</p>
           <p class="daFookNet">tatfookcloud.com</p>
       </div>
    </footer>
</template>

<script>
    export default {
    	data(){
            return{
            }
        },
        created() {
        },
        mounted(){
        

        },
        props: [],
        methods: {
           

        },

    }

</script>

<style lang="scss" scoped>
    #footer{
        position: relative;
        width: 100%;
        height: 100%;
        // z-index: 100;
        bottom:0;
        left: 0;
        text-align: center;
        background-color: #f1f1f1;
        .content{
            padding: 50px 0;
            font-size: 24px;
            .daFookNet{
                margin-top: 24px;
            }
        }
    }
    
</style>