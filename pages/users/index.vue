<template>
    <section class="container">
        <!-- <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" /> -->
        <h1 class="title">
            USERS
        </h1>
        <ul class="users">
            <li v-for="(user, index) in users" :key="index" class="user">
                <nuxt-link :to="{ name: 'users-id', params: { id: user.id }}">
                    {{ user.name }}
                </nuxt-link>
            </li>
        </ul>
    </section>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    middleware: 'authenticated',

    async asyncData ({ store }) {
      let { data } = await axios.get('/api/users', {
        headers: {
          'x-access-token': store.state.authUser.token
        }
      })
      return { users: data }
    },
    head () {
      return {
        title: 'Users'
      }
    }
  }
</script>

<style scoped>
</style>
