<template>
  <v-container grid-list-md>
  <v-card>
    <v-card-title>
      <v-dialog v-model="dialogDelete" max-width="490">
        <v-card>
          <v-card-title class="headline">Are you sure to delete user {{ editedItem.username }}?</v-card-title>
          <v-card-text>This action cannot by undo.</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="green darken-1" flat @click="dialogDelete = false">Disagree</v-btn>
            <v-btn color="red darken-1" flat @click.native="deleteItem" @click="dialogDelete = false">Agree</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialog" max-width="700px">
      <v-btn color="primary" dark slot="activator" class="mb-1">New container</v-btn>
      <v-card>
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field label="VPS name" v-model="editedItem.name" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items=templates
                  v-model="editedItem.os"
                  label="OS"
                ></v-select>
              </v-flex>
              <v-flex xs3 sm3>
                  <v-btn block large value="vps1" @click="setVPS(1)">
                    VPS1
                  </v-btn>
              </v-flex>
              <v-flex xs3 sm3>
                  <v-btn block large value="vps1" @click="setVPS(2)">
                    VPS2
                  </v-btn>
              </v-flex>
              <v-flex xs3 sm3>
                  <v-btn block large value="vps1" @click="setVPS(3)">
                    VPS3
                  </v-btn>
              </v-flex>
              <v-flex xs3 sm3>
                  <v-btn block large value="vps1" @click="setVPS(4)">
                    VPS4
                  </v-btn>
              </v-flex>
              <v-flex xs10>
                <v-slider min="1" max="4" step="1" v-model="editedItem.cpu" label="CPUs"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="editedItem.cpu" type="CPUs" suffix="CPUs"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider min="512" max="8172" step="512" v-model="editedItem.memory" label="RAM"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="editedItem.memory" type="MB" suffix="MB"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider min="10" max="160" step="10" v-model="editedItem.disk" label="Disk"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="editedItem.disk" type="Disk" suffix="GB"></v-text-field>
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
        <td class="pa-1"><v-btn color="primary" small left :to="'/machine/'+props.item.id">Manage</v-btn></td>
        <td class="pa-1"><v-icon :color="colorstate(props.item.status)">{{ iconstate(props.item.status) }}</v-icon></td>
        <td class="pa-1">{{ props.item.name }}</td>
        <td class="pa-1" align="center">{{ props.item.config.limits_cpu }}</td>
        <td class="pa-1" align="center">{{ props.item.config.limits_memory }}</td>
        <td class="pa-1" align="center">{{ props.item.config.limits_disk ? props.item.config.limits_disk : '-'}}</td>
        <td class="pa-1">{{ props.item.ips[0] ? props.item.ips[0].address : '-' }}</td>
        <td class="pa-1">{{ props.item.ips[1] ? props.item.ips[1].address : '-' }}</td>
      </template>
    </v-data-table>
  </v-card>
  </v-container>
</template>

