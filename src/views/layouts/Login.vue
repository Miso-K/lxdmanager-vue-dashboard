<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs10 sm6 md3>
            <v-card color="blue" dark class="elevation-12">
              <form action="#" autocomplete="off" @submit.prevent="submit">
              <v-toolbar dark color="blue darken-3">
                <v-toolbar-title>{{ $t('sign_in.name') }}</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                  <v-text-field
                    prepend-icon="person"
                    color="grey lighten-1"
                    name="login"
                    :label="$t('sign_in.username')"
                    type="text"
                    v-model="username"
                    :error="errors.username"
                  ></v-text-field>
                  <v-text-field
                    id="password"
                    color="grey lighten-1"
                    name="password"
                    :label="$t('sign_in.password')"
                    v-model="password"
                    prepend-icon="lock"
                    autocomplete="off"
                    type="password"
                    :error="errors.password"
                  ></v-text-field>
                  <v-layout align-center>

                    <!-- uncomment this block on demo.lxdmanager.com -->
                    <!--
                    <blockquote class="blockquote subheading">Admin credentials username: admin password: admin1234</blockquote>
                    <blockquote class="blockquote subheading">User credentials username: user password: user1234</blockquote>
                    -->
                  </v-layout>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  block
                  color="green"
                  type="submit"
                  secondary
                  :loading="loading"
                  :disabled="loading">{{ $t('sign_in.login') }}</v-btn>
              </v-card-actions>
              </form>
            </v-card>
            <v-alert error v-if="errors.message" :value="errors.message">
              {{ this.errors.message }}
            </v-alert>
            <v-alert v-if="logout" info v-model="alert" dismissible>{{ $t('messages.logged_out') }}</v-alert>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>


<script>
  import i18n from '../../libraries/i18n';

  export default {
    name: 'login',
    title: 'Login',
    data() {
      return {
        drawer: null,
        username: '',
        password: '',
        alert: 'true',
        enabled: false,
        errors: {
          password: null,
          username: null
        },
        loading: false,
        passwordIcon: true
      };
    },
    computed: {
      logout() {
        return this.$store.state.route.query.logout;
      }
    },
    watch: {
      password(password) {
        if (password !== '') {
          this.errors.password = false;
        }
      },
      username(username) {
        if (username !== '') {
          this.errors.username = false;
        }
      }
    },
    methods: {
      appendIcon() {
        this.passwordIcon = !this.passwordIcon;
      },
      submit() {
        let error = false;

        if (!this.password || this.password === '') {
          this.errors.password = 'Password is required';
          error = true;
        }

        if (!this.username || this.username === '') {
          this.errors.username = 'Username is required';
          error = true;
        }

        if (error) { return; }

        this.errors.message = null;
        this.loading = true;

        const data = {
          password: this.password,
          username: this.username
        };

        this.$store.dispatch('auth/token', data)
          .then(() => {
            // console.log(this.$store.getters['auth/otp_token']);
            // console.log(this.$store.getters['auth/otpConfirmed']);
            if (!this.$store.getters['auth/token']) {
              this.errors.message = 'Invalid credentials. Please try again.';
              // console.log('⛔️  Unauthorized');
              this.password = '';
              this.username = '';
              this.loading = false;
            } else if (!this.$store.getters['auth/otpConfirmed']) {
              this.$router.replace({ path: '/login-otp' });
            } else {
              this.$store.dispatch('auth/checkToken')
                .then((valid) => { // eslint-disable-line consistent-return
                  // authorized
                  if (valid) {
                    this.$router.replace({ path: this.$route.query.redirect || '/' });
                    // console.log('login ok');
                  } else {
                    // unauthorized
                    this.errors.message = 'Invalid credentials. Please try again.';
                    console.log('⛔️  Unauthorized');
                    this.password = '';
                    this.username = '';
                  }
                  this.loading = false;
                });
            }
          })
          .catch((err) => {
            console.log(err);
            this.errors.message = 'Something went wrong!';
            this.loading = false;
            this.password = '';
            this.username = '';
            this.secret = '';

            switch (err.response && err.response.status) {
              case 401:
                this.errors.message = 'Invalid credentials. Please try again.';
                break;
              default:
              case 500:
                this.errors.message = 'Internal server error. Please try again.';
                break;
            }
          });
      }
    },
    created() {
      i18n.locale = this.$store.getters.language;
    }
  };
</script>
