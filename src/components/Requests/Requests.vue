<template>
  <v-container grid-list-md>
  <v-card>
    <v-btn
              absolute
              dark
              fab
              top
              right
              small
              color="blue"
              @click="refreshData"
            >
              <v-icon>refresh</v-icon>
            </v-btn>
    <v-card-title>
      <v-dialog v-model="dialogDelete" max-width="520">
        <v-card>
          <v-card-title class="headline">Are you sure to delete request from history?</v-card-title>
          <v-card-text>This action cannot by undo.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogDelete = false">Disagree</v-btn>
            <v-btn color="red darken-1" text @click.native="deleteItem" @click="dialogDelete = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogConfirm" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Confirm Request</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  Metadata:
                </v-flex>
                <v-flex>
                  <ul id="metadataconfirm">
                    <li v-for="(value, name) in formatMetaData(editedItem.meta_data)" :key="name">
                      {{ name }}: {{ value }}
                    </li>
                  </ul>
                </v-flex>
                <v-flex>
                  <v-checkbox v-model="doAction" :label="`Do action: ${editedItem.message}`"></v-checkbox>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Close</v-btn>
            <v-btn color="blue darken-1" text @click="saveConfirm">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogMessage" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.message" label="Message"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Close</v-btn>
            <v-btn color="blue darken-1" text @click="save">Send</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogCancel" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Cancel Request</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="message_cancel" label="Message"></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Close</v-btn>
            <v-btn color="blue darken-1" text @click="save">Cancel request</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDetail" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Request Detail</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.action" label="Action"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.status" label="Status"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field v-model="editedItem.message" label="Message"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field :value="formatDate(editedItem.created_on)" label="Created"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md6>
                  <v-text-field :value="formatDate(editedItem.changed_on)" label="Changed"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  Metadata:
                </v-flex>
                <v-flex>
                  <ul id="metadata">
                    <li v-for="(value, name) in formatMetaData(editedItem.meta_data)" :key="name">
                      {{ name }}: {{ value }}
                    </li>
                  </ul>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="close">Close</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        :label="$t('actions.search')"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-if="items"
      :headers="computedHeaders"
      :items="items"
      :search="search">
      <template v-slot:item.users="{ item }">
        <span v-for="element in item.users">
          <v-chip small>{{ element.name }}</v-chip>
        </span>
      </template>
      <template v-slot:item.last_change="{ item }">
        {{ formatDate(item.last_change) }}
      </template>
      <template v-slot:item.actions="{ item }">
            <v-icon
              v-if="me.admin"
              :disabled="item.status === 'confirmed' || item.status === 'cancelled'"
              @click="confirmItem(item)"
            >
              check
            </v-icon>
            <v-icon
              :disabled="item.status === 'confirmed'"
              @click="editItem(item)"
            >
              message
            </v-icon>
            <v-icon
              :disabled="item.status === 'cancelled' || item.status === 'confirmed'"
              @click="cancelItem(item)"
            >
              cancel
            </v-icon>
            <v-icon
              @click="detailItem(item)"
            >
              more
            </v-icon>
            <v-icon v-if="me.admin"
              @click="deleteDialog(item)"
            >
              delete
            </v-icon>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="initialize">Reset</v-btn>
        </template>
    </v-data-table>
  </v-card>
  </v-container>
</template>