<script>
  export default {
    name: 'Servers',
    data() {
      return {
        search: '',
        pagination: {
          sortBy: 'name',
          rowsPerPage: 10
        },
        dialog: false,
        dialogDelete: false,
        headers: [
          {
            text: 'Action',
            align: 'left',
            value: 'state',
            class: 'pl-4',
            sortable: false
          },
          {
            text: this.$t('stats.state'),
            align: 'left',
            value: 'state',
            class: 'pl-0',
            sortable: false
          },
          {
            text: this.$t('stats.name'),
            align: 'left',
            value: 'name',
            class: 'pa-1'
          },
          {
            text: `${this.$tc('stats.cpu', 1)}·s`,
            align: 'left',
            value: 'cpus.formatted',
            sortable: false,
            class: 'pa-1'
          },
          {
            text: this.$t('stats.memory_limit'),
            align: 'left',
            value: 'memory.limit.raw',
            class: 'pa-1'
          },
          {
            text: 'Disk Limit',
            align: 'left',
            value: 'disk.limit.raw',
            class: 'pa-1'
          },
          {
            text: 'IPv4',
            align: 'left',
            value: 'ips',
            sortable: false,
            class: 'pa-1'
          },
          {
            text: 'IPv6',
            align: 'left',
            value: 'ips',
            sortable: false,
            class: 'pa-1'
          }
        ],
        editedIndex: -1,
        editedItem: {
          name: '',
          os: '',
          cpu: '',
          memory: '',
          disk: ''
        },
        defaultItem: {
          name: '',
          os: 'ubuntu-16.04',
          cpu: '1',
          memory: '512',
          disk: '10'
        },
        hasCreated: false,
        name: '',
        os: 'ubuntu-16.04',
        cpu: '1',
        memory: '512',
        disk: '10',
        templates: [
          { text: 'Ubuntu 16.04', value: 'ubuntu/16.04' },
          { text: 'Debian 9', value: 'debian/9' },
          { text: 'CentOS 7', value: 'centos/7' },
          { text: 'Fedora 29', value: 'fedora/29' },
          { text: 'Alpine 3.9', value: 'alpine/3.9' }
        ]
      };
    },
    computed: {
      active: {
        get() {
          return this.$store.state.containers.dialogs.create;
        },
        set(value) {
          if (!value) {
            this.closeDialog();
          }
        }
      },
      items() {
        // console.log(this.me);
        return this.$store.getters.containersTableData;
      },
      me() {
        return this.$store.getters['auth/me'];
      },
      canCreate() {
        return this.me.abilities.includes('ct_create');
      }
    },
    watch: {
      dialog(val) {
        return val || this.close();
      }
    },
    methods: {
      iconstate(state) {
        switch (state) {
          case 'RUNNING':
            return 'play_arrow';
          case 'STOPPED':
            // code block
            return 'stop';
          default:
            // code block
            return 'pause';
        }
      },
      colorstate(state) {
        switch (state) {
          case 'RUNNING':
            return 'green';
          case 'STOPPED':
            // code block
            return 'red';
          default:
            // code block
            return 'blue';
        }
      },
      setVPS(id) {
        switch (id) {
          case 1:
            this.editedItem.cpu = 1;
            this.editedItem.memory = 512;
            this.editedItem.disk = 10;
            break;
          case 2:
            this.editedItem.cpu = 1;
            this.editedItem.memory = 1024;
            this.editedItem.disk = 30;
            break;
          case 3:
            this.editedItem.cpu = 2;
            this.editedItem.memory = 2048;
            this.editedItem.disk = 50;
            break;
          case 4:
            this.editedItem.cpu = 4;
            this.editedItem.memory = 8172;
            this.editedItem.disk = 160;
            break;
          default:
            this.editedItem.cpu = 1;
            this.editedItem.memory = 512;
            this.editedItem.disk = 10;
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
        if (this.editedItem.name) {
          console.log(this.editedItem.memory);
          this.close();
          if (!this.canCreate) {
            console.log('send request');
            this.sendRequest();
          } else {
            this.$store.dispatch('createContainer', this.editedItem);
            setTimeout(() => {
              this.$store.dispatch('fetchContainers');
            }, 500);
            console.log('create container');
          }
        }
      },
      sendRequest() {
        console.log(this.me.name);
        console.log(this.name);
        console.log(this.cpu);
        console.log(this.memory);
        console.log(this.disk);

        if (this.name !== '') {
          const data = {
            subject: 'Order of new container',
            message: `New request for creating container:
          from: ${this.me.name}
          With requests:
          Name: ${this.name},
          OS: ${this.os},
          CPU: ${this.cpu},
          RAM: ${this.memory}MB,
          DISK: ${this.disk}GB`,
            copy: false
          };
          this.$store.dispatch('sendRequest', data);
          this.$store.dispatch('notify', { id: 0, message: 'Your order was created', color: '' });
          this.active = false;
        }
      }
    },
    mounted() {
      this.$store.dispatch('fetchContainers');
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  };
</script>
