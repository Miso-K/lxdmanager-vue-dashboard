<template>
  <v-container grid-list-md>
    <v-card
      class="hide-overflow"
    >
      <v-form ref="form" lazy-validation>
      <v-app-bar flat
        color=""
      >
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title class="font-weight-light">{{ $t('help.title') }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>
      <v-card-text>
        <v-text-field
          :label="$t('help.subject')"
          v-model="subject"
        ></v-text-field>
        <v-textarea
          :label="$t('help.message')"
          v-model="message"
        ></v-textarea>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey"
          dark
          @click="clear"
        >
          {{ $t('actions.cancel') }}
        </v-btn>
        <v-btn
          color="success"
          @click="save"
        >
          {{ $t('actions.save') }}
        </v-btn>
      </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>

  export default {
    name: 'Help',
    data() {
      return {
        hasSent: false,
        subject: '',
        message: ''
      };
    },
    methods: {
      me() {
        // console.log(this.$store.getters['auth/me']);
        this.data = this.$store.getters['auth/me'];
      },
      clear() {
        this.$refs.form.reset();
      },
      save() {
        this.hasSent = true;
        this.$store.dispatch('createRequests', { action: 'help', message: this.subject, status: 'waiting', meta_data: { text: this.message }, mail_message: this.message });
        this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.request_created')}`, color: '' });
        this.active = false;
        this.subject = '';
        this.message = '';
      }
    }
  };
</script>