<script>

  export default {
    name: 'Requests',
    data() {
      return {
        doAction: false,
        search: '',
        pagination: {
          sortBy: 'last_change',
          descending: 'true',
          rowsPerPage: 10
        },
        dialogMessage: false,
        dialogDetail: false,
        dialogCancel: false,
        dialogConfirm: false,
        dialogDelete: false,
        message_cancel: 'Cancel this request',
        headers: [
          { text: 'Id', value: 'id', width: '5%' },
          { text: this.$t('requests.user'), value: 'users', width: '5%', user: false },
          {
            text: this.$t('requests.action'),
            sortable: true,
            value: 'action',
            width: '5%'
          },
          { text: this.$t('requests.status'), value: 'status', width: '5%' },
          { text: this.$t('requests.message'), value: 'message', width: '25%' },
          { text: this.$t('requests.changed'), value: 'last_change', width: '25%' },
          { text: this.$t('requests.actions'), value: 'actions', sortable: false, width: '15%' }
        ],
        valid: false,
        editedItemId: -1,
        editedIndex: -1,
        editedItem: {
          action: '',
          status: '',
          message: '',
          meta_data: '',
          changed_on: '',
          created_on: ''
        },
        defaultItem: {
          action: '',
          status: '',
          message: '',
          meta_data: '',
          changed_on: '',
          created_on: ''
        }
      };
    },
    watch: {
      dialog(val) {
        return val || this.close();
      }
    },
    methods: {
      formatDate(date) {
        if (date) {
          return date.substring(0, date.length - 5);
        } return '-';
      },
      formatMetaData(data) {
        if (data) {
          // console.log(data);
          return data;
        } return '';
      },
      editItem(item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editedItemId = item.id;
        this.editedItem.status = 'answered';
        this.dialogMessage = true;
      },
      confirmItem(item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editedItemId = item.id;
        this.editedItem.status = 'confirmed';
        this.dialogConfirm = true;
      },
      detailItem(item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDetail = true;
      },
      cancelItem(item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editedItemId = item.id;
        this.editedItem.status = 'cancelled';
        this.editedItem.message = this.message_cancel;
        this.dialogCancel = true;
      },
      deleteDialog(item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
      },
      deleteItem() {
        if (this.editedIndex > -1) {
          const item = this.editedItem;
          const index = this.items.indexOf(item);
          this.items.splice(index, 1);
          this.$store.dispatch('deleteRequests', item.id);
          setTimeout(() => {
            this.$store.dispatch('fetchRequests');
          }, 500);
        }
      },

      // deleteItem(item) {
      // const index = this.desserts.indexOf(item);
      // confirm('Are you sure you want to delete this item?') && this.desserts.splice(index, 1);
      // },

      close() {
        this.dialogMessage = false;
        this.dialogDetail = false;
        this.dialogCancel = false;
        this.dialogConfirm = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },

      save() {
        let meta = '';
        Object.entries(this.editedItem.meta_data).forEach(
          ([key, value]) => { meta += `${key}: ${value} <br>`; }
        );
        const mail_message = `${this.$i18n.t('requests.mail_message', [this.getProductionName, this.editedItem.action, this.editedItem.status, meta])}`;
        this.$store.dispatch('changeRequests', { id: this.editedItemId, message: this.editedItem.message, status: this.editedItem.status, mail_message });
        setTimeout(() => {
          this.$store.dispatch('fetchRequests');
        }, 500);
        this.close();
      },

      saveConfirm() {
        let meta = '';
        Object.entries(this.editedItem.meta_data).forEach(
          ([key, value]) => { meta += `${key}: ${value} <br>`; }
        );
        const mail_message = `${this.$i18n.t('requests.mail_message', [this.getProductionName, this.editedItem.action, this.editedItem.status, meta])}`;
        this.$store.dispatch('changeRequests', { id: this.editedItemId, message: this.editedItem.message, status: this.editedItem.status, mail_message });
        if (this.doAction) {
          if (this.editedItem.action === 'create') {
            this.$store.dispatch('createInstance', this.editedItem.meta_data);
          }
          if (this.editedItem.action === 'upgrade') {
            this.$store.dispatch('upgradeInstance', this.editedItem.meta_data);
          }
          if (this.editedItem.action === 'clone') {
            this.$store.dispatch('cloneInstance', this.editedItem.meta_data);
          }
          if (this.editedItem.action === 'delete') {
            this.$store.dispatch('deleteInstance', this.editedItem.meta_data.id);
          }
        }
        setTimeout(() => {
          this.$store.dispatch('fetchRequests');
        }, 500);
        this.close();
      },
      refreshData() {
        this.$store.dispatch('fetchRequests');
      }
    },
    computed: {
      items() {
        return this.$store.getters.requestsTableData;
      },
      me() {
        return this.$store.getters['auth/me'];
      },
      computedHeaders() {
        return this.headers.filter(h => !(h.user === this.me.admin));
      },
      getProductionName() {
        return this.$store.getters.appconfig.app.production_name;
      }
    },
    created() {
      this.$store.dispatch('fetchRequests');
    }
  };
</script>
