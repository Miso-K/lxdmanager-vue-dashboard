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
        <v-btn
          color="primary"
          dark
          @click="newItem"
        >
          New network
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="search"
          :label="$t('actions.search')"
          single-line
          hide-details
          v-model="search"
        ></v-text-field>
      </v-card-title>
      <v-dialog v-model="dialogEdit" max-width="590">
        <v-card>
          <v-card-title class="headline">{{ formTitle }}</v-card-title>
          <v-card-text>
            <a href="https://lxd.readthedocs.io/en/latest/profiles/" target="_blank">LXD profiles documentation</a>
            <br>
            <v-textarea
              outlined
              auto-grow
              background-color="black"
              dark
              v-model="yamlString"
              :error-messages="yamlErrorMessages"
            ></v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogEdit = false">Disagree</v-btn>
            <v-btn color="red darken-1" text @click.native="save">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="490">
        <v-card>
          <v-card-title class="headline">Are you sure to delete profile: {{ editedName }}?</v-card-title>
          <v-card-text>This action cannot by undo.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogDelete = false">Disagree</v-btn>
            <v-btn color="red darken-1" text @click.native="deleteProfile" @click="dialogDelete = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        v-if="networks"
        :headers="headers"
        :items="networks"
        :search="search">
        <template v-slot:item.actions="{ item }">
          <v-btn v-if="item.managed" icon class="mx-0" @click="editItem(item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn v-if="item.managed" icon class="mx-0" @click="deleteItem(item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
          <v-btn v-if="false" icon class="mx-0" @click="moreItem(item)">
            <v-icon color="purple">more</v-icon>
          </v-btn>
        </template>
      </v-data-table>
      <br>
    </v-card>
  </v-container>
</template>

<script>
  const yaml = require('js-yaml');

  export default {
    name: 'Networks',
    components: { },
    data() {
      return {
        yamlString: '',
        yamlErrorMessages: '',
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
            text: 'Description',
            align: 'left',
            value: 'description',
            class: 'pl-1',
            sortable: true
          },
          {
            text: 'Managed',
            align: 'right',
            value: 'managed',
            class: 'pl-0',
            sortable: false
          },
          {
            text: 'Status',
            align: 'left',
            value: 'status',
            class: 'pa-1',
            sortable: true
          },
          {
            text: 'Type',
            align: 'left',
            value: 'type',
            class: 'pa-1'
          },
          {
            text: 'Actions',
            value: 'actions',
            class: '',
            sortable: false
          }
        ]
      };
    },
    computed: {
      formTitle() {
        return this.editedIndex === -1 ? 'New network' : 'Are you sure to edit network?';
      },
      networks() {
        return this.$store.getters.networksTableData;
      }
    },
    methods: {
      refreshData() {
        this.$store.dispatch('fetchNetworks');
      },
      newItem() {
        this.dialogEdit = true;
        this.editedIndex = -1;
      },
      editItem(item) {
        this.yamlString = yaml.safeDump(item);
        this.dialogEdit = true;
        this.editedIndex = 0;
      },
      save() {
        setTimeout(() => {
          try {
            this.dialogEdit = false;
            if (this.editedIndex === -1) {
              this.$store.dispatch('createNetwork', { data: yaml.safeLoad(this.yamlString) });
            } else {
              this.$store.dispatch('updateNetwork', { data: yaml.safeLoad(this.yamlString) });
            }
            setTimeout(() => {
              this.$store.dispatch('fetchNetworks');
            }, 1000);
          } catch (e) {
            console.log(e);
            this.yamlErrorMessages = 'Wrong yaml format';
          }
        }, 500);
      },
      deleteItem(item) {
        this.editedIndex = 0;
        this.editedName = item.name;
        this.dialogDelete = true;
      },
      deleteNetwork() {
        // console.log(this.editedName);
        // console.log('delete');
        this.$store.dispatch('deleteNetwork', this.editedName);
        setTimeout(() => {
          this.$store.dispatch('fetchNetworks');
        }, 1000);
      }
    },
    mounted() {
      this.$store.dispatch('fetchNetworks');
    }
  };
</script>

