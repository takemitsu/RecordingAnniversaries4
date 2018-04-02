<template>
    <section class="container">
        <div class="columns is-mobile">
            <div class="column is-half is-offset-one-quarter">
                <form class="field" v-if="!$store.state.authUser" @submit.prevent="register">
                    <h2 class="title">Register</h2>

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
                            <div>
                                <nuxt-link :to="{name: 'login'}" class="button">Login</nuxt-link>
                            </div>
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
                            <button type="submit" class="button is-primary">Register</button>
                        </div>
                    </div>
                </form>
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
          success: null,
          name: '',
          password: ''
        }
      }
    },
    methods: {
      async register () {
        try {
          await this.$store.dispatch('register', {
            username: this.formSignin.name,
            password: this.formSignin.password
          })
          this.formSignin.name = ''
          this.formSignin.password = ''
          this.formSignin.error = null
          this.formSignin.success = 'user registered!'
        } catch (e) {
          this.formSignin.error = e.message
        }
      }
    }
  }
</script>