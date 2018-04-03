<template>
    <section class="container">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><nuxt-link :to="{name:'dashboard'}">Dashboard</nuxt-link></li>
                <li><nuxt-link :to="{name:'groups'}">Groups</nuxt-link></li>
                <li class="is-active"><a href="#" aria-current="page">{{group.name}}</a></li>
            </ul>
        </nav>
    </section>
</template>

<script>
  import axios from '~/plugins/axios'
  export default {

    middleware: 'authenticated',

    async asyncData ({ store, error, params }) {
      let {data} = await axios.get('/api/groups/' + params.id, {
        headers: {
          'x-access-token': store.state.user.authUser.token
        }
      })
      return {
        group: {
          id: data.id,
          name: data.name,
          error: null
        }
      }
    }
  }
</script>

<style scoped>
</style>
