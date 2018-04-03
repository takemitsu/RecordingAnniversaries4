<template>
    <section class="container">
        <div class="columns is-mobile">
            <div class="column is-half is-offset-one-quarter">
                <div class="content">
                    <h1>store について</h1>
                    <p>
                        index.vue を読み込むときに nuxtServerInit が呼ばれるせいで state.authUser が initialize されてしまうので、アレなときには state をみてリンク先を変更するなどのアレが必要になると推測。まぁその前にログアウトとか実装しろよっていう話しなのだが。。
                    </p>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
  export default {
  }
</script>

<style scoped>
</style>
