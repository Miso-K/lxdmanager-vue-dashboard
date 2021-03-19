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
      <v-dialog v-model="dialog" max-width="700px">
        <template v-slot:activator="{ on }">
        <v-btn
          color="primary"
          dark
          v-on="on"
        >
          New image
        </v-btn>
      </template>
        <remote-images :serverName=serverName dialog></remote-images>
      </v-dialog>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="mdi-magnify"
        :label="$t('actions.search')"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-dialog v-model="dialogEdit" max-width="490">
      <v-card>
        <v-card-title class="headline">Are you sure to edit image: {{ editedItem.name }}?</v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editedItem.new_name"
            :value="editedItem.name"
            label="Alias name"
          ></v-text-field>
          <v-text-field
            v-model="editedItem.alias_description"
            label="Alias description"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogEdit = false">Disagree</v-btn>
          <v-btn color="red darken-1" text @click.native="save" @click="dialogEdit = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" max-width="490">
      <v-card>
        <v-card-title class="headline">Are you sure to delete image: {{ editedItem.name }}?</v-card-title>
        <v-card-text>This action cannot by undo.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" text @click="dialogDelete = false">Disagree</v-btn>
          <v-btn color="red darken-1" text @click.native="deleteItem" @click="dialogDelete = false">Agree</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      v-if="images"
      :headers="headers"
      :items="images"
      :search="search">
      <template v-slot:item.actions="{ item }">
        <v-btn icon class="mx-0" @click="editItem(item)">
          <v-icon color="teal">mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon class="mx-0" @click="deleteDialog(item)">
          <v-icon color="pink">mdi-delete</v-icon>
        </v-btn>
      </template>
      <template v-slot:item.size="{ item }">
        {{ formatSize(item.size) }}
      </template>
      <template v-slot:item.uploaded_at="{ item }">
        {{ formatDate(item.uploaded_at) }}
      </template>
    </v-data-table>
    <br>
  </v-card>
  </v-container>
</template>

<script>
  import RemoteImages from './RemoteImages';
  import { humanFileSize } from '../../libraries/utils/helpers';

  export default {
    name: 'ImagesCard',
    components: {
      'remote-images': RemoteImages
    },
    props: ['serverName'],
    data() {
      return {
        search: '',
        pagination: {
          sortBy: 'alias',
          rowsPerPage: 10
        },
        dialogDelete: false,
        dialogEdit: false,
        dialog: false,
        headers: [
          {
            text: 'Alias',
            align: 'left',
            value: 'name',
            class: 'pl-4',
            sortable: true
          },
          {
            text: 'Alias description',
            align: 'left',
            value: 'alias_description',
            class: 'pl-1',
            sortable: true
          },
          {
            text: 'Fingerprint',
            align: 'right',
            value: 'fingerprint',
            class: 'pl-0',
            sortable: false
          },
          {
            text: 'Public',
            align: 'left',
            value: 'public',
            class: 'pa-1',
            sortable: true
          },
          {
            text: 'Description',
            align: 'left',
            value: 'description',
            class: 'pa-1'
          },
          {
            text: 'Arch',
            align: 'left',
            value: 'architecture',
            class: 'pa-1'
          },
          {
            text: 'Type',
            align: 'left',
            value: 'type',
            class: 'pa-1'
          },
          {
            text: 'Size',
            align: 'left',
            value: 'size',
            sortable: false,
            class: 'pa-1'
          },
          {
            text: 'Upload date',
            align: 'left',
            value: 'uploaded_at',
            sortable: false,
            class: 'pa-1'
          },
          {
            text: 'Actions',
            value: 'actions',
            sortable: false
          }
        ],
        editedItem: {
          name: '',
          new_name: '',
          alias_description: '',
          server: ''
        }
      };
    },
    computed: {
      images() {
        // console.log(this.$store.getters.imagesTableData);
        return this.$store.getters.imagesTableData.filter(
          project => project.relationships.servers[0].name === this.serverName);
        // return this.$store.getters.imagesTableData;
      }
    },
    methods: {
      formatSize(size) {
        return humanFileSize(size);
      },
      formatDate(date) {
        const d = new Date(date);
        return d.toDateString();
      },
      refreshData() {
        // this.$store.dispatch('fetchRemoteImages');
        this.$store.dispatch('fetchImages');
        // console.log(this.$store.state.images);
        // console.log(this.$store.getters.imagesTableData);
      },
      editItem(item) {
        // this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editedItem.new_name = this.editedItem.name;
        this.editedItem.server = this.serverName;
        console.log(item);
        this.dialogEdit = true;
      },
      deleteDialog(item) {
        // this.editedIndex = this.items.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.dialogDelete = true;
        // this.deleteItem(item);
      },
      deleteItem() {
        console.log(this.editedItem);
        console.log('delete');
        this.$store.dispatch('deleteImage', { fingerprint: this.editedItem.fingerprint, server: this.serverName });
        setTimeout(() => {
          this.$store.dispatch('fetchImages');
        }, 1000);
      },
      save() {
        if (this.editedItem.name === '') {
          setTimeout(() => {
            this.$store.dispatch('createImageAlias', this.editedItem);
          }, 500);
        } else {
          setTimeout(() => {
            this.$store.dispatch('updateImageDescription', this.editedItem);
            setTimeout(() => {
              if (this.editedItem.new_name !== this.editedItem.name) {
                this.$store.dispatch('updateImageName', this.editedItem);
              }
            }, 300);
          }, 500);
        }
        setTimeout(() => {
          this.$store.dispatch('fetchImages');
        }, 1000);
      }
    },
    mounted() {
      // if (!this.$store.getters.imagesTableData) {
      //  this.$store.dispatch('fetchImages');
      //  console.log('fetchedImages');
      // }
      this.$store.dispatch('fetchImages');
      // console.log('fetchedImages');
    }
  };
</script>

