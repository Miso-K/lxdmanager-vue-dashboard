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
      <v-dialog v-model="dialogConfirm" max-width="500px">
        <v-card>
          <v-card-title>
            <span class="headline">Confirm Request</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    name="meta_data"
                    label="Metadata"
                    v-model="editedItem.meta_data"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="saveConfirm">Confirm</v-btn>
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
            <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Send</v-btn>
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
            <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
            <v-btn color="blue darken-1" flat @click="save">Cancel request</v-btn>
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
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.created_on" label="Created"></v-text-field>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field v-model="editedItem.changed_on" label="Changed"></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-textarea
                    name="meta_data"
                    label="Metadata"
                    v-model="editedItem.meta_data"
                  ></v-textarea>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" flat @click="close">Close</v-btn>
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
      :headers="headers"
      :items="items"
      :search="search"
      :pagination.sync="pagination">
      <template slot="items" slot-scope="props">
          <td>
            <span v-for="element in getUsersName(props.item.users)">
              <v-chip small>{{ element }}</v-chip>
            </span>
          </td>
          <td>{{ props.item.action }}</td>
          <td class="text-xs">{{ props.item.status }}</td>
          <td class="text-xs">{{ props.item.message }}</td>
          <td class="text-xs">{{ props.item.changed_on ? props.item.changed_on : props.item.created_on}}</td>
          <td class="text-xs-right layout px-0">
            <v-icon
              v-if="me.admin"
              :disabled="props.item.status === 'confirmed' || props.item.status === 'cancelled'"
              @click="confirmItem(props.item)"
            >
              check
            </v-icon>
            <v-icon
              :disabled="props.item.status === 'confirmed'"
              @click="editItem(props.item)"
            >
              message
            </v-icon>
            <v-icon
              :disabled="props.item.status === 'cancelled' || props.item.status === 'confirmed'"
              @click="cancelItem(props.item)"
            >
              cancel
            </v-icon>
            <v-icon
              @click="detailItem(props.item)"
            >
              more
            </v-icon>
          </td>
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
    name: 'users',
    data() {
      return {
        search: '',
        pagination: {
          sortBy: 'state',
          rowsPerPage: 10
        },
        dialogMessage: false,
        dialogDetail: false,
        dialogCancel: false,
        dialogConfirm: false,
        message_cancel: 'Cancel this request',
        headers: [
          { text: 'User', value: 'user' },
          {
            text: 'Action',
            sortable: true,
            value: 'action'
          },
          { text: 'Status', value: 'status' },
          { text: 'Message', value: 'message' },
          { text: 'Changed', value: 'changed' },
          { text: 'Actions', value: 'name', sortable: false }
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
      getUsersName(users) {
        if (!this.me.admin) {
          return ['Myself'];
        }
        try {
          // console.log(this.$store.getters.user(2).attributes.name);
          return users.map(user => this.$store.getters.user(user.id).attributes.name);
          // return users.map(user => user.id);
        } catch (error) {
          // this.$store.dispatch('fetchUsers');
          return ['unknown'];
        }
        // return users;
      },
      editItem(item) {
        console.log(item);
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
        this.$store.dispatch('changeRequests', { id: this.editedItemId, message: this.editedItem.message, status: this.editedItem.status });
        setTimeout(() => {
          this.$store.dispatch('fetchRequests');
        }, 500);
        this.close();
      },

      saveConfirm() {
        this.$store.dispatch('changeRequests', { id: this.editedItemId, message: this.editedItem.message, status: this.editedItem.status });
        console.log(`'${this.editedItem.meta_data}'`);
        const str = this.editedItem.meta_data.replace(/'/g, '"');
        // const str = JSON.stringify(this.editedItem.meta_data);
        console.log(str);
        console.log(JSON.parse(str));
        if (this.editedItem.action === 'create') {
          this.$store.dispatch('createContainer', JSON.parse(str));
        }
        if (this.editedItem.action === 'upgrade') {
          this.$store.dispatch('upgradeContainer', JSON.parse(str));
        }
        if (this.editedItem.action === 'clone') {
          this.$store.dispatch('cloneContainer', JSON.parse(str));
        }
        if (this.editedItem.action === 'delete') {
          this.$store.dispatch('deleteContainer', JSON.parse(str).id);
        }
        setTimeout(() => {
          this.$store.dispatch('fetchRequests');
        }, 500);
        this.close();
      }
    },
    computed: {
      items() {
        console.log(this.$store.getters.requests);
        // return this.$store.getters.requestsTableData.map(item => item.attributes);
        return this.$store.getters.requestsTableData;
      },
      me() {
        return this.$store.getters['auth/me'];
      },
      refreshData() {
        // this.fetchContainer(this.id);
        this.$store.dispatch('fetchRequests');
      }
    },
    mounted() {
    },
    created() {
      this.$store.dispatch('fetchUsers');
      this.$store.dispatch('fetchRequests');
    }
  };
</script>
