<template>
    <v-container grid-list-md>
      <!--<loader v-if="loading"></loader>-->
      <v-data-iterator
        v-if="instances"
        :items="instances"
        :items-per-page.sync="itemsPerPage"
        :hide-default-footer="total < 8"
      >
        <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >



          <v-card
            class="mx-auto"
            color="cyan lighten-1"
            dark
            max-width="400"
          >
            <v-card-title>
              <span class="title">{{ item.name }}</span>
              <v-spacer></v-spacer>
              <v-icon large style="margin-left: -20px;" class="ml-0 mr-1" :color="colorstate(item.status)">{{ iconstate(item.status) }}</v-icon>
            </v-card-title>

            <v-divider></v-divider>

            <v-list-item class="grow">
            <v-row
              align="center"
              justify="space-around"
            >
              <v-icon class="mr-1" large>mdi-cpu-64-bit</v-icon>
              <span class="subheading mr-2">{{item.config.limits_cpu}}</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1" large>mdi-memory</v-icon>
              <span class="subheading mr-2">{{getMemoryConfig(item)}}{{getMemory.limits_unit_show}}</span>
              <div v-if="showDisk">
                <span class="mr-1">·</span>
                <v-icon class="mr-1" large>mdi-harddisk</v-icon>
                <span class="subheading">{{getStorageConfig(item)}}{{getStorage.limits_unit_show}}</span>
              </div>
              <div v-if="showPrice">
                <span class="mr-1" large>·</span>
                <v-icon class="mr-1">mdi-currency-eur</v-icon>
                <span class="subheading">{{item.config.user_price}}</span>
              </div>
            </v-row>
          </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-server-network</v-icon>v4
              </v-list-item-icon>
              <v-list-item-subtitle class="text-right">{{ item.ips ? filterIpv6(item.ips[0]) : '-' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-server-network</v-icon>v6
              </v-list-item-icon>
              <v-list-item-subtitle class="text-right">{{ item.ips ? filterIpv6(item.ips[1]) : '-'}}</v-list-item-subtitle>
            </v-list-item>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn class="ma-2" color="primary" left :to="'/instance/'+item.id">{{ $t('instances.actions.manage') }}
              <v-icon dark right>mdi-wrench</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>


        </v-col>
        </v-row>
        </template>
        <template v-slot:no-data>
          NO DATA HERE!
        </template>
      </v-data-iterator>
    </v-container>
</template>

<script>
  import { humanFileSize } from '../../libraries/utils/helpers';

  export default {
    data() {
      return {
        name: {
          value: '',
          error: false
        },
        rowsPerPageItems: [4, 8, 12],
        itemsPerPage: 8,
        pagination: {
          rowsPerPage: 8
        }
      };
    },
    components: {
    },
    computed: {
      total() {
        // console.log(this.$store.getters);
        return this.$store.getters.instancesTotal;
      },
      loading() {
        return this.$store.state.instances.loading;
      },
      instances() {
        // console.log(this.$store.getters.instancesTableData);
        return this.$store.getters.instancesTableData;
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
      }
    },
    methods: {
      percentage(limitRaw, usage) {
        if (limitRaw < 1) return 0;
        return Math.round((usage / limitRaw) * 100);
      },
      usage(limitRaw, currentUsage) {
        if (limitRaw < 1) return 0;
        return `${humanFileSize(currentUsage)} / ${humanFileSize(limitRaw)}`;
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
      getMemoryConfig(item) {
        if (this.getMemory.limits_unit === 'MiB') {
          return item.config.limits_memory_mib;
        }
        return item.config.limits_memory_mb;
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
      }
    },
    created() {
      this.$store.dispatch('fetchInstances');
    }
  };
</script>
