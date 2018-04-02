export default function ({ store, redirect }) {
  // ユーザが認証されていないとき
  if (!store.state.user.authUser) {
    return redirect('/login')
  }
}
