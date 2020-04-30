<template>
  <v-layout row justify-center>
    <v-dialog v-model="active" max-width="800px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ $t('containers.order.new') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field :label="$t('containers.order.container_name.label')" v-model="name" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items=templates
                  v-model="os"
                  :label="$t('containers.order.os.label')"
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
                <v-slider min="512" max="8192" step="512" v-model="memory" :label="$t('containers.order.memory.label')"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-model="memory" type="MB" suffix="MB"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider v-if="diskEnabled" min="10" max="500" step="5" v-model="disk" :label="$t('containers.order.disk.label')"></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-if="diskEnabled" v-model="disk" type="Disk" suffix="GB"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-radio-group v-model="ispconfig" v-if="showIspconfig">
                  <v-radio value="yes" label="Install ISPconfig">
                  </v-radio>
                  <v-radio value="no" label="Do not Install ISPconfig">
                  </v-radio>
                </v-radio-group>
              </v-flex>
              <template v-if="showPrice">
                <v-flex xs3>
                  <v-subheader>{{ $t('containers.order.payment_period.label') }}</v-subheader>
                </v-flex>
                <v-flex xs3>
                  <v-select
                    :items=periodes
                    v-model="period"
                  ></v-select>
                </v-flex>
                <v-flex xs4>
                  <v-subheader>{{ $t('containers.order.calculated_price.label') }}</v-subheader>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
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
          <v-btn color="blue darken-1" text @click.native="active = false">{{ $t('actions.close') }}</v-btn>
          <v-btn color="green darken-1" text @click="save">{{ $t('actions.create') }}</v-btn>
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
        hasCreated: false,
        // showPrice: true,
        showIspconfig: false,
        ispconfig: 'no',
        period: 1,
        name: '',
        os: 'ubuntu',
        cpu: '1',
        memory: '512',
        disk: '10',
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
          return this.$store.state.containers.dialogs.create;
        },
        set(value) {
          if (!value) {
            this.closeDialog();
          }
        }
      },
      showPrice() {
        // console.log(this.$store.getters.appconfig);
        return this.$store.getters.appconfig.price.enabled === 'True';
      },
      templates() {
        const images = this.$store.getters.imagesTableData;
        const img = images.map(image => ({
          text: image.alias_description ? image.alias_description : image.name,
          value: image.name }));
        return img;
      },
      getPrice() {
        return this.$store.getters.appconfig.price;
      },
      getStorage() {
        return this.$store.getters.appconfig.storage;
      },
      diskEnabled() {
        if (this.getStorage) {
          return this.$store.getters.appconfig.storage.enabled === 'True';
        }
        return false;
      },
      me() {
        return this.$store.getters['auth/me'];
      },
      canCreate() {
        return this.me.abilities.includes('instances_create');
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
      closeDialog() {
        this.step = 0;
        this.$store.dispatch('closeContainerCreateDialog');
      },
      save() {
        if (this.name) {
          // console.log(this.memory);
          if (!this.canCreate) {
            // console.log('send request');
            this.sendRequest();
          } else {
            const data = {
              name: this.name,
              os: this.os,
              cpu: this.cpu,
              memory: `${this.memory}MB`,
              disk: `${this.disk}GB`,
              pool_name: this.getStorage.enabled === 'True' ? this.getStorage.pool_name : '',
              price: this.price ? this.price : ''
            };
            this.$store.dispatch('createContainer', data);
            // eslint-disable-next-line max-len
            // this.$store.dispatch('notify', { id: 0, message: 'Your container is launching', color: '' });
            setTimeout(() => {
              this.$store.dispatch('fetchContainers');
            }, 500);
            console.log('create container');
          }
        }
        this.active = false;
      },
      sendRequest() {
        if (this.name !== '') {
          const data = {
            name: this.name,
            os: this.os,
            cpu: this.cpu,
            memory: `${this.memory}MB`,
            disk: `${this.disk}GB`,
            ispconfig: this.ispconfig,
            period: this.period,
            price: this.price
          };
          // console.log(data);
          this.$store.dispatch('createRequests', { action: 'create', message: `Create new container ${this.name}`, status: 'waiting', meta_data: data });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.request_created')}`, color: '' });
          this.active = false;
        }
      }
    },
    created() {
      this.$store.dispatch('fetchImages');
      // console.log('fetchedImages');
    }
  };
</script>
