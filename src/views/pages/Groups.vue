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
      <v-dialog v-model="dialogDelete" max-width="490">
        <v-card>
          <v-card-title class="headline">Are you sure to delete user {{ editedItem.name }}?</v-card-title>
          <v-card-text>This action cannot by undo.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialogDelete = false">Disagree</v-btn>
            <v-btn color="red darken-1" flat @click.native="deleteItem" @click="dialogDelete = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" max-width="700px">
      <v-btn color="primary" dark slot="activator" class="mb-1">New group</v-btn>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Group name" :rules="nameRules" v-model="editedItem.name" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm12 md12>
                <v-autocomplete
                v-model="editedItem.abilities"
                :disabled="isUpdating"
                :items="abilitiesId"
                chips
                color="blue-grey lighten-2"
                label="Abilities"
                item-text="text"
                item-value="value"
                multiple
              >
                <template
                  slot="selection"
                  slot-scope="data"
                >
                  <v-chip
                    :selected="data.selected"
                    close
                    class="chip--select-multi"
                    @input="removeAbility(data.item)"
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
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save" :disabled="!valid" >Save</v-btn>
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
      :search="search"
      :pagination.sync="pagination">
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td>{{ props.item.attributes.name }}</td>
        <td>
          <span v-for="element in getAbilitiessName(props.item.relationships.abilities.data)">
            <v-chip small>{{ element }}</v-chip>
          </span>
        </td>
        <td class="justify-left layout px-0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteDialog(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
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
    name: 'groups',
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
            text: 'name',
            align: 'left',
            value: 'name'
          },
          {
            text: 'abilities',
            align: 'left',
            value: 'abilities',
            sortable: false
          },
          {
            text: 'Actions',
            value: 'name',
            sortable: false
          }
        ],
        valid: false,
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 20) || 'Name must be less than 20 characters'
        ],
        editedIndex: -1,
        editedItem: {
          id: '',
          abilities: ''
        },
        defaultItem: {
          name: '',
          abilities: ''
        }
      };
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New Group' : 'Edit Group';
      },
      formNew() {
        return this.editedIndex === -1;
      },
      items() {
        // console.log(this.$store.getters.groupsTableData);
        return this.$store.getters.groupsTableData;
      },
      containersId() {
        const containers = this.$store.getters.containersTableData;
        // console.log(containers.map(container => container.id));
        return containers.map(container => ({
          text: container.name,
          value: container.id
        }));
      },
      abilitiesId() {
        const abilities = this.$store.getters.abilitiessTableData;
        // console.log(containers.map(container => container.id));
        return abilities.map(ability => ({
          text: ability.attributes.name,
          value: ability.id
        }));
      }
    },
    watch: {
      dialog(val) {
        return val || this.close();
      }
    },
    methods: {
      removeAbility(item) {
        const index = this.editedItem.abilities.indexOf(item.value);
        if (index >= 0) this.editedItem.abilities.splice(index, 1);
      },
      getAbilitiessName(abilities) {
        // console.log(this.$store.getters.abilities);
        return abilities.map(ability => this.$store.getters.ability(ability.id).attributes.name);
      },
      editItem(item) {
        this.editedIndex = this.items.indexOf(item);
        // this.editedItem = Object.assign({}, item);
        this.editedItem.id = item.id;
        this.editedItem.name = item.attributes.name;
        this.editedItem.abilities = item.relationships.abilities.data.map(ability => ({
          value: ability.id
        }));
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
          console.log(item);
          if (item.attributes.name !== 'admin') { // use for demo
          // if (!item.admin) {                          // use for production
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
            this.$store.dispatch('deleteGroup', item.id);
            setTimeout(() => {
              this.$store.dispatch('fetchGroups');
            }, 500);
          } else {
            console.log('Delete this group is not allowed');
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
            this.$store.dispatch('updateGroup', this.editedItem);
            setTimeout(() => {
              this.$store.dispatch('fetchGroups');
            }, 500);
          } else {
            this.items.push(this.editedItem);
            this.$store.dispatch('createGroup', this.editedItem);
            setTimeout(() => {
              this.$store.dispatch('fetchGroups');
            }, 500);
          }
          this.close();
        }
      },
      refreshData() {
        // this.fetchContainer(this.id);
        this.$store.dispatch('fetchGroups');
        this.$store.dispatch('fetchAbilities');
      }
    },
    mounted() {
      this.$store.dispatch('fetchGroups');
      this.$store.dispatch('fetchAbilities');
    }
  };
</script>
