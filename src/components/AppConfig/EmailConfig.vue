<template>
  <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>

          <v-card
            flat
        class="hide-overflow"
        color="lighteen-1"
      >
        <v-form ref="form" lazy-validation>
        <v-app-bar flat
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
                <v-checkbox :disabled="!isEditing" v-model="showEmail" label="Enable email"></v-checkbox>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.smtp.sender"
                  label="SMTP sender"
                   placeholder="app@lxdmanager.com"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.smtp.recipient"
                  label="SMTP recipient (eg. support mail)"
                  required
                  placeholder="support@lxdmanager.com"
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.smtp.server"
                  label="SMTP server"
                  required
                  placeholder="mail.lxdmanager.com"
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.smtp.port"
                  label="SMTP port"
                  required
                  placeholder="587"
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.smtp.login"
                  label="SMTP login"
                  required
                  placeholder="app@lxdmanager.com"
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  :append-icon="show1 ? 'mdi-eye-off' : 'mdi-eye'"
                  v-model="data.smtp.password"
                  label="SMTP password"
                  required
                  placeholder="*********"
                  :type="show1 ? 'text' : 'password'"
                  @click:append="show1 = !show1"
                ></v-text-field>
                <v-btn v-if="showEmail" :disabled="!isEditing" :dark="isEditing" color="green" small @click=sendTestEmail()>Send test email</v-btn>
              </v-card-text>
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
            <v-btn color="blue darken-1" text @click="dialog = false">Close</v-btn>
            <v-btn color="success" text @click="savecerts">Save</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogTest" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">LXD test connection</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              {{ checkconfig }}
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogTest = false">Close</v-btn>
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
        showPrice: false,
        showStorage: false,
        showEmail: false,
        show1: false,
        verify: ['True', 'False'],
        dialog: false,
        dialogTest: false,
        data: {
          endpoint: '',
          verify: '',
          production_name: '',
          smtp: {
            enabled: false,
            sender: '',
            recipient: '',
            server: '',
            port: '',
            login: '',
            password: ''
          },
          storage: {
            enabled: false,
            pool_name: ''
          },
          price: {
            enabled: false,
            cpu: '',
            memory: '',
            disk: '',
            periodes: {
              month: '',
              months: '',
              halfyear: '',
              year: '',
              years: ''
            }
          }
        },
        certs: {
          cert_crt: '',
          cert_key: ''
        }
      };
    },
    computed: {
      checkconfig() {
        return this.$store.getters.checkconfig[0] ? this.$store.getters.checkconfig[0].attributes : '';
      }
    },
    methods: {
      checkConfig() {
        setTimeout(() => {
          this.$store.dispatch('fetchCheckconfig');
        }, 500);
        this.dialogTest = true;
      },
      update_checkboxes() {
        this.$store.commit('update_checkboxes', this.data.storage.enabled);
      },
      save() {
        this.isEditing = !this.isEditing;
        const data = this.data;
        data.price.enabled = this.showPrice;
        data.storage.enabled = this.showStorage;
        data.smtp.enabled = this.showEmail;
        this.$store.dispatch('notify', { id: 0, message: 'Your settings was saved', color: 'info' });
        this.$store.dispatch('saveAppConfig', data);
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
      },
      sendTestEmail() {
        this.save();
        this.$store.dispatch('createRequests', { action: 'test', message: 'Test email configuration', status: 'cancelled', meta_data: '' });
        this.$store.dispatch('notify', { id: 0, message: 'Test email was sent', color: 'info' });
        console.log('testemail');
      }
    },
    // created() {
    // this.initialize();
    // },
    mounted() {
      this.$store.dispatch('fetchAppConfig').then(() => {
        this.data = Object.assign({}, this.data, this.$store.getters.appconfig);
        this.showPrice = this.data.price.enabled === 'True';
        this.showStorage = this.data.storage.enabled === 'True';
        this.showEmail = this.data.smtp.enabled === 'True';
      });
    }
  };
</script>

