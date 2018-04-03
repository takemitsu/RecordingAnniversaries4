import createPersistedSate from 'vuex-persistedstate'

export default ({store, config}) => {
  console.log(config)
  createPersistedSate({
    key: 'yourkey'
  })(store)
}
