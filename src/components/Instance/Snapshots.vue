<template>
  <div>
<v-container fluid grid-list-xl>
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
    <v-layout row>
      <v-flex md3 offset-md1>
        <v-btn @click="createItem()" color="success">{{ $t('instances.snapshots.create') }}</v-btn>
      </v-flex>
      <v-flex md8 >
        <v-text-field
          name="snapshot-name"
          :label="$t('instances.snapshots.name')"
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
        :search="search">
        <template v-slot:item.actions="{ item }">
          <v-btn small @click="restoreAction(item)" color="info">{{ $t('instances.actions.restore') }}</v-btn>
          <v-btn small @click="deleteAction(item)" color="error">{{ $t('instances.actions.delete') }}</v-btn>
        </template>
        <template v-slot:item.created_at="{ item }">
          {{ formatDate(item.created_at) }}
        </template>
      </v-data-table>
    </v-flex>
    <v-dialog v-model="dialog_destroy" max-width="500">
      <v-card>
        <v-card-title class="headline">{{$t('instances.order.delete_snapshot.title')}}</v-card-title>

        <v-card-text>
          {{$t('instances.order.delete_snapshot.text')}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog_destroy = false"
          >
            {{$t('actions.disagree')}}
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click.native="dialog_destroy = false"
            @click="deleteItem(action_item)"
          >
            {{$t('actions.agree')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_restore" max-width="500">
      <v-card>
        <v-card-title class="headline">{{$t('instances.order.restore_snapshot.title')}}</v-card-title>

        <v-card-text>
          {{$t('instances.order.restore_snapshot.text')}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog_restore = false"
          >
            {{$t('actions.disagree')}}
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click.native="dialog_restore = false"
            @click="restoreItem(action_item)"
          >
            {{$t('actions.agree')}}
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
        headers: [
          {
            text: this.$t('instances.snapshots.name'),
            align: 'left',
            value: 'name'
          },
          {
            text: this.$t('instances.snapshots.date'),
            align: 'left',
            value: 'created_at'
          },
          {
            text: this.$t('actions.name'),
            align: 'right',
            value: 'actions'
          }
        ],
        items: []
      };
    },
    computed: {
      id() {
        return Number(this.$route.params.id);
      },
      instance() {
        return this.$store.getters.instanceDataId(this.id);
      }
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
        this.items = this.$store.getters.snapshotsTableData || [];
        // console.log(this.items);
      },

      formatDate(date) {
        const d = new Date(date);
        return d.toDateString();
      },
      deleteAction(item) {
        this.dialog_destroy = true;
        this.action_item = item;
      },
      deleteItem(item) {
        const index = this.items.indexOf(item);
        this.items.splice(index, 1);
        // console.log(item);
        this.$store.dispatch('deleteSnapshot', { id: this.id, name: item.name });
        this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.snapshot_deleted')}`, color: '' });
      },

      restoreAction(item) {
        this.dialog_restore = true;
        this.action_item = item;
      },
      restoreItem(item) {
        // console.log('item restored');
        // console.log(item);
        this.$store.dispatch('restoreSnapshot', { id: this.id, name: item.name });
        this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.snapshot_restored')}`, color: '' });
      },

      createItem() {
        if (this.snapshot_name !== '') {
          const obj = {
            value: false,
            name: this.snapshot_name,
            created_at: new Date(),
            action: 'Restore, Delete',
            stateful: 'false'
          };

          // console.log(new Date());
          this.items.push(obj);
          // this.$store.dispatch('createSnapshot', { id: this.id, name: item.name });
          this.$store.dispatch('createSnapshot', { id: this.id, data: obj });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.snapshot_created')}`, color: '' });
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
        this.$store.dispatch('fetchSnapshots', this.id);
        setTimeout(() => {
          this.initialize();
        }, 1500);
      }
    },
    mounted() {
      this.$store.dispatch('fetchSnapshots', this.id);
      setTimeout(() => {
        this.initialize();
      }, 1500);
    }
  };
</script>
