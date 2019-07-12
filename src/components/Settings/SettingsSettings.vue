<template>
  <v-card
    class="hide-overflow"
  >
    <v-toolbar
      card
      height="50px"
    >
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light subheading">User Settings</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        @click="isEditing = !isEditing"
      >
        <v-icon v-if="isEditing">close</v-icon>
        <v-icon v-else>edit</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-select
        :disabled="!isEditing"
        :items="lang"
        label="Language"
        value="English"
      ></v-select>
      <v-select
        :disabled="!isEditing"
        v-model="data.otp_type"
        :items="auths"
        label="Two factor auth"
      ></v-select>
      <span v-if="data.otp_type === 'none'">It is strongly recomended to use two factor authorization.</span>
      <span v-if="data.otp_type === 'email'">This is default option for two factor authorization.<br>E-mail with secret key will be send to user email.</span>
      <span v-if="data.otp_type === 'totp'">Time based authentication require smart device with application.<br>(eg. Authenticator)<br>
      <v-tooltip bottom>
        <v-btn
          :disabled="dialog || data.otp_enabled"
          :loading="dialog"
          class="white--text"
          color="purple darken-2"
          @click="generate"
          slot="activator"
          small
        >
          Generate secure key
        </v-btn>
        <span>Please prepare your device. You will have 90 seconds for setting your totp authorization.</span>
      </v-tooltip>
      </span>
      <v-spacer></v-spacer>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!isEditing || (data.otp_type === 'totp' && !data.otp_enabled)"
        color="success"
        @click="save"
      >
        Save
      </v-btn>
    </v-card-actions>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="400"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          <v-progress-linear
            v-model="value"
            color="white"
            class="ma-1"
          ></v-progress-linear>
          <p>Please setup your device</p>
          <qrcode :text=otpUri :size="350"></qrcode>
          <p class="ma-1 pt-2 headline">Secret key: {{ otpSecret }}</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="success" @click="dialog=false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script>
  import VueQRCodeComponent from 'vue-qrcode-component';

  export default {
    components: {
      qrcode: VueQRCodeComponent
    },
    data() {
      return {
        lang: [
          { text: 'English' }
        ],
        auths: [
          { text: 'None', value: 'none' },
          { text: 'E-mail', value: 'email' },
          { text: 'TOTP', value: 'totp' }
        ],
        isEditing: null,
        model: null,
        dialog: false,
        value: 100,
        otpReady: false,
        otpUri: null,
        otpSecret: null,
        selectedAuth: null,
        data: {
          otp_enabled: null,
          otp_type: null,
          language: null
        }
      };
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      }
    },
    watch: {
      dialog(val) {
        if (!val) {
          this.otpUri = '';
          this.otpSecret = '';
          this.value = 100;
          // console.log('zatvorene');
        }
      }
    },
    methods: {
      getData() {
        const tmData = this.$store.getters['auth/me'];
        // console.log(tmData);
        this.data.otp_enabled = tmData.otp_enabled;
        this.data.otp_type = tmData.otp_type ? tmData.otp_type : 'none';
        this.data.language = tmData.language;
      },
      save() {
        this.isEditing = !this.isEditing;
        this.$store.dispatch('notify', { id: 0, message: 'Your language has changed', color: 'info' });
        this.$store.dispatch('updateMe', this.data);
        setTimeout(() => {
          this.$store.dispatch('fetchMe');
        }, 500);
      },
      generate() {
        this.$store.dispatch('otpMe');
        this.dialog = true;
        this.data.otp_enabled = true;
        setTimeout(() => {
          this.otpReady = true;
          this.otpUri = this.$store.state.users.otp.otp_uri;
          this.otpSecret = this.$store.state.users.otp.otp_secret;
          this.coutdown();
          // console.log(this.$store.state.users.otp);
        }, 500);
      },
      coutdown() {
        setInterval(() => {
          if (this.value === 0) {
            this.dialog = false;
            this.value = 100;
          }
          this.value -= 1;
        }, 1000);
      }
    },
    mounted() {
      this.$store.dispatch('fetchMe');
      this.getData();
      // console.log(this.$store.getters['auth/me']);
      // console.log(this.$store.getters.stats);
      // this.$store.dispatch('fetchStats');
      // this.$store.dispatch('otpMe');
    },
    created() {
      // this.getData();
    }
  };
</script>

<style scoped>

</style>
