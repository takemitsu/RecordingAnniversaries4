<template>
    <section class="container">
        <article class="message is-info" v-for="(group) in groups">
            <div class="message-header">
                <nuxt-link :to="{ name: 'groups-id', params: { id: group.id }}">
                    {{ group.name }}
                </nuxt-link>
            </div>
            <div class="message-body">
                <ul>
                    <li v-for="(anniv) in group.annivs">
                        {{ anniv.anniv_at }} {{ anniv.name }}
                    </li>
                </ul>
            </div>
        </article>

    </section>
</template>

<script>
import axios from '~/plugins/axios'
import moment from 'moment'

export default {
  middleware: 'authenticated',

  async asyncData ({store}) {
    let { data } = await axios.get('/api/groups', {
      headers: {
        'x-access-token': store.state.user.authUser.token
      }
    })

    let groups = []
    if (data instanceof Array) {
      data.forEach((group, index) => {
        if (group.annivs.length > 0) {
          groups.push(group)
        }
      })

      moment.locale('ja')

      groups.forEach((group) => {
        group.annivs.forEach((anniv) => {
          anniv.anniv_at = moment(anniv.anniv_at).format('YYYY-MM-DD (ddd)')
          console.log(anniv.anniv_at)
        })
      })
    }

    return {
      groups: groups,
      isModal: '',
      group: {
        id: null,
        name: '',
        desc: '',
        error: null
      }
    }
  }
}
</script>

<style scoped>
</style>
