<template>
  <v-container grid-list-md>
    <order-create></order-create>
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
      <v-btn color="primary" dark @click="$store.dispatch('openInstanceCreateDialog')" class="mb-1">{{ $t('instances.actions.new') }}</v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="mdi-magnify"
        :label="$t('actions.search')"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      v-if="items"
      :headers="computedHeaders"
      :items="items"
      :search="search">
      <template v-slot:item.config.limits_memory="{ item }">
        <span v-if="item.config.limits_memory">{{ getMemoryConfig(item)[0] }} {{ getMemoryConfig(item)[1] }}</span>
      </template>
      <template v-slot:item.config.limits_disk="{ item }">
        <span v-if="item.config.limits_disk">{{ getStorageConfig(item) }} {{ getStorage.limits_unit_show }}</span>
      </template>
      <template v-slot:item.ips[0].address="{ item }">
        <span v-if="item.ips[0]">{{ filterIpv6(item.ips[0]) }}</span>
      </template>
      <template v-slot:item.ips[1].address="{ item }">
        <span v-if="item.ips[1]">{{ filterIpv6(item.ips[1]) }}</span>
      </template>
      <template v-slot:item.action="{ item }">
        <v-btn color="primary" small left :to="'/instance/'+item.id">{{ $t('instances.actions.manage') }}</v-btn>
      </template>
      <template v-slot:item.status="{ item }">
        <v-icon :color="colorstate(item.status)">{{ iconstate(item.status) }}</v-icon>
      </template>
    </v-data-table>
  </v-card>
  </v-container>
</template>

<script>
  import OrderCreate from '../../components/Order/OrderCreate';
  import { hBinaryPrefix } from '../../libraries/utils/helpers';

  export default {
    name: 'Instances',
    components: {
      'order-create': OrderCreate
    },
    data() {
      return {
        search: '',
        pagination: {
          sortBy: 'name',
          rowsPerPage: 15
        },
        dialog: false,
        dialogDelete: false,
        headers: [
          {
            text: this.$t('actions.name'),
            align: 'left',
            value: 'action',
            class: 'pl-4',
            sortable: false
          },
          {
            text: this.$t('stats.status'),
            align: 'left',
            value: 'status',
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
            value: 'config.limits_cpu',
            sortable: false,
            class: 'pa-1'
          },
          {
            text: this.$t('stats.memory_limit'),
            align: 'left',
            value: 'config.limits_memory',
            class: 'pa-1'
          },
          {
            text: this.$t('stats.disk_limit'),
            align: 'left',
            value: 'config.limits_disk',
            disk: false,
            class: 'pa-1'
          },
          {
            text: 'IPv4',
            align: 'left',
            value: 'ips[0].address',
            sortable: false,
            class: 'pa-1'
          },
          {
            text: 'IPv6',
            align: 'left',
            value: 'ips[1].address',
            sortable: false,
            class: 'pa-1'
          },
          {
            text: this.$t('stats.price'),
            align: 'left',
            value: 'config.user_price',
            sortable: true,
            price: false,
            class: 'pa-1'
          },
          {
            text: this.$t('stats.type'),
            align: 'left',
            value: 'type',
            sortable: true,
            type: false,
            class: 'pa-1'
          },
          {
            text: 'Server',
            align: 'left',
            value: 'servers[0].name',
            sortable: true,
            servers: false,
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
          return this.$store.state.instances.dialogs.create;
        },
        set(value) {
          if (!value) {
            this.closeDialog();
          }
        }
      },
      items() {
        // console.log(this.$store.getters.instancesTableData);
        // console.log(this.$store.getters['auth/me']);
        return this.$store.getters.instancesTableData;
      },
      me() {
        return this.$store.getters['auth/me'];
      },
      canCreate() {
        return this.me.abilities.includes('instances_create');
      },
      computedHeaders() {
        return this.headers.filter(h =>
          !(h.disk === this.showDisk) &&
          !(h.price === this.showPrice) &&
          !(h.type === this.showType) &&
          !(h.servers === this.me.admin));
      },
      getMemory() {
        return this.$store.getters.appconfig.memory;
      },
      getStorage() {
        return this.$store.getters.appconfig.storage;
      },
      showPrice() {
        return this.$store.getters.appconfig.price.enabled === 'True';
      },
      showDisk() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      },
      showType() {
        // return this.$store.getters.appconfig.type.enabled === 'True';
        return false;
      }
    },
    watch: {
      dialog(val) {
        return val || this.close();
      }
    },
    methods: {
      getMemoryConfig(item) {
        return item.config.limits_memory_raw && hBinaryPrefix(
          item.config.limits_memory_raw,
          this.getMemory.limits_unit,
          this.getMemory.limits_unit_show
        );
      },
      getStorageConfig(item) {
        if (this.getStorage.limits_unit === 'GiB') {
          return item.config.limits_disk_gib;
        }
        return item.config.limits_disk_gb;
      },
      filterIpv6(ip) {
        if (ip.scope === 'link') {
          return '-';
        }
        return ip.address;
      },
      iconstate(state) {
        switch (state) {
          case 'RUNNING':
            return 'mdi-play';
          case 'STOPPED':
            // code block
            return 'mdi-stop';
          default:
            // code block
            return 'mdi-pause';
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
      close() {
        this.dialog = false;
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        }, 300);
      },
      refreshData() {
        this.$store.dispatch('fetchInstances');
      }
    },
    mounted() {
      this.$store.dispatch('fetchInstances');
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      }, 300);
    }
  };
</script>

