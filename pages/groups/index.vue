<template>
    <section class="container">
        <!-- <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" /> -->
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><nuxt-link :to="{name:'dashboard'}">Dashboard</nuxt-link></li>
                <li class="is-active"><a href="#" aria-current="page">Groups</a></li>
            </ul>
        </nav>

        <table class="table">
            <thead>
                <tr>
                    <th>名前</th>
                    <th>メモ</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(group, index) in groups" :key="index" class="group">
                    <td>
                        <nuxt-link :to="{ name: 'groups-id', params: { id: group.id }}">
                            {{ group.name }}
                        </nuxt-link>
                    </td>
                    <td>{{ group.desc }}</td>
                    <td>
                        <button class="button is-info is-small" @click="edit(group)">編集</button>
                        <button class="button is-danger is-small" @click="remove(group)">削除</button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="field">
            <div class="control">
                <button class="button is-primary" @click="add()">追加</button>
            </div>
        </div>

        <div class="modal" v-bind:class="isModal">
            <div class="modal-background"></div>
            <div class="modal-card">
                <header class="modal-card-head">
                    <p class="modal-card-title">
                        <span v-if="group.id == null">追加</span>
                        <span v-if="group.id != null">編集</span>
                    </p>
                    <button class="delete" aria-label="close" @click="hiddenModal"></button>
                </header>
                <section class="modal-card-body">
                    <article class="message is-danger" v-if="group.error">
                        <div class="message-header">
                            <p>Error</p>
                            <button type="button" class="delete" aria-label="delete" v-on:click="group.error = null"></button>
                        </div>
                        <div class="message-body">
                            {{ group.error }}
                        </div>
                    </article>
                    <div class="field">
                        <label class="label">名前</label>
                        <div class="control">
                            <input type="text" class="input" placeholder="名前" v-model="group.name">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">メモ</label>
                        <div class="control">
                            <input type="text" class="input" placeholder="メモ" v-model="group.desc">
                        </div>
                    </div>
                </section>
                <footer class="modal-card-foot">
                    <button class="button is-success" @click="save">保存</button>
                    <button class="button" @click="hiddenModal">キャンセル</button>
                </footer>
            </div>
        </div>
    </section>
</template>

<script>
  import axios from '~/plugins/axios'

  export default {
    middleware: 'authenticated',

    async asyncData ({store}) {
      let { data } = await axios.get('/api/groups', {
        headers: {
          'x-access-token': store.state.user.authUser.token
        }
      })
      return {
        groups: data,
        isModal: '',
        group: {
          id: null,
          name: '',
          desc: '',
          error: null
        }
      }
    },
    methods: {
      async getGroups () {
        let { data } = await axios.get('/api/groups', {
          headers: {
            'x-access-token': this.$store.state.user.authUser.token
          }
        })
        this.groups = data
      },
      initializeData () {
        this.group = {
          id: null,
          name: '',
          desc: '',
          error: null
        }
      },
      add () {
        this.initializeData()
        this.displayModal()
      },
      displayModal () {
        this.isModal = 'is-active'
      },
      hiddenModal () {
        this.isModal = ''
      },
      async save () {
        this.group.error = null
        try {
          if (this.group.id == null) {
            await axios.post('/api/groups', this.group, {
              headers: {
                'x-access-token': this.$store.state.user.authUser.token
              }
            }).then((res) => {
              this.afterSave()
            })
          } else {
            await axios.put('/api/groups/' + encodeURIComponent(this.group.id), this.group, {
              headers: {
                'x-access-token': this.$store.state.user.authUser.token
              }
            }).then((res) => {
              this.afterSave()
            })
          }
        } catch (error) {
          if (error.response && error.response.status === 401) {
            if (error.response.data && error.response.data.message) {
              this.group.error = error.response.data.message
            } else {
              this.group.error = 'Bad credentials'
            }
          }
        }
      },
      afterSave () {
        this.getGroups()
        this.hiddenModal()
      },
      edit (group) {
        this.initializeData()
        this.group.id = group.id
        this.group.name = group.name
        this.displayModal()
      },
      async remove (group) {
        if (confirm('削除しますか') === false) {
          return
        }
        try {
          await axios.delete('/api/groups/' + encodeURIComponent(group.id), {
            headers: {
              'x-access-token': this.$store.state.user.authUser.token
            }
          })
          this.getGroups()
        } catch (error) {
          if (error.response && error.response.status === 401) {
            if (error.response.data && error.response.data.message) {
              throw new Error(error.response.data.message)
            } else {
              throw new Error('Bad credentials')
            }
          }
          throw error
        }
      }
    }
  }
</script>

<style scoped>
</style>
