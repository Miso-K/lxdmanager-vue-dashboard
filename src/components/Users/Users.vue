<template>
  <v-container grid-list-md>
  <v-card>
    <v-card-title>
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
      <v-dialog v-model="dialogDelete" max-width="490">
        <v-card>
          <v-card-title class="headline">Are you sure to delete user {{ editedItem.username }}?</v-card-title>
          <v-card-text>This action cannot by undo.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogDelete = false">Disagree</v-btn>
            <v-btn color="red darken-1" text @click.native="deleteItem" @click="dialogDelete = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on }">
          <v-btn
            color="primary"
            dark
            v-on="on"
          >
            New user
          </v-btn>
        </template>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Username" :rules="nameRules" v-model="editedItem.username" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Email" :rules="emailRules" v-model="editedItem.email" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Name" :rules="nameRules" v-model="editedItem.name" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Phone" v-model="editedItem.phone"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md8>
                <v-text-field label="Address" v-model="editedItem.address"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="City" v-model="editedItem.city"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Country" v-model="editedItem.country"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Postal code" v-model="editedItem.postal_code"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="ICO" v-model="editedItem.ico"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="IC DPH" v-model="editedItem.ic_dph"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="DIC" v-model="editedItem.dic"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md8>
                <v-text-field
                  :append-icon="show3 ? 'visibility_off' : 'visibility'"
                  :type="show3 ? 'text' : 'password'"
                  name="password"
                  label="Password"
                  hint="At least 8 characters"
                  value=""
                  autocomplete="new-password"
                  v-model="editedItem.password"
                  required
                  :rules="formNew ? passwordRules : ''"
                  @click:append="show3 = !show3"
                ></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-btn outlined block small @click="generatePassword(10)">Generate password</v-btn>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-checkbox
                  v-model="editedItem.otp_type"
                  value="email"
                  label="Enable OTP by Email"
                ></v-checkbox>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-autocomplete
                v-model="editedItem.containers"
                :disabled="isUpdating"
                :items="containersId"
                chips
                color="blue-grey lighten-2"
                label="Containers"
                item-text="text"
                item-value="value"
                multiple
              >
                <template
                  slot="selection"
                  slot-scope="data"
                >
                  <v-chip
                    :input-value="data.selected"
                    close
                    class="chip--select-multi"
                    @input="removeContainer(data.item)"
                  >
                    {{ data.item.text }}
                  </v-chip>
                </template>
                <template
                  slot="item"
                  slot-scope="data"
                >
                  <template >
                    <v-list-tile-content v-text="data.item.text"></v-list-tile-content>
                  </template>
                </template>
              </v-autocomplete>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click.native="save" :disabled="!valid" >Save</v-btn>
        </v-card-actions>
        </v-form>
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
      :search="search">
      <template v-slot:item.groups="{ item }">
        <span v-if="item.groups" v-for="element in item.groups">
          <v-chip small>{{ element.name }}</v-chip>
        </span>
      </template>
      <template v-slot:item.containers="{ item }">
        <span v-if="item.containers" v-for="element in item.containers">
          <v-chip small>{{ element.name }}</v-chip>
        </span>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn icon class="mx-0" @click="editItem(item)">
          <v-icon color="teal">edit</v-icon>
        </v-btn>
        <v-btn icon class="mx-0" @click="deleteDialog(item)">
          <v-icon color="pink">delete</v-icon>
        </v-btn>
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
        dialog: false,
        dialogDelete: false,
        show3: false,
        checkbox: false,
        headers: [
          {
            text: 'id',
            align: 'left',
            value: 'id',
            width: '1%'
          },
          {
            text: 'username',
            align: 'left',
            value: 'username'
          },
          {
            text: 'email',
            align: 'left',
            value: 'email'
          },
          {
            text: 'name',
            align: 'left',
            value: 'name'
          },
          {
            text: 'admin',
            align: 'left',
            value: 'admin'
          },
          {
            text: 'groups',
            align: 'left',
            value: 'groups',
            sortable: false
          },
          {
            text: 'containers',
            align: 'left',
            value: 'containers',
            sortable: false
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          }
        ],
        valid: false,
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 8) || 'Password must be more than 8 characters'
        ],
        editedIndex: -1,
        editedItem: {
          id: '',
          admin: '',
          username: '',
          email: '',
          name: '',
          phone: '',
          address: '',
          city: '',
          country: '',
          postal_code: '',
          ico: '',
          ic_dph: '',
          dic: '',
          groups: '',
          containers: '',
          password: '',
          otp_type: ''
        },
        defaultItem: {
          username: '',
          email: '',
          name: '',
          phone: '',
          city: '',
          country: '',
          postal_code: '',
          ico: '',
          ic_dph: '',
          dic: '',
          groups: '',
          containers: '',
          password: '',
          otp_type: ''
        }
      };
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New User' : 'Edit User';
      },
      formNew() {
        return this.editedIndex === -1;
      },
      items() {
        // console.log(this.$store.getters.usersTableData);
        return this.$store.getters.usersTableData;
      },
      containersId() {
        const containers = this.$store.getters.containersTableData;
        // console.log(containers.map(container => container.id));
        return containers.map(container => ({
          text: container.name,
          value: container.id
        }));
      }
    },
    watch: {
      dialog(val) {
        return val || this.close();
      }
    },
    methods: {
      removeContainer(item) {
        const index = this.editedItem.containers.indexOf(item.value);
        if (index >= 0) this.editedItem.containers.splice(index, 1);
      },
      editItem(item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        console.log(item);
        this.dialog = true;
      },
      deleteDialog(item) {
        this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
        // this.deleteItem(item);
      },
      deleteItem() {
        if (this.editedIndex > -1) {
          const item = this.editedItem;
          if (item.username !== 'user' && !item.admin) { // use for demo
          // if (!item.admin) {                          // use for production
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
            this.$store.dispatch('deleteUser', item.id);
            setTimeout(() => {
              this.$store.dispatch('fetchUsers');
            }, 500);
          } else {
            console.log('Delete this user is not allowed');
          }
        }
      },
      close() {
        this.dialog = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },
      save() {
        if (this.$refs.form.validate()) {
          if (this.editedIndex > -1) {
            Object.assign(this.items[this.editedIndex], this.editedItem);
            // console.log(this.editedItem);
            this.$store.dispatch('updateUser', this.editedItem);
            setTimeout(() => {
              this.$store.dispatch('fetchUsers');
            }, 500);
          } else {
            this.items.push(this.editedItem);
            this.$store.dispatch('createUser', this.editedItem);
            setTimeout(() => {
              this.$store.dispatch('fetchUsers');
            }, 500);
          }
          this.close();
        }
      },
      generatePassword(length) {
        const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789^°!"§$%&/()=?`*+~\'#,;.:-_';
        let retVal = '';
        for (let i = 0, n = charset.length; i < length; i += 1) {
          retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        // console.log(retVal);
        this.editedItem.password = retVal;
      },
      refreshData() {
        // this.fetchContainer(this.id);
        this.$store.dispatch('fetchUsers');
      }
    },
    mounted() {
      // console.log(this.$store.getters.usersTableData);
      this.$store.dispatch('fetchUsers');
    }
  };
</script>
