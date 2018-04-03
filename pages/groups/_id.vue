<template>
    <section class="container">
        <nav class="breadcrumb" aria-label="breadcrumbs">
            <ul>
                <li><nuxt-link :to="{name:'dashboard'}">Dashboard</nuxt-link></li>
                <li><nuxt-link :to="{name:'groups'}">Groups</nuxt-link></li>
                <li class="is-active"><a href="#" aria-current="page">{{group.name}}</a><span style="color: rgb(128,128,128);" v-if="group.desc">{{group.desc}}</span></li>
            </ul>
        </nav>

        <table class="table">
            <thead>
            <tr>
                <th>名前</th>
                <th>日付</th>
                <th>メモ</th>
                <th>操作</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(anniv, index) in group.annivs" :key="index" class="group">
                <td>{{ anniv.name }}</td>
                <td>{{ anniv.anniv_at }}</td>
                <td>{{ anniv.desc }}</td>
                <td>
                    <button class="button is-info is-small" @click="edit(anniv)">編集</button>
                    <button class="button is-danger is-small" @click="remove(anniv)">削除</button>
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
                        編集
                    </p>
                    <button class="delete" aria-label="close" @click="hiddenModal"></button>
                </header>
                <section class="modal-card-body">
                    <article class="message is-danger" v-if="anniv.error">
                        <div class="message-header">
                            <p>Error</p>
                            <button type="button" class="delete" aria-label="delete" v-on:click="anniv.error = null"></button>
                        </div>
                        <div class="message-body">
                            {{ anniv.error }}
                        </div>
                    </article>
                    <div class="field">
                        <label class="label">名前</label>
                        <div class="control">
                            <input type="text" class="input" placeholder="名前" v-model="anniv.name">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">メモ</label>
                        <div class="control">
                            <input type="text" class="input" placeholder="メモ" v-model="anniv.desc">
                        </div>
                    </div>
                    <div class="field">
                        <label class="label">日付</label>
                        <div class="control">
                            <input type="text" class="input" placeholder="メモ" v-model="anniv.anniv_at">
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
  import moment from 'moment'

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
          desc: data.desc,
          annivs: data.annivs,
          error: null
        },
        isModal: '',
        anniv: {
          id: null,
          name: '',
          desc: '',
          anniv_at: null
        },
        error: null
      }
    },
    methods: {
      async getGroup () {
        let {data} = await axios.get('/api/groups/' + this.group.id, {
          headers: {
            'x-access-token': this.$store.state.user.authUser.token
          }
        })
        this.group = data
      },

      initializeData () {
        this.anniv = {
          id: null,
          name: '',
          desc: '',
          anniv_at: moment().toDate(),
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
        this.anniv.error = null

        try {
          if (this.anniv.id === null) {
            await axios.post('/api/groups/' + encodeURIComponent(this.group.id),
              this.anniv, {
                headers: {
                  'x-access-token': this.$store.state.user.authUser.token
                }
              }
            ).then((res) => {
              this.afterSave()
            })
          } else {
            await axios.put('/api/groups/' + encodeURIComponent(this.group.id) + '/' + encodeURIComponent(this.anniv.id),
              this.anniv, {
                headers: {
                  'x-access-token': this.$store.state.user.authUser.token
                }
              }
            ).then((res) => {
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
        this.getGroup()
        this.hiddenModal()
      },

      edit (anniv) {
        this.initializeData()
        this.anniv.id = anniv._id
        this.anniv.name = anniv.name
        this.anniv.desc = anniv.desc
        this.anniv.anniv_at = anniv.anniv_at
        this.displayModal()
      },

      async remove (anniv) {
        if (confirm('削除しますか') === false) {
          return
        }
        try {
          const annivId = anniv._id
          await axios.delete('/api/groups/' + encodeURIComponent(this.group.id) + '/' + encodeURIComponent(annivId), {
            headers: {
              'x-access-token': this.$store.state.user.authUser.token
            }
          }).then((res) => {
            this.getGroup()
          })
        } catch (error) {
          if (error.response && error.response.status === 401) {
            if (error.response.data && error.response.data.message) {
              this.error = error.response.data.message
            } else {
              this.error = 'Bad credentials'
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
