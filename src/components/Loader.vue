<template>
  <v-progress-linear v-if="loading" :indeterminate="true" ></v-progress-linear>
  <!--- <v-progress-linear :indeterminate="true" class="ma-0"></v-progress-linear> --->
</template>

<script>
  export default {
    name: 'loader',
    computed: {
      loading() {
        const st = this.$store.state;
        // console.log(st);
        // eslint-disable-next-line max-len
        return st.containers.loading || st.images.loading || st.users.loading || st.requests.loading;
      }
    }
  };
</script>
