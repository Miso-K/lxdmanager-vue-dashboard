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
          <v-icon>mdi-refresh</v-icon>
        </v-btn>
        <v-btn
          color="primary"
          dark
          @click="newItem"
        >
          New project - {{ serverName }}
        </v-btn>
        <v-spacer></v-spacer>
        <v-text-field
          append-icon="mdi-magnify"
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
            <a href="https://lxd.readthedocs.io/en/latest/projects/" target="_blank">LXD projects documentation</a>
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
          <v-card-title class="headline">Are you sure to delete project: {{ editedName }}?</v-card-title>
          <v-card-text>This action cannot by undo.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" text @click="dialogDelete = false">Disagree</v-btn>
            <v-btn color="red darken-1" text @click.native="deleteProject" @click="dialogDelete = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-data-table
        v-if="projects"
        :headers="headers"
        :items="projects"
        :search="search">
        <template v-slot:item.actions="{ item }">
          <v-btn icon class="mx-0" @click="editItem(item)">
            <v-icon color="teal">mdi-pencil</v-icon>
          </v-btn>
          <v-btn v-if="item.name !== 'default'" icon class="mx-0" @click="deleteItem(item)">
            <v-icon color="pink">mdi-delete</v-icon>
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
    name: 'ProjectsCard',
    components: { },
    props: ['serverName'],
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
            text: 'Used by',
            align: 'left',
            value: 'used_by.length',
            class: 'pa-1',
            sortable: true
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
        return this.editedIndex === -1 ? 'New project' : 'Are you sure to edit project?';
      },
      projects() {
        return this.$store.getters.projectsTableData && this.$store.getters.projectsTableData.filter(
          project => project.relationships.servers[0].name === this.serverName);
      }
    },
    methods: {
      getKeys(item) {
        return Object.keys(item);
      },
      refreshData() {
        this.$store.dispatch('fetchProjects');
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
          console.log(yaml.safeLoad(this.yamlString));
          try {
            console.log(yaml.safeLoad(this.yamlString));
            this.dialogEdit = false;
            if (this.editedIndex === -1) {
              console.log(this.serverName);
              this.$store.dispatch('createProject', { data: yaml.safeLoad(this.yamlString), server: this.serverName });
            } else {
              this.$store.dispatch('updateProject',
                { data: yaml.safeLoad(this.yamlString), server: this.serverName });
            }
            setTimeout(() => {
              this.$store.dispatch('fetchProjects');
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
      deleteProject() {
        this.$store.dispatch('deleteProject', { server: this.serverName, name: this.editedName });
        setTimeout(() => {
          this.$store.dispatch('fetchProjects');
        }, 1000);
      }
    },
    mounted() {
      this.$store.dispatch('fetchProjects');
    }
  };
</script>

