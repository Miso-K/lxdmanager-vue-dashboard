<template>
  <div>
<v-container fluid grid-list-xl>
    <v-layout row>
      <v-flex md2 offset-md1>
        <v-btn @click="createItem()" color="success">Create snapshot</v-btn>
      </v-flex>
      <v-flex md6 >
        <v-text-field
          name="snapshot-name"
          label="Snapshot name"
          id="snapshot"
          v-model="snapshot_name"
        ></v-text-field>
      </v-flex>
    </v-layout>
  <v-layout row>

    <v-flex md12 offset-md0>
      <v-data-table
        v-if="items"
        :headers="headers"
        :items="items"
        :search="search"
        :pagination.sync="pagination">
        <template slot="items" slot-scope="props">
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.date }}</td>
          <td class="text-xs-right">
            <v-btn @click="restoreAction(props.item)" color="info">Restore</v-btn>
            <v-btn @click="deleteAction(props.item)" color="error">Delete</v-btn>
          </td>
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="dialog_destroy" max-width="500">
      <v-card>
        <v-card-title class="headline">Delete this snapshot?</v-card-title>

        <v-card-text>
          This action is not reversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog_destroy = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click.native="dialog_destroy = false"
            @click="deleteItem(action_item)"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_restore" max-width="500">
      <v-card>
        <v-card-title class="headline">Restore this snapshot?</v-card-title>

        <v-card-text>
          This action is not reversible.
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            flat="flat"
            @click="dialog_restore = false"
          >
            Disagree
          </v-btn>

          <v-btn
            color="red darken-1"
            flat="flat"
            @click.native="dialog_restore = false"
            @click="restoreItem(action_item)"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</v-layout>
</v-container>
  </div>
</template>

<script>
  export default {
    name: 'snapshots',
    data() {
      return {
        dialog_destroy: false,
        action_item: '',
        dialog_restore: false,
        snapshot_name: '',
        search: '',
        pagination: {
          sortBy: 'state'
        },
        headers: [
          {
            text: 'name',
            align: 'left',
            value: 'name'
          },
          {
            text: 'date',
            align: 'left',
            value: 'date'
          },
          {
            text: 'action',
            align: 'right',
            value: 'action'
          }
        ],
        items: []
      };
    },
    watch: {
      dialog(val) {
        return val || this.close();
      }
    },
    created() {
      this.initialize();
    },
    methods: {
      initialize() {
        this.items = [
          {
            value: false,
            name: 'Backup_daily',
            date: '10.10.2018',
            action: 'Restore, Delete'
          },
          {
            value: false,
            name: 'Backup_daily',
            date: '11.10.2018',
            action: 'Restore, Delete'
          },
          {
            value: false,
            name: 'Backup_daily',
            date: '12.10.2018',
            action: 'Restore, Delete'
          },
          {
            value: false,
            name: 'Backup_daily',
            date: '13.10.2018',
            action: 'Restore, Delete'
          }
        ];
      },

      deleteAction(item) {
        this.dialog_destroy = true;
        this.action_item = item;
      },
      deleteItem(item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
      },

      restoreAction(item) {
        this.dialog_restore = true;
        this.action_item = item;
      },
      restoreItem(item) {
        console.log('item restored');
        console.log(item);
        this.$store.dispatch('notify', { id: 0, message: 'Your snapshot was restored', color: '' });
      },

      createItem() {
        const d = new Date();
        if (this.snapshot_name !== '') {
          const obj = {
            value: false,
            name: this.snapshot_name,
            date: `${d.getDate()}.${d.getMonth()}.${d.getFullYear()}`,
            action: 'Restore, Delete'
          };

          console.log(new Date());
          this.items.push(obj);
          this.$store.dispatch('notify', { id: 0, message: 'Your snapshot was created', color: '' });
        }
      },

      close() {
        this.dialog = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      }
    }
  };
</script>
4
