import { Api } from './helpers/Api'
import Vue from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $api: Api
  }
}
