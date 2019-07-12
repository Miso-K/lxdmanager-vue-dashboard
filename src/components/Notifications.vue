<template>
  <v-snackbar
    bottom
    :color="color"
    v-model="showSnack">
    {{ message }}
  </v-snackbar>
</template>

<script>
  export default {
    name: 'lwp-notifications',
    data() {
      return {
        tmp: true
      };
    },
    computed: {
      color() {
        return this.$store.state.notifications.messages.length > 0 ? this.$store.state.notifications.messages[0].color : '';
      },
      message() {
        return this.$store.state.notifications.messages.length > 0 ? this.$store.state.notifications.messages[0].message : ''; // eslint-disable-line max-len
      },
      showSnack: {
        get() {
          return this.$store.state.notifications.active && this.$store.state.notifications.messages.length > 0; // eslint-disable-line max-len
        },
        set(value) {
          if (!value) {
            this.$store.dispatch('closeNotif');
          }
        }
      }
    }
  };
</script>
