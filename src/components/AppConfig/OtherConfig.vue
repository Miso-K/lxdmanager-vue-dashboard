<template>
  <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>

          <v-card
            flat
        class="hide-overflow"
        color="lighteen-1"
      >
        <v-form ref="form" v-model="valid" lazy-validation>
        <v-app-bar flat
          height="50px"
        >
          <v-spacer></v-spacer>
          <v-btn
            fab
            small
            @click="isEditing = !isEditing"
          >
            <v-icon v-if="isEditing">close</v-icon>
            <v-icon v-else>edit</v-icon>
          </v-btn>
        </v-app-bar>
              <v-card-text>
                <header>Storage settings</header>
                <v-checkbox :disabled="!isEditing" v-model="showStorage" label="Enable zfs/brtfs storage"></v-checkbox>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.storage.pool_name"
                  label="Storage name (for default instance installation)"
                  placeholder="default"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.storage.total_size"
                  label="Storage total size (for default instance installation)"
                  placeholder="1000 GB"
                  required
                ></v-text-field>
                <v-radio-group :disabled="!isEditing" v-model="data.storage.limits_unit" row>
                  <v-radio label="Limits in 'GB'" name="data.storage.limits_unit" value="GB"></v-radio>
                  <v-radio label="Limits in 'GiB'" name="data.storage.limits_unit" value="GiB"></v-radio>
                </v-radio-group>
                <v-radio-group :disabled="!isEditing" v-model="data.storage.limits_unit_show" row>
                  <v-radio label="Show limits unit as 'GB'" name="data.storage.limits_unit_show" value="GB"></v-radio>
                  <v-radio label="Show limits unit as 'GiB'" name="data.storage.limits_unit_show" value="GiB"></v-radio>
                </v-radio-group>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.storage.limits_min"
                      label="Min disk (GB/GiB)"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.storage.limits_max"
                      label="Max disk (GB/GiB)"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.storage.limits_step"
                      label="Step (GB/GiB)"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-divider></v-divider>
                <br>
                <header>Memory settings</header>
                <v-radio-group :disabled="!isEditing" v-model="data.memory.limits_unit" row>
                  <v-radio label="Limits in 'MB'" name="data.memory.limits_unit" value="MB"></v-radio>
                  <v-radio label="Limits in 'MiB'" name="data.memory.limits_unit" value="MiB"></v-radio>
                </v-radio-group>
                <v-radio-group :disabled="!isEditing" v-model="data.memory.limits_unit_show" row>
                  <v-radio label="Show limits unit as 'MB'" name="data.memory.limits_unit_show" value="MB"></v-radio>
                  <v-radio label="Show limits unit as 'MiB'" name="data.memory.limits_unit_show" value="MiB"></v-radio>
                </v-radio-group>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.memory.limits_min"
                      label="Min memory (MB/MiB)"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.memory.limits_max"
                      label="Max memory (MB/MiB)"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.memory.limits_step"
                      label="Step (MB/MiB)"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
                <br>
                <header>CPU settings</header>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.cpu.limits_min"
                      label="Min cpu (unit)"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.cpu.limits_max"
                      label="Max cpu (unit)"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      :disabled="!isEditing"
                      v-model="data.cpu.limits_step"
                      label="Step (unit)"
                      required
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="success" :disabled="!isEditing" @click="save">Save</v-btn>
              </v-card-actions>
        </v-form>
        </v-card>
      </v-flex>
      </v-layout>
    </v-container>
</template>

<script>

  export default {
    name: 'AppConfig',
    components: {
    },
    data() {
      return {
        isEditing: null,
        showStorage: false,
        show1: false,
        verify: ['True', 'False'],
        dialog: false,
        dialogTest: false,
        data: {
          storage: {
            enabled: false,
            pool_name: '',
            total_size: '',
            limits_unit: 'GB',
            limits_unit_show: 'GB',
            limits_min: '10',
            limits_max: '200',
            limits_step: '5'
          },
          memory: {
            limits_unit: 'MB',
            limits_unit_show: 'MB',
            limits_min: '512',
            limits_max: '2048',
            limits_step: '256'
          },
          cpu: {
            limits_min: '1',
            limits_max: '4',
            limits_step: '1'
          }
        }
      };
    },
    computed: {
      checkconfig() {
        return this.$store.getters.checkconfig[0] ? this.$store.getters.checkconfig[0].attributes : '';
      }
    },
    methods: {
      update_checkboxes() {
        this.$store.commit('update_checkboxes', this.data.storage.enabled);
      },
      save() {
        this.isEditing = !this.isEditing;
        const data = this.data;
        data.storage.enabled = this.showStorage;
        this.$store.dispatch('notify', { id: 0, message: 'Your settings was saved', color: 'info' });
        this.$store.dispatch('saveAppConfig', data);
        setTimeout(() => {
          this.$store.dispatch('fetchAppConfig');
        }, 500);
      },
      savecerts() {
        this.isEditing = !this.isEditing;
        this.$store.dispatch('notify', { id: 0, message: 'Your certificates was saved', color: 'info' });
        this.$store.dispatch('saveCerts', this.certs);
        setTimeout(() => {
          this.$store.dispatch('fetchAppConfig');
        }, 500);
      },
      sendTestEmail() {
        this.save();
        this.$store.dispatch('createRequests', { action: 'test', message: 'Test email configuration', status: 'cancelled', meta_data: '' });
        this.$store.dispatch('notify', { id: 0, message: 'Test email was sent', color: 'info' });
        // console.log('testemail');
      }
    },
    // created() {
    // this.initialize();
    // },
    mounted() {
      // setTimeout(() => {
      this.$store.dispatch('fetchAppConfig').then(() => {
        this.data = Object.assign({}, this.data, this.$store.getters.appconfig);
        this.showPrice = this.data.price.enabled === 'True';
        this.showStorage = this.data.storage.enabled === 'True';
        this.showEmail = this.data.smtp.enabled === 'True';
      });
      // console.log(this.$store.getters.appconfig);
      // }, 500);
    }
  };
</script>

