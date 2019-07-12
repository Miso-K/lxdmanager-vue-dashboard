<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs10 sm6 md3>
            <v-card color="blue" dark class="elevation-12">
              <form action="#" autocomplete="off" @submit.prevent="submit">
              <v-toolbar dark color="blue darken-3">
                <v-toolbar-title>2-step Verification</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                  <v-text-field
                    id="password"
                    color="grey lighten-1"
                    name="secret"
                    label="Enter 6 chars or digits code"
                    v-model="secret"
                    prepend-icon="lock"
                    autocomplete="off"
                    type="text"
                    :error="errors.secret"
                  ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-btn
                  block
                  color="green"
                  type="submit"
                  secondary
                  :loading="loading"
                  :disabled="loading">Login</v-btn>
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
  export default {
    name: 'login',
    title: 'Login',
    data() {
      return {
        drawer: null,
        secret: '',
        alert: 'true',
        enabled: false,
        errors: {
          secret: null,
          message: null
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
      secret(secret) {
        if (secret !== '') {
          this.errors.secret = false;
        }
      }
    },
    methods: {
      appendIcon() {
        this.passwordIcon = !this.passwordIcon;
      },
      submit() {
        let error = false;
        console.log('submit otp');
        if (!this.secret || this.secret === '') {
          this.errors.secret = 'Secret code is required';
          error = true;
        }

        if (error) { return; }

        this.errors.message = null;
        this.loading = true;

        const data = {
          secret: this.secret
        };

        this.$store.dispatch('auth/otpToken', data)
          .then(() => {
            // check login state
            this.$store.dispatch('auth/checkToken')
              .then((valid) => { // eslint-disable-line consistent-return
                // authorized
                if (valid) {
                  this.$router.replace({ path: this.$route.query.redirect || '/' });
                  // console.log('prihlasenie ok');
                } else {
                  // unauthorized
                  this.errors.message = 'Unvalid credentials. Please try again.';
                  console.log('⛔️  Unauthorized');
                  this.secret = '';
                }
                this.loading = false;
              });
          })
          .catch((err) => {
            // nic nezachyti ked zle heslo ?
            console.log('chytil error');
            console.log(err);
            this.errors.message = 'Something went wrong!';
            this.loading = false;
            this.password = '';
            this.username = '';
            this.secret = '';

            switch (err.response && err.response.status) {
              case 401:
                this.errors.message = 'Unvalid secret. Please try again.';
                break;
              default:
              case 500:
                this.errors.message = 'Internal server error. Please try again.';
                break;
            }
          });
      }
    }
  };
</script>
