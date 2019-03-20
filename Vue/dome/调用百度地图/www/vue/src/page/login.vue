<template>
  <div class="login">这是登陆页
      <div class="login-body">
          <div class="login-wrap">

          </div>
      </div>
  </div>
</template>
<script>
import UserService from '../service/UserService.js'

export default {
    components: {},
    data() {
        return {
            username: '',
            password: ''
        }
    },
    methods: {
        async login() {
            const result = await self.userService.login(self.username, self.password)
                    
            if (result) {
                
            }
        }

    },
}
</script>
<style scoped lang="less">

</style>
