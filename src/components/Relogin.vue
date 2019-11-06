<template>
    <v-layout row justify-center>
    <v-dialog v-model="dialog_relogin" persistent max-width="500">
      <v-card>
        <v-card-title class="headline">Stay online or logout?</v-card-title>

        <v-card-text>
          If you want to stay online please click on STAY ONLINE button, otherwise LOGOUT.
          You will be logging out automaticly in {{countdown}} seconds.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click.native="dialog_relogin = false"
            @click="refreshToken"
          >
            Stay online
          </v-btn>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click.native="dialog_relogin = false"
            @click="$router.push('logout')"
          >
            Logout
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
    export default {
      name: 'Relogin',
      data() {
        return {
          dialog_relogin: false,
          interval: 0,
          value: 0,
          countdown: 60
        };
      },
      methods: {
        startCountDown() {
          this.interval = setInterval(() => {
            // 15 minut interval
            if (this.value === 900) {
              this.dialog_relogin = true;
              this.actionCountDown();
              this.value = 0;
            }
            this.value += 1;
            // console.log('interval');
          }, 1000);
        },
        actionCountDown() {
          this.interval2 = setInterval(() => {
            if (this.countdown === 0) {
              this.$router.push('logout');
              this.countdown = 60;
            }
            this.value = 0;
            this.countdown -= 1;
            console.log('countdown');
          }, 1000);
        },
        refreshToken() {
          clearInterval(this.interval2);
          this.value = 0;
          this.$store.dispatch('auth/refreshToken');
        }
      },
      created() {
        this.startCountDown();
      },
      beforeDestroy() {
        clearInterval(this.interval);
        clearInterval(this.interval2);
        this.value = 0;
        this.countdown = 60;
      }
    };
</script>
