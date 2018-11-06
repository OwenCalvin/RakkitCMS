<template>
  <div class="home">
    <button @click="send">send</button>
    <input type="text" v-model="token"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from '@/components/HelloWorld.vue'
import gql from 'graphql-tag'

@Component({
  components: {
    HelloWorld,
  },
})
export default class Home extends Vue {
  public token: string

  constructor() {
    super()
    this.token = ''
  }

  async send() {
    console.log(this.$api)
    this.$api.JwtToken = this.token
    console.log(this.token)
    this.$api.RestClient.get('/asdad')
    const res = await this.$apollo.query({
      query: gql`query { hello }`
    })
    console.log(res.data)
    console.log(resRest)
  }
}
</script>
