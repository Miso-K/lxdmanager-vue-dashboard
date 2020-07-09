<template>
  <v-container fluid>
  <v-layout row>
    <v-flex class="text-md-center mt-3 mb-3">
      <v-btn
        v-if="false"
        color="primary"
        :loading="loading"
        @click.stop="dialog_edit = true"
        @click="getEditConfig"
        :disabled="loading"
      >
        <v-icon left dark>lock</v-icon>
        Edit instance
        <v-icon right dark>edit</v-icon>
      </v-btn>
      <v-btn
        color="secondary"
        :loading="loading"
        @click.stop="dialog_upgrade = true"
        :disabled="loading"
      >
        {{ $t('instances.actions.upgrade') }}
        <v-icon right dark>settings</v-icon>
      </v-btn>

      <v-btn
        :loading="loading3"
        @click.stop="dialog_clone = true"
        :disabled="loading3"
        color="blue-grey"
        class="white--text"
      >
        {{ $t('instances.actions.clone') }}
        <v-icon right dark>cloud_upload</v-icon>
      </v-btn>
      <v-btn
        :loading="loading3"
        @click.stop="dialog_destroy = true"
        :disabled="loading3"
        color="red"
        class="white--text"
      >
        {{ $t('instances.actions.destroy') }}
        <v-icon right dark>delete</v-icon>
      </v-btn>
    </v-flex>
  </v-layout>
  <v-layout row justify-center>
    <v-dialog v-model="dialog_destroy" max-width="500">
      <v-card>
        <v-card-title class="headline">{{$t('instances.actions.destroy')}}</v-card-title>

        <v-card-text>
          {{$t('instances.order.destroy_instance.label')}}
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            color="green darken-1"
            text
            @click="dialog_destroy = false"
          >
            {{$t('actions.disagree')}}
          </v-btn>

          <v-btn
            color="red darken-1"
            text
            @click.native="dialog_destroy = false"
            @click="sendRequestDestroy"
          >
            {{$t('actions.agree')}}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_clone" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('instances.actions.clone')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field :label="$t('instances.order.instance_name.label')" disabled :value=instanceName></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field :label="$t('instances.order.instance_clone_name.label')" v-model="instanceClone"></v-text-field>
              </v-flex>
              <v-flex xs12>
                <v-text-field
                  v-if="showPrice"
                  label="Price"
                  v-model="calcPrice"
                  suffix="€"
                  :disabled="!me.admin"
                ></v-text-field>
              </v-flex>
              <!---<v-flex xs12 sm6>
                <v-select
                  :items="['week', 'month', 'unlimited']"
                  v-model="cperiod"
                  label="Time period"
                  required
                ></v-select>
              </v-flex>-->
            </v-layout>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="dialog_clone = false">{{$t('actions.close')}}</v-btn>
          <v-btn color="blue darken-1" text @click.native="dialog_clone = false" @click="sendRequestClone">{{$t('actions.create')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="dialog_upgrade" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">{{$t('instances.actions.upgrade')}}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12>
                <v-text-field :label="$t('instances.order.instance_name.label')" disabled :value=instanceName></v-text-field>
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
              <template v-if="showPrice">
                <v-flex xs3>
                  <v-subheader>{{ $t('instances.order.payment_period.label') }}</v-subheader>
                </v-flex>
                <v-flex xs3>
                  <v-select
                    :items=periodes
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
                    label="Price"
                    v-model="calcPrice"
                    suffix="€"
                    :disabled="!me.admin"
                  ></v-text-field>
                </v-flex>
              </template>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="getInstanceConfig">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="dialog_upgrade = false">{{$t('actions.close')}}</v-btn>
          <v-btn color="blue darken-1" text @click.native="dialog_upgrade = false" @click="sendRequestUpgrade">{{$t('actions.create')}}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-if="false" v-model="dialog_edit" max-width="690px">
      <v-card>
        <v-card-title>
          <span class="headline">Edit instance</span>
        </v-card-title>
        <v-card-text>
            <a href="https://lxd.readthedocs.io/en/latest/instances/" target="_blank">LXD profiles documentation</a>
            <br>
            <v-textarea
              outlined
              auto-grow
              background-color="black"
              dark
              v-model="yamlString"
              :error-messages="yamlErrorMessages"
            ></v-textarea>
          </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="getEditConfig">Reset</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click.native="dialog_edit = false">{{$t('actions.close')}}</v-btn>
          <v-btn color="blue darken-1" text @click.native="dialog_edit = false" @click="sendRequestUpgrade">SAVE</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
  </v-container>
</template>

<script>
  const yaml = require('js-yaml');

  export default {
    name: 'tab-info',
    data() {
      return {
        dialog_clone: false,
        dialog_destroy: false,
        dialog_upgrade: false,
        dialog_edit: false,
        yamlString: '',
        yamlErrorMessages: '',
        period: { text: '1 Month', value: 1 },
        name: '',
        cpu: '',
        cpuLimit: true,
        memory: '',
        memoryLimit: true,
        disk: '',
        diskLimit: true,
        actualDisk: '10',
        instanceClone: '',
        cperiod: '',
        periodes: [
          { text: '1 Month', value: 1 },
          { text: '3 Months', value: 1 },
          { text: '6 Months', value: 0.95 },
          { text: '12 Months', value: 0.90 },
          { text: '24 Months', value: 0.80 }
        ],
        price: ''
      };
    },
    computed: {
      id() {
        return Number(this.$route.params.id);
      },
      instance() {
        return this.$store.getters.instanceDataId(this.id);
      },
      instanceName() {
        return this.instance.name;
      },
      instanceNameClone() {
        const name = this.instance.name;
        return name.concat('-clone');
      },
      me() {
        return this.$store.getters['auth/me'];
      },
      showPrice() {
        return this.$store.getters.appconfig.price.enabled === 'True';
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
        return this.$store.getters.appconfig.storage;
      },
      diskEnabled() {
        return this.$store.getters.appconfig.storage.enabled === 'True';
      },
      canDelete() {
        return this.me.abilities.includes('instances_delete');
      },
      canClone() {
        return this.me.abilities.includes('instances_create');
      },
      canUpdate() {
        return this.me.abilities.includes('instances_update');
      },
      getProductionName() {
        return this.$store.getters.appconfig.app.production_name;
      },
      calcPrice: {
        get() {
          const cpu = this.getPrice.cpu * this.cpu; // 1
          const memory = this.getPrice.memory * this.memory; // 0.048
          const disk = this.getPrice.disk * this.disk; // 0.150
          const period = this.period.value;
          const cmemory = (cpu + memory + disk) * period;
          this.price = cmemory.toFixed(2);
          return cmemory.toFixed(2);
        },
        set(val) {
          this.price = parseFloat(val).toFixed(2);
          return parseFloat(val).toFixed(2);
        }
      }
    },
    methods: {
      getInstanceConfig() {
        const config = this.instance.config;
        this.name = this.instanceName;
        console.log(config);
        this.cpu = config.limits_cpu > 1 ? config.limits_cpu : 1;
        this.memory = config.limits_memory_mb > 512 ? config.limits_memory_mb : 512;
        this.disk = config.limits_disk_gb > 10 ? config.limits_disk_gb : 10;
        this.actualDisk = config.limits_disk_gb > 10 ? config.limits_disk_gb : 10;
        this.cpuLimit = !!config.limits_cpu;
        this.memoryLimit = !!config.limits_memory;
        this.diskLimit = !!config.limits_disk;
      },
      getEditConfig() {
        const rawinstance = this.$store.getters.instance(this.id);
        const filteredKeys = ['architecture', 'config', 'devices', 'ephemeral', 'profiles', 'stateful', 'description'];
        const filtered = Object.assign({}, ...filteredKeys.map(key => ({ [key]: rawinstance[key] })));
        this.yamlString = yaml.safeDump(filtered);
      },
      sendRequestUpgrade() {
        const data = {
          id: this.id,
          name: this.name,
          cpu: this.cpuLimit ? this.cpu : '',
          memory: this.memoryLimit ? `${this.memory}${this.getMemory.limits_unit}` : '',
          disk: this.diskLimit ? `${this.disk}${this.getStorage.limits_unit}` : '',
          pool_name: this.getStorage.enabled === 'True' ? this.getStorage.pool_name : '',
          period: this.showPrice ? this.period.text : '',
          price: this.showPrice ? this.price : ''
        };
        if (this.canUpdate) {
          this.$store.dispatch('upgradeInstance', data);
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.instance_upgraded')}`, color: '' });
        } else {
          const tempdata = data;
          tempdata.users = [this.me.id];
          tempdata.users_name = [this.me.username];
          let meta = '';
          Object.entries(tempdata).forEach(
            ([key, value]) => { meta += `${key}: ${value} <br>`; }
          );
          const mail_message = `${this.$i18n.t('requests.mail_message', [this.getProductionName, 'upgrade', 'waiting', meta])}`;
          this.$store.dispatch('createRequests', { action: 'upgrade', message: `Upgrade instance ${this.name}`, status: 'waiting', meta_data: data, mail_message });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.request_created')}`, color: '' });
          this.active = false;
        }
      },
      sendRequestClone() {
        const data = {
          instanceName: this.instanceName,
          instanceClone: this.instanceClone,
          cpu: this.instance.config.limits_cpu,
          memory: this.instance.config.limits_memory,
          disk: this.instance.config.limits_disk ? `${this.instance.config.limits_disk}` : '0GB',
          users: [this.me.id],
          users_name: [this.me.username]
        };
        if (this.canClone) {
          this.$store.dispatch('cloneInstance', data);
          this.$store.dispatch('notify', { id: 0, message: 'Your instance was cloned', color: '' });
        } else {
          let meta = '';
          Object.entries(data).forEach(
            ([key, value]) => { meta += `${key}: ${value} <br>`; }
          );
          const mail_message = `${this.$i18n.t('requests.mail_message', [this.getProductionName, 'clone', 'waiting', meta])}`;
          this.$store.dispatch('createRequests', { action: 'clone', message: `Clone instance ${this.name}`, status: 'waiting', meta_data: data, mail_message });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.request_created')}`, color: '' });
          this.active = false;
        }
      },
      sendRequestDestroy() {
        if (this.canDelete) {
          if (this.instance.status === 'STOPPED') {
            this.$store.dispatch('deleteInstance', this.id);
            this.$store.dispatch('notify', {
              id: 0,
              message: `${this.$i18n.t('notifications.instance_deleted')}`,
              color: ''
            });
          } else {
            this.$store.dispatch('notify', {
              id: 0,
              message: `${this.$i18n.t('notifications.instance_is_running')}`,
              color: 'red'
            });
          }
        } else {
          const data = {
            id: this.id,
            name: this.instanceName
          };
          const meta = `id: ${this.id}<br>name: ${this.instanceName}<br>`;
          const mail_message = `${this.$i18n.t('requests.mail_message', [this.getProductionName, 'delete', 'waiting', meta])}`;
          this.$store.dispatch('createRequests', { action: 'delete', message: `Delete instance ${this.name}`, status: 'waiting', meta_data: data, mail_message });
          this.$store.dispatch('notify', { id: 0, message: `${this.$i18n.t('notifications.request_created')}`, color: '' });
          this.active = false;
        }
      }
    },
    mounted() {
      this.getInstanceConfig();
      this.instanceClone = this.instanceNameClone;
    }
  };
</script>
