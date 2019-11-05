<template>
  <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm12 md10 lg10>

          <v-card
        class="hide-overflow"
        color="lighteen-1"
      >
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-toolbar
          card
          height="50px"
        >
          <v-icon>mdi-account</v-icon>
          <v-toolbar-title class="font-weight-light subheading">LXD & App config</v-toolbar-title>
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
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.endpoint"
                  label="LXD host address"
                  placeholder="https://127.0.0.1:8443"
                  required
                ></v-text-field>
                <v-select
                  :disabled="!isEditing"
                  :items="verify"
                  v-model="data.verify"
                  label="Verify certificate (require signed certificate)"
                  placeholder="False"
                ></v-select>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.production_name"
                  label="APP production name"
                  required
                  placeholder="LXDmanager.com"
                ></v-text-field>
                <v-btn color="orange" :disabled="!isEditing" small @click="dialog = true">Add LXD connection certificates</v-btn>
                <v-checkbox :disabled="!isEditing" v-model="email" label="Configure and enable email"></v-checkbox>
                <v-text-field
                  v-if="email"
                  :disabled="!isEditing"
                  v-model="data.sender"
                  label="SMTP sender"
                   placeholder="app@lxdmanager.com"
                  required
                ></v-text-field>
                <v-text-field
                  v-if="email"
                  :disabled="!isEditing"
                  v-model="data.recipient"
                  label="SMTP recipient (eg. support mail)"
                  required
                  placeholder="support@lxdmanager.com"
                ></v-text-field>
                <v-text-field
                  v-if="email"
                  :disabled="!isEditing"
                  v-model="data.server"
                  label="SMTP server"
                  required
                  placeholder="mail.lxdmanager.com"
                ></v-text-field>
                <v-text-field
                  v-if="email"
                  :disabled="!isEditing"
                  v-model="data.port"
                  label="SMTP port"
                  required
                  placeholder="587"
                ></v-text-field>
                <v-text-field
                  v-if="email"
                  :disabled="!isEditing"
                  v-model="data.login"
                  label="SMTP login"
                  required
                  placeholder="app@lxdmanager.com"
                ></v-text-field>
                <v-text-field
                  v-if="email"
                  :disabled="!isEditing"
                  :append-icon="show1 ? 'visibility' : 'visibility_off'"
                  v-model="data.password"
                  label="SMTP password"
                  required
                  placeholder="*********"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                ></v-text-field>
                <v-btn color="info" disabled small dark >Test LXD connection</v-btn>
                <v-btn color="info" disabled small dark >Test email</v-btn>
              </v-card-text>
              <v-divider class="mt-1"></v-divider>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" :disabled="!isEditing" @click="save">Save</v-btn>
              </v-card-actions>
        </v-form>
        </v-card>
      </v-flex>
      </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">LXD certificate and key</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout row>
                <span>Add new certificate and key for connection with your LXD server.</span>
              </v-layout>
              <v-layout row>
                <v-textarea
          name="input-7-1"
          label="LXD_cert.crt"
          v-model="certs.cert_crt"
          hint="Enter cert"
        ></v-textarea>
                </v-layout>
                <v-layout row>
                <v-textarea
          name="input-7-1"
          label="LXD_cert.key"
          v-model="certs.cert_key"
          hint="Enter key"
        ></v-textarea>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="dialog = false">Close</v-btn>
            <v-btn color="success" flat @click="savecerts">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-layout>
    </v-container>
</template>

<script>


  export default {
    name: 'AppConfig',
    components: {
    },
    data() {
      return {
        isEditing: null,
        show1: false,
        verify: ['True', 'False'],
        dialog: false,
        email: false,
        data: {
          endpoint: '',
          verify: '',
          sender: '',
          recipient: '',
          server: '',
          port: '',
          login: '',
          password: '',
          production_name: ''
        },
        certs: {
          cert_crt: '',
          cert_key: ''
        }
      };
    },
    methods: {
      save() {
        this.isEditing = !this.isEditing;
        this.$store.dispatch('notify', { id: 0, message: 'Your settings was saved', color: 'info' });
        this.$store.dispatch('saveAppConfig', this.data);
        setTimeout(() => {
          this.$store.dispatch('fetchAppConfig');
        }, 500);
      },
      savecerts() {
        this.isEditing = !this.isEditing;
        this.$store.dispatch('notify', { id: 0, message: 'Your certificates was saved', color: 'info' });
        this.$store.dispatch('saveCerts', this.certs);
        setTimeout(() => {
          this.$store.dispatch('fetchAppConfig');
        }, 500);
      }
    },
    mounted() {
      setTimeout(() => {
        this.$store.dispatch('fetchAppConfig').then(() => {
          this.data = this.$store.getters.appconfig;
        });
        console.log(this.$store.getters.appconfig);
      }, 500);
    }
  };
</script>
