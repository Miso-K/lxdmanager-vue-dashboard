<template>
  <v-layout row justify-center>
    <v-dialog v-model="active" max-width="800px">
      <v-card>
         <v-form ref="form" v-model="valid" lazy-validation>
        <v-card-title>
          <span class="headline">{{ $t('instances.order.new') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6>
                <v-text-field :rules="nameRules" :label="$t('instances.order.instance_name.label')" v-model="name" required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6>
                <v-select
                  :items=templates
                  v-model="os"
                  :rules="[v => !!v || 'Item is required']"
                  required
                  :label="$t('instances.order.os.label')"
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
                <v-slider :disabled="!cpuLimit" :min="getCPU.limits_min" :max="getCPU.limits_max" :step="getCPU.limits_step" v-model="cpu" :label="$t('instances.order.cpu.label')" tick-size="4" ticks></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-if="cpuLimit" v-model="cpu" type="CPUs" suffix="CPUs"></v-text-field>
                <v-text-field v-if="!cpuLimit" value="Unlimited" :disabled="!cpuLimit"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider :disabled="!memoryLimit" :min="getMemory.limits_min" :max="getMemory.limits_max" :step="getMemory.limits_step" v-model="memory" :label="$t('instances.order.memory.label')" tick-size="4" ticks></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-if="memoryLimit" v-model="memory" type="MB" :suffix="getMemory.limits_unit_show"></v-text-field>
                <v-text-field v-if="!memoryLimit" value="Unlimited" :disabled="!memoryLimit"></v-text-field>
              </v-flex>
              <v-flex xs10>
                <v-slider v-if="diskEnabled" :disabled="!diskLimit" :min="getStorage.limits_min" :max="getStorage.limits_max" :step="getStorage.limits_step" v-model="disk" :label="$t('instances.order.disk.label')" tick-size="4" ticks></v-slider>
              </v-flex>
              <v-flex xs2>
                <v-text-field v-if="diskEnabled && diskLimit" v-model="disk" type="Disk" :disabled="!diskLimit" :suffix="getStorage.limits_unit_show"></v-text-field>
                <v-text-field v-if="diskEnabled && !diskLimit" value="Unlimited" :disabled="!diskLimit"></v-text-field>
              </v-flex>
              <v-checkbox v-if="me.admin" v-model="cpuLimit" class="mx-2" label="CPU limit"></v-checkbox>
              <v-checkbox v-if="me.admin" v-model="memoryLimit" class="mx-2" label="Memory limit"></v-checkbox>
              <v-checkbox v-if="diskEnabled && me.admin" v-model="diskLimit" class="mx-2" label="Disk limit"></v-checkbox>
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
                  <v-subheader>{{ $t('instances.order.payment_period.label') }}</v-subheader>
                </v-flex>
                <v-flex xs3>
                  <v-select
                    :items=getPeriodes
                    v-model="period"
                    item-text="text"
                    item-value="value"
                    return-object
                    label="Period"
                  ></v-select>
                </v-flex>
                <v-flex xs4>
                  <v-subheader>{{ $t('instances.order.calculated_price.label') }}</v-subheader>
                </v-flex>
                <v-flex xs2>
                  <v-text-field
                    v-model="calcPrice"
                    suffix="€"
                    label="Price per month"
                    :disabled="!me.admin"
                  ></v-text-field>
                </v-flex>
              </template>
              <template v-if="me.admin">
                <v-flex xs12 sm12 md6>
                  <v-autocomplete
                    v-model="owners"
                    :disabled="!me.admin"
                    :items="usersId"
                    chips
                    color="blue-grey lighten-2"
                    label="New owners"
                    item-text="name"
                    item-value="id"
                    multiple
                  >
                  <template
                    slot="selection"
                    slot-scope="data"
                  >
                    <v-chip
                      :input-value="data.selected"
                      close
                      class="chip--select-multi"
                      @click:close="removeUsers(data.item)"
                    >
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template
                    slot="item"
                    slot-scope="data"
                  >
                  <template >
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
              </v-flex>
                <v-flex xs12 sm12 md6>
                  <v-autocomplete
                    v-model="servers"
                    :disabled="!me.admin"
                    :items="serversId"
                    :rules="serverRules"
                    chips
                    color="blue-grey lighten-2"
                    label="Destination server"
                    item-text="name"
                    item-value="id"
                  >
                  <template
                    slot="selection"
                    slot-scope="data"
                  >
                    <v-chip
                      :input-value="data.selected"
                    >
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template
                    slot="item"
                    slot-scope="data"
                  >
                  <template >
                    <v-list-item-content>
                      <v-list-item-title v-html="data.item.name"></v-list-item-title>
                    </v-list-item-content>
                  </template>
                </template>
              </v-autocomplete>
              </v-flex>
              </template>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="active = false">{{ $t('actions.close') }}</v-btn>
          <v-btn color="green darken-1" text @click="save" :disabled="!valid">{{ $t('actions.create') }}</v-btn>
        </v-card-actions>
        </v-form>
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
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length >= 3) || 'Name must be more than 3 characters'
        ],
        serverRules: [
          v => !!v || 'Server is required'
        ],
        valid: false,
        // showPrice: true,
        showIspconfig: false,
        ispconfig: 'no',
        period: { text: '1 Month', value: 1 },
        name: '',
        os: '',
        cpu: '1',
        memory: '512',
        disk: '10',
        cpuLimit: true,
        memoryLimit: true,
        diskLimit: true,
        periodes: [
          { text: '1 Month', value: 1 },
          { text: '3 Months', value: 1 },
          { text: '6 Months', value: 0.95 },
          { text: '12 Months', value: 0.90 },
          { text: '24 Months', value: 0.80 }
        ],
        owners: '',
        price: '',
        servers: ''
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
      showPrice() {
        // console.log(this.$store.getters.appconfig);
        return this.$store.getters.appconfig.price.enabled === 'True';
      },
      templates() {
        const images = this.$store.getters.imagesTableData;
        if (images) {
        const img = images.filter(
          image => image.name !== ''
        ).map(image => ({
          text: image.alias_description ? image.alias_description : image.name,
          value: image.name }));
        return img;
        }
        else {
          return '';
        }
      },
      getPrice() {
        return this.$store.getters.appconfig.price;
      },
      getCPU() {
        return this.$store.getters.appconfig.cpu;
      },
      getMemory() {
        return this.$store.getters.appconfig.memory;
      },
      getStorage() {
        // console.log(this.$store.getters.appconfig.storage);
        return this.$store.getters.appconfig.storage;
      },
      diskEnabled() {
        if (this.getStorage) {
          return this.$store.getters.appconfig.storage.enabled === 'True';
        }
        return false;
      },
      me() {
        // console.log(this.$store.getters['auth/me']);
        return this.$store.getters['auth/me'];
      },
      canCreate() {
        return this.me.abilities.includes('instances_create');
      },
      usersId() {
        const users = this.$store.getters.usersTableData;
        if (users){
          return users.map(user => ({
            name: user.name,
            id: user.id
          }));
        }
        else return null;
      },
      serversId() {
        const servers = this.$store.getters.serversTableData;
        if (servers){
          return servers.map(server => ({
            name: server.name,
            id: server.id
          }));
        }
        else return null;
      },
      getProductionName() {
        return this.$store.getters.appconfig.app.production_name;
      },
      getPeriodes() {
        const pers = this.periodes;
        const config = this.$store.getters.appconfig;
        pers[0].value = config.price.discount_month;
        pers[1].value = config.price.discount_months;
        pers[2].value = config.price.discount_halfyear;
        pers[3].value = config.price.discount_year;
        pers[4].value = config.price.discount_years;
        return pers;
      },
      calcPrice: {
        get() {
          const cpu = this.getPrice.cpu * this.cpu; // 1
          const memory = this.getPrice.memory * this.memory; // 0.048
          const disk = this.getPrice.disk * this.disk; // 0.150
          const period = this.period.value;
          const cmemory = (cpu + memory + disk) * period;
          // this.price = cmemory.toFixed(2);
          return cmemory.toFixed(2);
        },
        set(val) {
          this.price = parseFloat(val).toFixed(2);
          return parseFloat(val).toFixed(2);
        }
      }
    },
    methods: {
      removeUsers(item) {
        const index = this.owners.findIndex(x => x === item.id);
        if (index >= 0) this.owners.splice(index, 1);
      },
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
        this.$store.dispatch('closeInstanceCreateDialog');
      },
      save() {
        if (this.$refs.form.validate()) {
          if (this.name) {
            const data = {
              name: this.name,
              os: this.os,
              cpu: this.cpuLimit ? this.cpu : '',
              memory: this.memoryLimit ? `${this.memory}${this.getMemory.limits_unit}` : '',
              disk: this.diskLimit ? `${this.disk}${this.getStorage.limits_unit}` : '',
              pool_name: this.getStorage.enabled === 'True' ? this.getStorage.pool_name : '',
              period: this.showPrice ? this.period.text : '',
              price: this.showPrice ? this.price : '',
              users: this.owners,
              servers: this.servers
            };
            if (!this.canCreate) {
              // console.log('send request');
              this.sendRequest(data);
            } else {
              this.$store.dispatch('createInstance', data);
              // eslint-disable-next-line max-len
              // this.$store.dispatch('notify', { id: 0, message: 'Your instance is launching', color: '' });
              setTimeout(() => {
                this.$store.dispatch('fetchInstances');
              }, 500);
            }
          }
          this.active = false;
        }
      },
      sendRequest(data) {
        if (this.name !== '') {
          const tempdata = data;
          tempdata.users = [this.me.id];
          tempdata.users_name = [this.me.username];
          let meta = '';
          Object.entries(tempdata).forEach(
            ([key, value]) => { meta += `${key}: ${value} <br>`; }
          );
          const mail_message = `${this.$i18n.t('requests.mail_message', [this.getProductionName, 'create', 'waiting', meta])}`;
          this.$store.dispatch('createRequests', { action: 'create', message: `Create new instance ${this.name}`, status: 'waiting', meta_data: tempdata, mail_message });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.request_created')}`, color: '' });
          this.active = false;
        }
      }
    },
    created() {
      this.$store.dispatch('fetchImages');
      this.$store.dispatch('fetchServers');
      // console.log('fetchedImages');
    }
  };
</script>
