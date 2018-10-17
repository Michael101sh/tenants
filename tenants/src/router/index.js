import Vue from 'vue'
import Router from 'vue-router'
import TenantsManagement from '@/components/TenantsManagement'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'TenantsManagement',
      component: TenantsManagement
    }
  ]
})
