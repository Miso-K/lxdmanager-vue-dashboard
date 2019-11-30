<template>
  <v-layout row justify-center>
    <v-dialog v-model="active" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('containers.order.upgrade') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select
                  v-model="selectedContainer"
                  :items=containersId
                  :label="$t('containers.order.select_container.label')"
                  @change="getContainerConfig"
                  required
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
                <v-slider min="1" max="4" step="1" v-model="cpu" :label="$t('containers.order.cpu.label')"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="cpu" type="CPUs" suffix="CPUs"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider min="512" max="8172" step="512" v-model="memory" :label="$t('containers.order.memory.label')"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="memory" type="MB" suffix="MB"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider v-if="diskEnabled" min="10" max="160" step="10" v-model="disk" :label="$t('containers.order.disk.label')"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-if="diskEnabled" v-model="disk" type="Disk" suffix="GB"></v-text-field>
              </v-flex>
              <template v-if="showPrice">
                <v-flex xs3>
                  <v-subheader>{{ $t('containers.order.payment_period.label') }}</v-subheader>
                </v-flex>
                <v-flex xs3>
                  <v-select
                    :items=periodes
                    v-model="period"
                    label="Period"
                  ></v-select>
                </v-flex>
                <v-flex xs4>
                  <v-subheader>{{ $t('containers.order.calculated_price.label') }}</v-subheader>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    label="Price"
                    :value="price"
                    suffix="€"
                  ></v-text-field>
                </v-flex>
              </template>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="active = false">{{ $t('actions.close') }}</v-btn>
          <v-btn color="green darken-1" flat @click="sendRequest">{{ $t('actions.create') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>

  export default {
    components: {
    },
    data() {
      return {
        notifications: false,
        period: 1,
        name: '',
        cpu: '1',
        memory: '512',
        disk: '10',
        selectedContainer: '',
        periodes: [
          { text: '1 Month', value: 1 },
          { text: '3 Months', value: 1 },
          { text: '6 Months', value: 0.95 },
          { text: '12 Months', value: 0.90 },
          { text: '24 Months', value: 0.80 }
        ]
      };
    },
    computed: {
      active: {
        get() {
          return this.$store.state.containers.dialogs.upgrade !== null;
        },
        set(value) {
          if (!value) {
            this.closeDialog();
          }
        }
      },
      showPrice() {
        return this.$store.getters.appconfig.price.enabled === 'True';
      },
      getPrice() {
        return this.$store.getters.appconfig.price;
      },
      diskEnabled() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      },
      id() {
        return this.$store.state.containers.dialogs.upgrade;
      },
      containersId() {
        const containers = this.$store.getters.containersTableData;
      // console.log(containers.map(container => container.id));
        if (containers) {
          return containers.map(container => ({
            text: container.name,
            value: container.id
          }));
        }
        return '';
      },
      containerName() {
        return this.$store.getters.containerData(this.selectedContainer).name;
      },
      isValid() {
        return !!this.form.name.invalid;
      },
      price() {
        const cpu = this.getPrice.cpu * this.cpu; // 1
        const memory = this.getPrice.memory * this.memory; // 0.048
        const disk = this.getPrice.disk * this.disk; // 0.150
        const period = this.period;
        const cmemory = (cpu + memory + disk) * period;
        return cmemory.toFixed(2);
      }
    },
    methods: {
      setVPS(id) {
        switch (id) {
          case 1:
            this.cpu = 1;
            this.memory = 512;
            this.disk = 10;
            break;
          case 2:
            this.cpu = 1;
            this.memory = 1024;
            this.disk = 30;
            break;
          case 3:
            this.cpu = 2;
            this.memory = 2048;
            this.disk = 50;
            break;
          case 4:
            this.cpu = 4;
            this.memory = 8172;
            this.disk = 160;
            break;
          default:
            this.cpu = 1;
            this.memory = 512;
            this.disk = 10;
        }
      },
      getContainersName(containers) {
        function findName(array, id) {
          return array.find(item => item.value === id).text;
        }
        const inventory = this.containersId;
        return containers.map(x => findName(inventory, x));
      },
      getContainerConfig() {
        console.log(this.selectedContainer);
        this.name = this.containerName;
        const config = this.$store.getters.containerData(this.selectedContainer).config;
        // console.log(config);
        this.cpu = config.limits_cpu > 1 ? config.limits_cpu : 1;
        this.memory = config.limits_memory_mb > 512 ? config.limits_memory_mb : 512;
        this.disk = config.limits_disk_mb > 10 ? config.limits_disk_mb : 10;
      },
      closeDialog() {
        this.name = {};
        this.$store.dispatch('closeContainerUpgradeDialog');
      },
      sendRequest() {
        console.log(this.name);
        console.log(this.cpu);
        console.log(this.memory);
        console.log(this.disk);

        if (this.name !== '') {
          const data = {
            id: this.selectedContainer,
            os: this.os,
            cpu: this.cpu,
            memory: `${this.memory}MB`,
            disk: `${this.disk}GB`,
            period: this.period,
            price: this.price
          };
          console.log(data);
          this.$store.dispatch('createRequests', { action: 'upgrade', message: `Upgrade container ${this.name}`, status: 'waiting', meta_data: data });
          this.$store.dispatch('notify', { id: 0, message: 'Your request was created', color: '' });
          this.active = false;
        }
      }
    }
  };
</script>
