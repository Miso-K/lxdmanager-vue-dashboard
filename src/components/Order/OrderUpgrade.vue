<template>
  <v-layout row justify-center>
    <v-dialog v-model="active" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">Upgrade VPS</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-select
                  v-model="selectedContainer"
                  :items=containersId
                  label="Select VPS"
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
                <v-slider min="1" max="4" step="1" v-model="cpu" label="CPUs"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="cpu" type="CPUs" suffix="CPUs"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider min="512" max="8172" step="512" v-model="memory" label="RAM"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="memory" type="MB" suffix="MB"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider min="10" max="160" step="10" v-model="disk" label="Disk"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="disk" type="Disk" suffix="GB"></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="active = false">Close</v-btn>
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
        cpu: '1',
        memory: '512',
        disk: '10',
        selectedContainer: ''
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
        return this.$store.getters.containerData(this.selectedContainer + 1).name;
      },
      isValid() {
        return !!this.form.name.invalid;
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
        const config = this.$store.getters.containerData(this.selectedContainer + 1).config;
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
        // console.log(this.form.general.name.value);
        // console.log(this.form.general.template.value);
        // console.log(this.form.cpuMemory.cpus.value);
        if (this.selectedContainer !== '') {
          const data = {
            subject: 'Upgrade of lxd container',
            message: `New request of upgrade container: ${this.containerName}
          with ${this.cpu} CPU, ${this.memory}MB RAM and ${this.disk}GB Disk`,
            copy: false
          };
          this.$store.dispatch('sendRequest', data);
          this.$store.dispatch('notify', { id: 0, message: 'Your order was created', color: '' });
          this.active = false;
        }
      }
    }
  };
</script>
