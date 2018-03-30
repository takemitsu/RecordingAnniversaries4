<template>
  <div>
    <nav class="navbar is-info" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <nuxt-link :to="{name: 'dashboard'}" class="navbar-item">
          Recording Anniversaries
        </nuxt-link>
      </div>
      <div class="navbar-menu">
        <div class="navbar-start">
          <nuxt-link :to="{name: 'users'}" class="navbar-item">
            Users
          </nuxt-link>
        </div>
      </div>
    </nav>
    <section class="section">
      <div class="container">
        <nuxt/>
      </div>
    </section>
    <my-footer/>
  </div>
</template>

<script>
import MyFooter from '~/components/Footer.vue'

export default {
  components: {
    MyFooter
  }
}
</script>
