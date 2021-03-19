<template>
  <v-card flat>
    <v-app-bar
      flat
      height="50px"
    >
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        @click="isEditing = !isEditing"
      >
        <v-icon v-if="isEditing">mdi-close</v-icon>
        <v-icon v-else>mdi-pencil</v-icon>
      </v-btn>
    </v-app-bar>
    <v-card-text>
      <v-select
        v-model="$i18n.locale"
        :disabled="!isEditing"
        :items="lang"
        :label="$t('settings.settings.language')"
        :value="data.language"
      ></v-select>
      <v-select
        :disabled="!isEditing"
        v-model="data.otp_type"
        :items="auths"
        :label="$t('settings.settings.two_factor')"
      ></v-select>
      <span v-if="data.otp_type === 'none'">{{ $t('settings.settings.hint') }}</span>
      <span v-if="data.otp_type === 'email'">{{ $t('settings.settings.hint_email') }}</span>
      <span v-if="data.otp_type === 'totp'">{{ $t('settings.settings.hint_totp') }}
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
          {{ $t('settings.settings.generate') }}
        </v-btn>
        <span>{{ $t('settings.settings.help') }}</span>
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
        {{ $t('actions.save') }}
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
          { text: 'English', value: 'en' },
          { text: 'Slovensky', value: 'sk' }
        ],
        langs: ['sk', 'en'],
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
      },
      emailEnabled() {
        return this.$store.getters.appconfig.smtp.enabled === 'True';
      },
      auths() {
        // console.log(this.emailEnabled);
        if (this.emailEnabled) {
          return [
            { text: 'None', value: 'none' },
            { text: 'E-mail', value: 'email' },
            { text: 'TOTP', value: 'totp' }
          ];
        }
        return [
          { text: 'None', value: 'none' },
          { text: 'TOTP', value: 'totp' }
        ];
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
        this.data.language = this.$i18n.locale;
        console.log(this.data.language);
        this.isEditing = !this.isEditing;
        this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.language_changed')}`, color: 'info' });
        this.$store.dispatch('updateMe', this.data);
        setTimeout(() => {
          this.$store.dispatch('fetchMe');
        }, 500);
      },
      generate() {
        this.$store.dispatch('otpMe');
        this.dialog = true;
        this.data.otp_enabled = true;
        // console.log(this.$store.state.users);
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

