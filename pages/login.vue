<template>
    <section class="container">
        <div class="columns is-mobile">
            <div class="column is-half is-offset-one-quarter">
                <form class="field" v-if="!$store.state.user.authUser" @submit.prevent="login">
                    <h2 class="title">Login</h2>
                    <article class="message is-danger" v-if="formSignin.error">
                        <div class="message-header">
                            <p>Error</p>
                            <button type="button" class="delete" aria-label="delete" v-on:click="formSignin.error = null"></button>
                        </div>
                        <div class="message-body">
                            {{ formSignin.error }}
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
                            <button type="submit" class="button is-primary">Login</button>
                        </div>
                    </div>
                    <div class="field">
                        <div class="control">
                            <nuxt-link :to="{name: 'users-register'}" class="button is-outlined">Register</nuxt-link>
                        </div>
                    </div>
                </form>
                <div v-else>
                    <div class="field">
                        <nuxt-link class="button is-primary is-outlined" :to="{name: 'dashboard'}">Dashboard</nuxt-link>
                    </div>
                    <div class="field">
                        <div class="control">
                            <button class="button is-danger is-outlined" @click="logout">Logout</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
export default {
  data () {
    return {
      formSignin: {
        error: null,
        name: '',
        password: ''
      }
    }
  },
  methods: {
    async login () {
      try {
        await this.$store.dispatch('user/login', {
          username: this.formSignin.name,
          password: this.formSignin.password
        })
        this.formSignin.name = ''
        this.formSignin.password = ''
        this.formSignin.error = null
        this.$router.push({ name: 'dashboard' })
      } catch (e) {
        this.formSignin.error = e.message
      }
    },
    async logout () {
      try {
        await this.$store.dispatch('user/logout')
      } catch (e) {
        this.formSignin.error = e.message
      }
    }
  }
}
</script>