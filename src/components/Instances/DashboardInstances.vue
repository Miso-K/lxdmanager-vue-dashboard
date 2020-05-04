<template>
    <v-container grid-list-md>
      <!--<loader v-if="loading"></loader>-->
      <v-data-iterator
        v-if="containers"
        :items="containers"
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
          <v-card>
          <v-app-bar
            flat
            height="50px"
          >
              <v-icon style="margin-left: -20px;" class="ml-0 mr-1" :color="colorstate(item.status)">{{ iconstate(item.status) }}</v-icon>
              <v-spacer></v-spacer>
              <v-btn color="primary" text left :to="'/container/'+item.id">{{ item.name }}</v-btn>

          </v-app-bar>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-item>
                <v-list-item-content>Processes:</v-list-item-content>
                <v-spacer></v-spacer>
                <v-list-item-content class="align-end">{{ item.state.processes }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>CPU usage (seconds):</v-list-item-content>
                <v-spacer></v-spacer>
                <v-list-item-content class="align-end">{{ (item.state.cpu.usage / (1000 ** 3)).toFixed(0) }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>{{ $t('containers.config.memory') }}:</v-list-item-content>
                <!--<v-list-tile-content class="align-end pa-1">
                  {{ usage(props.item.config.limits_memory_raw, props.item.state.memory ? props.item.state.memory.usage : '') }}
                </v-list-tile-content>-->
                <v-list-item-content class="align-end ma-1">
                <v-progress-circular
                    :rotate="270"
                    :width="5"
                    :size="35"
                    color="blue"
                    :value="percentage(item.config.limits_disk_raw, 20)"
                  >
                  {{ percentage(item.config.limits_memory_raw, item.state.memory ? item.state.memory.usage : '') }}%
                </v-progress-circular>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="showDisk">
                <v-list-item-content>{{ $t('containers.config.disk') }}:</v-list-item-content>
                <!--<v-list-tile-content class="align-end pa-1">
                  {{ usage(40000, 20000) }}
                </v-list-tile-content>-->
                <v-list-item-content class="align-end pa-1">
                  <v-progress-circular
                    :rotate="270"
                    :width="5"
                    :size="35"
                    color="orange"
                    :value="percentage(item.config.limits_disk_raw, 20)"
                  >
                    {{ percentage(item.config.limits_disk_raw, item.state.disk ? item.state.disk.usage : '') }}%
                  </v-progress-circular>
                </v-list-item-content>
              </v-list-item>
              <v-list-item v-if="showPrice">
                <v-list-item-content>{{ $t('containers.config.price') }}:</v-list-item-content>
                <v-list-item-content class="align-end pa-1">
                    {{ item.config.user_price ? item.config.user_price : '' }}
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>IPv4:</v-list-item-content>
                <v-list-item-content class="align-end">{{ item.ips ? (item.ips[1] ? item.ips[0].address : '-') : '-' }}</v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>IPv6:</v-list-item-content>
                <v-list-item-content class="align-end">
                  <v-menu offset-y left>
                    <template v-slot:activator="{ on }">
                      <v-btn v-on="on" icon>
                        <v-icon large color="grey">expand_more</v-icon>
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item>
                        <v-list-item-content>{{ item.ips ? (item.ips[1] ? item.ips[1].address : '-') : '-'}}</v-list-item-content>
                      </v-list-item>
                    </v-list>
                </v-menu>
                </v-list-item-content>
              </v-list-item>
            </v-list>
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
        return this.$store.getters.containersTotal;
      },
      loading() {
        return this.$store.state.containers.loading;
      },
      containers() {
        // console.log(this.$store.getters.containersTableData);
        return this.$store.getters.containersTableData;
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
      this.$store.dispatch('fetchContainers');
    }
  };
</script>
