export default function ({ store, redirect }) {
  // ユーザが認証されていないとき
  if (!store.state.authUser) {
    return redirect('/login')
  }
}
