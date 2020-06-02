<template>
    <v-container grid-list-md>
      <!--<loader v-if="loading"></loader>-->
      <v-data-iterator
        v-if="instances"
        :items="instances"
        :footer-props.items-per-page-options="rowsPerPageItems"
        :hide-default-footer="total < 8"
      >
        <template v-slot:default="props">
        <v-row>
          <v-col
            v-for="item in props.items"
            :key="item"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >



          <v-card
            class="mx-auto"
            color="#26c6da"
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
              <span class="subheading mr-2">{{item.limits_cpu}}</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1" large>mdi-memory</v-icon>
              <span class="subheading mr-2">{{item.config.limits_memory}}</span>
              <span class="mr-1">·</span>
              <v-icon class="mr-1" large>mdi-harddisk</v-icon>
              <span class="subheading">{{item.config.limits_disk}}</span>
              <span class="mr-1" large>·</span>
              <v-icon class="mr-1">mdi-currency-eur</v-icon>
              <span class="subheading">{{item.price}}</span>
            </v-row>
          </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-server-network</v-icon>v4
              </v-list-item-icon>
              <v-list-item-subtitle class="text-right">{{ item.ips ? (item.ips[1] ? item.ips[0].address : '-') : '-' }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-server-network</v-icon>v6
              </v-list-item-icon>
              <v-list-item-subtitle class="text-right">{{ item.ips ? (item.ips[1] ? item.ips[1].address : '-') : '-'}}</v-list-item-subtitle>
            </v-list-item>
            <v-divider></v-divider>
            <v-card-actions>
              <v-btn class="ma-2" color="primary" left :to="'/instance/'+item.id">Manage
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
  import Loader from '../Loader';
  import { humanFileSize } from '../../libraries/utils/helpers';

  export default {
    data() {
      return {
        name: {
          value: '',
          error: false
        },
        rowsPerPageItems: [4, 8, 12],
        itemsPerPage: 1,
        pagination: {
          rowsPerPage: 8
        }
      };
    },
    components: {
      loader: Loader
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
      }
    },
    created() {
      this.$store.dispatch('fetchInstances');
    }
  };
</script>
