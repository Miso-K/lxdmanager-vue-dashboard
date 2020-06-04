<template>
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
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>CPU</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <v-progress-circular
                  :size="100"
                  :width="15"
                  color="green"
                  :indeterminate="running"
                >{{ cpuUsage }}</v-progress-circular>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>CPU time</v-list-item-title>
              <v-list-item-subtitle>{{ cpuUsage }} seconds</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>CPU limit</v-list-item-title>
                <v-list-item-subtitle v-if="config.limits_cpu">{{ config.limits_cpu }}</v-list-item-subtitle>
                <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>RAM</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <v-progress-circular
                  :rotate="360"
                  :size="100"
                  :width="15"
                  :value="ramUsagePercent"
                  color="blue"
                >
                  {{ ramUsagePercent }}
                </v-progress-circular>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>RAM usage (current | peak)</v-list-item-title>
              <v-list-item-subtitle>{{ramUsage[0]}} MB | {{ramUsage[1]}} MB</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>RAM limits</v-list-item-title>
              <v-list-item-subtitle v-if="config.limits_memory">{{ config.limits_memory }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>DISK</v-subheader>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title>
                <v-progress-circular
                  :rotate="-90"
                  :size="100"
                  :width="15"
                  :value="diskUsagePercent"
                  color="orange"
                >
                  {{ diskUsagePercent }}
                </v-progress-circular>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>DISK usage</v-list-item-title>
              <v-list-item-subtitle>{{ diskUsage }} GB</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>DISK limit</v-list-item-title>
              <v-list-item-subtitle v-if="config.limits_disk !== null">{{ config.limits_disk }}</v-list-item-subtitle>
              <v-list-item-subtitle v-else>No limit set</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
      <v-flex xl3 lg3 md3 sm6 xs12>
        <v-list two-line subheader>
          <v-subheader>Network Eth0</v-subheader>
          <v-progress-linear
            class="ml-3"
            style="width: 200px;"
            color="purple lighten-1"
            buffer-value="0"
            :stream="running"
          ></v-progress-linear>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Bytes received</v-list-item-title>
              <v-list-item-subtitle>{{networkCounters[0]}} MB</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Bytes send</v-list-item-title>
              <v-list-item-subtitle>{{networkCounters[1]}} MB</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Packets received</v-list-item-title>
              <v-list-item-subtitle>{{networkCounters[2]}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Packets send</v-list-item-title>
              <v-list-item-subtitle>{{networkCounters[3]}}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-flex>
    </v-layout>
   </v-container>
</template>

<script>
  import { mapActions } from 'vuex';
  // import Loader from '../../components/Loader';

  export default {
    name: 'tab-info',
    props: ['id'],
    data() {
      return {
        interval: {},
        value: 0
      };
    },
    computed: {
      active: {
        get() {
          return this.$store.state.instances.dialogs.info !== null;
          // return this.value;
        },
        set(value) {
          if (!value) {
            this.$store.dispatch('closeInstanceInfoDialog');
          }
          // this.$emit('input', value);
        }
      },
      availableButtons() {
        this.buttons.filter(button => this.disableButton(button));
        return this.buttons;
      },
      id() {
        // return Number(this.$route.params.id);
        // console.log(this.$props);
        return Number(this.$props.id);
      },
      instance() {
        if (this.id) {
          console.log(this.$store.getters.instanceDataId(this.id));
          // console.log(this.id);
          return this.$store.getters.instanceDataId(this.id);
        }
        return null;
      },
      cpuUsage() {
        return Math.floor(this.instance.state.cpu.usage / (1000 ** 3));
      },
      ramUsage() {
        const memory = this.instance.state.memory;
        return [Math.floor(memory.usage / (1000 ** 2)), Math.floor(memory.usage_peak / (1000 ** 2))];
      },
      ramUsagePercent() {
        const percent = Math.floor(
          (this.instance.state.memory.usage * 100) / this.config.limits_memory_raw);
        console.log(percent);
        return isNaN(percent) || !isFinite(percent) ? 0 : percent;
      },
      diskUsage() {
        return Math.floor(this.instance.state.disk.root.usage / (1000 ** 3));
      },
      diskUsagePercent() {
        const percent = Math.floor(this.instance.state.disk.root.usage / this.config.limits_disk_raw);
        console.log(isFinite(percent));
        return isNaN(percent) || !isFinite(percent) ? 0 : percent;
      },
      networkCounters() {
        if (this.instance.state.network) {
          const counters = this.instance.state.network.eth0.counters;
          return [this.toMb(counters.bytes_received),
            this.toMb(counters.bytes_sent),
            counters.packets_received,
            counters.packets_sent];
        }
        return [0, 0, 0, 0];
      },
      config() {
        // console.log(this.instance.config);
        return this.instance.config ? this.instance.config : '';
      },
      ips() {
        // console.log(this.instance);
        return this.instance.ips ? this.instance.ips : '';
      },
      status() {
        return this.instance.status;
      },
      running() {
        console.log(this.instance.status);
        return this.instance.status === 'RUNNING';
      },
      loading() {
        return this.$store.getters.instanceIsLoading(this.id);
      },
      showPrice() {
        return this.$store.getters.appconfig.price.enabled === 'True';
      },
      showDisk() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      }
    },
    methods: {
      ...mapActions([
        'startInstance',
        'stopInstance',
        'freezeInstance',
        'stopforceInstance',
        'restartInstance',
        'unfreezeInstance',
        'fetchInstance'
      ]),
      toMb(value) {
        return (value / (1000 ** 2)).toFixed(2);
      },
      filterIpv6(ip) {
        if (ip.scope === 'link') {
          return '';
        }
        return ip.address;
      },
      disableButton(button) {
        // console.log(this.buttons.indexOf(button));
        const x = this.buttons.indexOf(button);
        if (button.showWhen.includes(this.status)) {
          // console.log(x);
          // console.log(this.buttons[0]);
          // console.log(this.buttons[x]);
          this.buttons[x].disable = false;
        } else {
          this.buttons[x].disable = true;
        }
        return button;
      },
      refreshData() {
        // this.$store.dispatch('fetchInstances');
        // this.fetchInstances();
        // console.log(this.id);
        this.$store.dispatch('fetchInstance', this.id);
        // console.log(this.$store.getters.instancesTableData);
      },
      formatDate(date) {
        const d = new Date(date);
        return d.toDateString();
      }
    }
  };
</script>
