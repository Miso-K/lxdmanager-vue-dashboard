<template>
  <v-card
    class="hide-overflow,mt-3"
  >
    <v-form ref="form" v-model="valid" lazy-validation>
    <v-toolbar
      card
      height="50px"
    >
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light subheading">{{ $t('settings.password.title') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        @click="isEditing = !isEditing, clear()"
      >
        <v-icon v-if="isEditing">close</v-icon>
        <v-icon v-else>edit</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-text-field
        :disabled="!isEditing"
        :label="$t('settings.password.current')"
        :append-icon="show3 ? 'visibility_off' : 'visibility'"
        :rules="[oldPasswordRules]"
        :type="show3 ? 'text' : 'password'"
        hint="At least 8 characters"
        v-model="data.cur_password"
        @click:append="show3 = !show3"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditing"
        :label="$t('settings.password.new')"
        :append-icon="show3 ? 'visibility_off' : 'visibility'"
        :rules="newPasswordRules"
        :type="show3 ? 'text' : 'password'"
        hint="At least 8 characters"
        v-model="data.new_password"
        @click:append="show3 = !show3"
      ></v-text-field>
      <v-text-field
        :disabled="!isEditing"
        :label="$t('settings.password.confirm')"
        :append-icon="show3 ? 'visibility_off' : 'visibility'"
        :rules="newPasswordRules"
        :type="show3 ? 'text' : 'password'"
        hint="At least 8 characters"
        v-model="data.confirm_password"
        @click:append="show3 = !show3"
      ></v-text-field>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!isEditing"
        color="success"
        @click="save"
      >
        {{ $t('actions.save') }}
      </v-btn>
    </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
  export default {
    data() {
      return {
        isEditing: null,
        model: null,
        data: {
          cur_password: '',
          new_password: '',
          confirm_password: ''
        },
        oldPasswordRules: v => !!v || 'Password is required',
        newPasswordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password must be more than 8 characters',
          v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*().;/\-=+~])/.test(v) || 'Password must contain lowercase, uppercase, number and special character.'
        ]
      };
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      }
    },
    methods: {
      clear() {
        this.$refs.form.reset();
      },
      clearData() {
        this.data.cur_password = '';
        this.data.new_password = '';
        this.data.confirm_password = '';
      },
      save() {
        if (this.$refs.form.validate()) {
          this.isEditing = !this.isEditing;
          if ((this.data.cur_password !== this.data.new_password) && (this.data.new_password === this.data.confirm_password)) { // eslint-disable-line max-len
            this.$store.dispatch('notify', { id: 0, message: 'Your password has been saved', color: 'info' });
            this.$store.dispatch('updateMe', this.data); // comment this on demo.lxdmanager.com
          } else {
            this.$store.dispatch('notify', { id: 0, message: 'You set wrong password', color: 'error' });
          }
        }
      }
    },
    mounted() {
      // console.log(this.$store.getters['auth/me']);
      // console.log(this.$store.getters.stats);
      // this.$store.dispatch('fetchStats');
    },
    created() {
      // this.$store.registerModule('stats', Stats);
    }
  };
</script>
