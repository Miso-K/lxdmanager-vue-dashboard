<template>
    <v-container grid-list-md>
      <!--<loader v-if="loading"></loader>-->
      <v-data-iterator :items="containers" :rows-per-page-items="rowsPerPageItems" :hide-actions="total < 8" :pagination.sync="pagination" content-tag="v-layout" row wrap>
        <v-flex slot="item" slot-scope="props" xs12 sm6 md4 lg3>
          <v-card
            class="hide-overflow"
          >
          <v-toolbar
            card
            height="50px"
          >
              <v-icon style="margin-left: -20px;" class="mr-2" :color="colorstate(props.item.status)">{{ iconstate(props.item.status) }}</v-icon>
              <span class="title font-weight-light">{{ props.item.name }}</span>
              <v-spacer></v-spacer>
              <v-btn color="primary" small left :to="'/machine/'+props.item.id">{{ $t('containers.actions.manage') }}</v-btn>

          </v-toolbar>
            <v-divider></v-divider>
            <v-list dense>
              <v-list-tile>
                <v-list-tile-content>{{ $t('containers.config.memory') }}:</v-list-tile-content>
                <!--<v-list-tile-content class="align-end pa-1">
                  {{ usage(props.item.config.limits_memory_raw, props.item.state.memory ? props.item.state.memory.usage : '') }}
                </v-list-tile-content>-->
                <v-list-tile-content class="align-end ma-1">
                <v-progress-circular
                    :rotate="270"
                    :width="5"
                    :size="35"
                    color="blue"
                    :value="percentage(props.item.config.limits_disk_raw, 20)"
                  >
                  {{ percentage(props.item.config.limits_memory_raw, props.item.state.memory ? props.item.state.memory.usage : '') }}%
                </v-progress-circular>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile v-if="showDisk">
                <v-list-tile-content>{{ $t('containers.config.disk') }}:</v-list-tile-content>
                <!--<v-list-tile-content class="align-end pa-1">
                  {{ usage(40000, 20000) }}
                </v-list-tile-content>-->
                <v-list-tile-content class="align-end pa-1">
                  <v-progress-circular
                    :rotate="270"
                    :width="5"
                    :size="35"
                    color="orange"
                    :value="percentage(props.item.config.limits_disk_raw, 20)"
                  >
                    {{ percentage(props.item.config.limits_disk_raw, props.item.state.disk ? props.item.state.disk.usage : '') }}%
                  </v-progress-circular>
                </v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>IPv4:</v-list-tile-content>
                <v-list-tile-content class="align-end"><v-chip label >{{ props.item.ips ? (props.item.ips[1] ? props.item.ips[0].address : '-') : '-' }}</v-chip></v-list-tile-content>
              </v-list-tile>
              <v-list-tile>
                <v-list-tile-content>IPv6:</v-list-tile-content>
                <v-list-tile-content class="align-end">
                  <v-menu offset-y left>
                  <v-btn slot="activator" icon>
                    <v-icon large color="grey">expand_more</v-icon>
                  </v-btn>
                  <v-list>
                    <v-list-tile>
                      <v-list-tile-content>{{ props.item.ips ? (props.item.ips[1] ? props.item.ips[1].address : '-') : '-'}}</v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-menu>
                </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card>
        </v-flex>
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
    mounted() {
      this.$store.dispatch('fetchContainers');
      // console.log('loading-new');
      // console.log(this.containers);
      // console.log(this.loading);
      // console.log(this.total);
    }
  };
</script>
