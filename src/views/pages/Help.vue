<template>
  <v-container grid-list-md>
    <v-card
      class="hide-overflow"
    >
      <v-form ref="form" v-model="valid" lazy-validation>
      <v-toolbar
        card
        color=""
      >
        <v-icon>mdi-account</v-icon>
        <v-toolbar-title class="font-weight-light">Contact Us</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-card-text>
        <v-text-field
          label="Subject"
          v-model="subject"
        ></v-text-field>
        <v-textarea
          label="Message"
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
          Clear
        </v-btn>
        <v-btn
          color="success"
          @click="save"
        >
          Send
        </v-btn>
      </v-card-actions>
      <v-snackbar
        v-model="hasSent"
        :timeout="2000"
        absolute
        bottom
        center
      >
        Your message has been sucessfully sent
      </v-snackbar>
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
        const data = {
          subject: this.subject,
          message: this.message,
          copy: false
        };
        this.$store.dispatch('sendRequest', data);
        this.subject = '';
        this.message = '';
      }
    }
  };
</script>
