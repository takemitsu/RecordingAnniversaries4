<template>
    <section class="container">
        <div class="columns is-mobile">
            <div class="column is-half is-offset-one-quarter">
                <form class="field" v-if="!$store.state.authUser" @submit.prevent="login">
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
                            <button type="submit" class="button">Login</button>
                        </div>
                    </div>
                </form>
                <div v-else>
                    <h2 class="title">Hello!</h2>
                    <div class="field">
                        <nuxt-link class="button is-primary is-outlined" :to="{name: 'users'}">Users</nuxt-link>
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
        await this.$store.dispatch('login', {
          username: this.formSignin.name,
          password: this.formSignin.password
        })
        this.formSignin.name = ''
        this.formSignin.password = ''
        this.formSignin.error = null
      } catch (e) {
        this.formSignin.error = e.message
      }
    },
    async logout () {
      try {
        await this.$store.dispatch('logout')
      } catch (e) {
        this.formSignin.error = e.message
      }
    }
  }
}
</script>