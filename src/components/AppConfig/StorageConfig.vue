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
            limits_unit_show: 'GB'
          },
          memory: {
            limits_unit: 'MB',
            limits_unit_show: 'MB'
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
      checkConfig() {
        setTimeout(() => {
          this.$store.dispatch('fetchCheckconfig');
        }, 500);
        this.dialogTest = true;
      },
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
      setTimeout(() => {
        this.$store.dispatch('fetchAppConfig').then(() => {
          this.data = Object.assign({}, this.data, this.$store.getters.appconfig);
          this.showPrice = this.data.price.enabled === 'True';
          this.showStorage = this.data.storage.enabled === 'True';
          this.showEmail = this.data.smtp.enabled === 'True';
        });
        // console.log(this.$store.getters.appconfig);
      }, 500);
    }
  };
</script>

