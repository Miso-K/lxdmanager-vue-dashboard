<template>
  <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>

          <v-card flat
        class="hide-overflow"
        color="lighteen-1"
      >
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-app-bar flat
          height="50px"
        >
          <v-spacer></v-spacer>
          <v-btn
            fab
            small
            @click="isEditing = !isEditing"
          >
            <v-icon v-if="isEditing">close</v-icon>
            <v-icon v-else>edit</v-icon>
          </v-btn>
        </v-app-bar>
              <v-card-text>
                <v-select
                  :disabled="!isEditing"
                  :items="verify"
                  v-model="data.remote.verify"
                  label="Verify certificate (require signed certificate)"
                  placeholder="False"
                ></v-select>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.app.production_name"
                  label="APP production name"
                  required
                  placeholder="LXDmanager.com"
                ></v-text-field>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" :disabled="!isEditing" @click="save">Save</v-btn>
              </v-card-actions>
                <v-btn
                color="primary"
                small
                @click="newItem"
                :disabled="!isEditing"
              >
                New server
              </v-btn>
              <v-data-table
                v-if="servers"
                :headers="headers"
                :items="servers"
                :search="search">
                <template v-slot:item.actions="{ item }">
                  <v-btn icon class="mx-4" @click="testItem(item)">
                    <v-btn color="success" small :disabled="!isEditing">test</v-btn>
                  </v-btn>
                  <v-btn v-if="item.name !== 'default'" icon class="mx-4" @click="deleteItem(item)">
                    <v-btn color="error" small :disabled="!isEditing" >delete</v-btn>
                  </v-btn>
                </template>
              </v-data-table>
        </v-form>
        </v-card>
      </v-flex>
      </v-layout>
    <v-layout row justify-center>
      <v-dialog v-model="dialogTest" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="headline">LXD test connection</span>
          </v-card-title>
          <v-card-text>
            <span>Returned LXD server configuration: (Empty list if failed)</span>
            <v-container grid-list-md>
              <v-flex>
                  <ul id="lxddata">
                    <li v-for="(value, name) in checkconfig" :key="name">
                      {{ name }}:
                      <ul v-if="Array.isArray(value)" id="lxddatasub">
                        <li v-for="value2 in value" :key="value2">
                          {{ value2 }}
                        </li>
                      </ul>
                      <ul v-else-if="typeof value === 'object'">
                        <li v-for="(value3, name3) in value" :key="value3">
                          {{ name3 }}: {{ value3 }}
                        </li>
                      </ul>
                      <span v-else>{{ value }}</span>
                    </li>
                  </ul>
                </v-flex>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogTest = false">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogEdit" max-width="700px">
        <v-card>
          <v-form ref="form" v-model="valid" lazy-validation>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Name" v-model="editedItem.name" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="IP / hostname" v-model="editedItem.address" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Password" v-model="editedItem.password" required></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Verify" v-model="editedItem.verify"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field label="Websocket address" v-model="editedItem.exec_address"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="dialogEdit = false">Cancel</v-btn>
            <v-btn color="blue darken-1" text @click.native="saveServer">Add server</v-btn>
          </v-card-actions>
          </v-form>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="490">
        <v-card>
          <v-card-title class="headline">Are you sure to delete profile: {{ editedName }}?</v-card-title>
          <v-card-text>This action cannot by undo.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogDelete = false">Disagree</v-btn>
            <v-btn color="red darken-1" text @click.native="deleteServer" @click="dialogDelete = false">Agree</v-btn>
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
          remote: {
            endpoint: '',
            verify: ''
          },
          app: {
            production_name: ''
          },
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
        search: '',
        pagination: {
          sortBy: 'name',
          rowsPerPage: 10
        },
        dialogEdit: false,
        dialogDelete: false,
        editedIndex: -1,
        editedName: '',
        headers: [
          {
            text: 'Name',
            align: 'left',
            value: 'name',
            class: 'pl-4',
            sortable: true
          },
          {
            text: 'Address',
            align: 'left',
            value: 'address',
            class: 'pl-1',
            sortable: true
          },
          {
            text: 'WSS Address',
            align: 'left',
            value: 'exec_address',
            class: 'pl-1',
            sortable: true
          },
          {
            text: 'Verify',
            align: 'left',
            value: 'verify',
            class: 'pl-1',
            sortable: true
          },
          {
            text: 'Actions',
            value: 'actions',
            align: 'right',
            class: '',
            sortable: false
          }
        ],
        editedItem: {
          name: '',
          address: '',
          password: '',
          exec_address: '',
          verify: ''
        }
      };
    },
    computed: {
      checkconfig() {
        // console.log(this.$store.getters.checkconfig);
        return this.$store.getters.checkconfig ? this.$store.getters.checkconfig : '';
      },
      servers() {
        // console.log(this.$store.getters.profiles);
        return this.$store.getters.servers && this.$store.getters.servers;
      }
    },
    methods: {
      checkConfig(server) {
        setTimeout(() => {
          this.$store.dispatch('fetchCheckconfig', server);
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
      sendTestEmail() {
        this.save();
        this.$store.dispatch('createRequests', { action: 'test', message: 'Test email configuration', status: 'cancelled', meta_data: '' });
        this.$store.dispatch('notify', { id: 0, message: 'Test email was sent', color: 'info' });
        // console.log('testemail');
      },
      editItem(item) {
        console.log(item);
        this.dialogEdit = true;
        this.editedIndex = 0;
      },
      deleteItem(item) {
        this.editedIndex = 0;
        this.editedName = item.name;
        this.dialogDelete = true;
      },
      newItem() {
        this.dialogEdit = true;
        this.editedIndex = -1;
      },
      testItem(item) {
        this.checkConfig(item.name);
      },
      saveServer() {
        setTimeout(() => {
          try {
            const data = this.editedItem;
            this.dialogEdit = false;
            if (this.editedIndex === -1) {
              this.$store.dispatch('createServer', { data });
            } else {
              this.$store.dispatch('updateServer', { data });
            }
            setTimeout(() => {
              this.$store.dispatch('fetchServers');
            }, 1000);
          } catch (e) {
            console.log(e);
            this.yamlErrorMessages = 'Something gone wrong';
          }
        }, 500);
      },
      deleteServer() {
        this.$store.dispatch('deleteServer', this.editedName);
        setTimeout(() => {
          this.$store.dispatch('fetchServers');
        }, 1000);
      }
    },
    // created() {
    // this.initialize();
    // },
    mounted() {
      this.$store.dispatch('fetchServers');
      this.$store.dispatch('fetchAppConfig').then(() => {
        this.data = Object.assign({}, this.data, this.$store.getters.appconfig);
        // console.log(this.data);
        this.showPrice = this.data.price.enabled === 'True';
        this.showStorage = this.data.storage.enabled === 'True';
        this.showEmail = this.data.smtp.enabled === 'True';
      });
      // console.log(this.$store.getters.appconfig);
    }
  };
</script>

