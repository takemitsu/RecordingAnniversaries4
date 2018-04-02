<template>
  <section class="container">
    <nuxt-link class="button" :to="{name:'users'}">
      Users
    </nuxt-link>

    <div class="columns is-mobile">
      <div class="column is-half is-offset-one-quarter">
        <form class="field" @submit.prevent="updateUser">
          <h2 class="title">Update User</h2>

          <article class="message is-danger" v-if="formSignin.error">
            <div class="message-header">
              <p>Error</p>
              <button type="button" class="delete" aria-label="delete" v-on:click="formSignin.error = null"></button>
            </div>
            <div class="message-body">
              {{ formSignin.error }}
            </div>
          </article>

          <article class="message is-success" v-if="formSignin.success">
            <div class="message-header">
              <p>Success</p>
              <button type="button" class="delete" aria-label="delete" v-on:click="formSignin.success = null"></button>
            </div>
            <div class="message-body">
              {{ formSignin.success }}
            </div>
          </article>

          <div class="field">
            <label class="label">Name</label>
            <div class="control">
              <input type="text" class="input" v-model="formSignin.name" name="name" placeholder="name"/>
            </div>
          </div>
          <div class="field">
            <label class="label">Password</label>
            <div class="control">
              <input type="password" class="input" v-model="formSignin.password" name="password" placeholder="passowrd"/>
            </div>
          </div>
          <div class="field">
            <div class="control">
              <button type="submit" class="button is-primary">Update</button>
            </div>
          </div>
        </form>
        <div class="field">
          <div class="control">
            <button type="button" class="button is-danger" @click="deleteUser">Delete</button>
          </div>
        </div>
      </div>
    </div>

  </section>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    name: 'id',
    middleware: 'authenticated',

    async asyncData ({ store, error, params }) {
      let { data } = await axios.get('/api/users/' + params.id, {
        headers: {
          'x-access-token': store.state.user.authUser.token
        }
      })
      return {
        formSignin: {
          id: data.id,
          name: data.name,
          password: null,
          error: null
        }
      }
    },

    head () {
      return {
        title: `User: ${this.formSignin.name}`
      }
    },
    methods: {
      async updateUser () {
        try {
          await this.$store.dispatch('user/updateUser', {
            id: this.formSignin.id,
            username: this.formSignin.name,
            password: this.formSignin.password
          })
          this.formSignin.password = ''
          this.formSignin.error = null
          this.formSignin.success = 'user updated!'
        } catch (e) {
          this.formSignin.error = e.message
        }
      },

      async deleteUser () {
        if (confirm('削除しますか') === false) {
          return
        }

        try {
          await this.$store.dispatch('user/deleteUser', {id: this.formSignin.id})
          this.$router.push({name: 'index'})
        } catch (e) {
          this.formSignin.error = e.message
        }
      }
    }
  }
</script>

<style scoped>
</style>
