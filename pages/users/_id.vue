<template>
  <section class="container">
    <h1 class="title">
      User
    </h1>
    <h2 class="info">
      {{ user.name }}
    </h2>
    <nuxt-link class="button" :to="{name:'users'}">
      Users
    </nuxt-link>
  </section>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    name: 'id',
    middleware: 'authenticated',

    asyncData ({ params, error, store }) {
      return axios.get('/api/users/' + params.id, {
        headers: {
          'x-access-token': store.state.authUser.token
        }
      })
        .then((res) => {
          return { user: res.data }
        })
        .catch((e) => {
          error({ statusCode: 404, message: 'User not found' })
        })
    },
    head () {
      return {
        title: `User: ${this.user.name}`
      }
    }
  }
</script>

<style scoped>
</style>
