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
            <v-btn color="green darken-1" text @click="dialogDelete = false">Disagree</v-btn>
            <v-btn color="red darken-1" text @click.native="deleteItem" @click="dialogDelete = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <groups-edit :itemId="editedItem.id" :itemName="editedItem.name" :abilitiesUserList="editedItem.abilitiesUserList" :editedIndex="editedIndex" v-bind:dialog.sync="dialog"></groups-edit>
      <v-btn color="primary" dark @click.stop="dialog = true" class="mb-1">New group</v-btn>
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
      <template v-slot:item.abilities="{ item }">
        <span v-for="element in item.relationships.abilities">
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
  import GroupsEdit from './GroupsEdit';

  export default {
    name: 'groups',
    components: {
      'groups-edit': GroupsEdit
    },
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
        switchValue: true,
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
            value: 'actions',
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
          abilities: '',
          abilitiesUserList: []
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
        return this.$store.getters.groupsTableData;
      }
    },
    watch: {
      dialog(val) {
        return val || this.close();
      }
    },
    methods: {
      removeAbility(item) {
        // const index = this.editedItem.abilities.indexOf(item.value);
        const index = this.editedItem.abilities.findIndex(x => x.id === item.id);
        // console.log(index);
        if (index >= 0) this.editedItem.abilities.splice(index, 1);
        // console.log(this.editedItem.abilities);
      },
      editItem(item) {
        this.editedIndex = this.items.indexOf(item);
        // this.editedItem = Object.assign({}, item);
        this.editedItem.id = item.id;
        this.editedItem.name = item.name;
        this.editedItem.abilities = item.relationships.abilities.map(ability => ({
          id: ability.id,
          name: ability.name
        }));
        this.editedItem.abilitiesUserList = item.relationships.abilities.map(ability =>
          (ability.name));
        // console.log(this.editedItem.abilitiesUserList);
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
          if (item.name !== 'admin') { // use for demo
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
      refreshData() {
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
