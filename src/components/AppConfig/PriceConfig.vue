<template>
  <v-container grid-list-md>
      <v-layout row wrap>
        <v-flex xs12 sm12 md12 lg12>

          <v-card
            flat
        class="hide-overflow"
        color="lighteen-1"
      >
        <v-form ref="form" lazy-validation>
        <v-app-bar flat
          height="50px"
        >
          <v-spacer></v-spacer>
          <v-btn
            fab
            small
            @click="isEditing = !isEditing"
          >
            <v-icon v-if="isEditing">mdi-close</v-icon>
            <v-icon v-else>mdi-pencil</v-icon>
          </v-btn>
        </v-app-bar>
              <v-card-text>
                <v-checkbox :disabled="!isEditing" v-model="showPrice" label="Enable price calculation"></v-checkbox>
                <v-text-field
                  disabled
                  label="Formula"
                  placeholder="(cpu + memory + disk) * discount"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.price.cpu"
                  label="CPU price (per 1 vCPU)"
                  placeholder="1"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.price.memory"
                  label="Memory price (per 1 MB)"
                  placeholder="0.01"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.price.disk"
                  label="Disk price (per 1 GB)"
                  placeholder="0.1"
                  required
                ></v-text-field>
                <v-divider></v-divider>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.price.discount_month"
                  label="Month discount"
                  placeholder="1"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.price.discount_months"
                  label="3 months discount"
                  placeholder="1"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.price.discount_halfyear"
                  label="6 months discount"
                  placeholder="1"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.price.discount_year"
                  label="Year discount"
                  placeholder="1"
                  required
                ></v-text-field>
                <v-text-field
                  :disabled="!isEditing"
                  v-model="data.price.discount_years"
                  label="2 year discount"
                  placeholder="1"
                  required
                ></v-text-field>
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
        showPrice: false,
        showStorage: false,
        showEmail: false,
        show1: false,
        verify: ['True', 'False'],
        dialog: false,
        dialogTest: false,
        data: {
          price: {
            enabled: false,
            cpu: '',
            memory: '',
            disk: '',
            discount_month: '',
            discount_months: '',
            discount_halfyear: '',
            discount_year: '',
            discount_years: ''
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
        data.price.enabled = this.showPrice;
        this.$store.dispatch('notify', { id: 0, message: 'Your settings was saved', color: 'info' });
        this.$store.dispatch('saveAppConfig', data);
        setTimeout(() => {
          this.$store.dispatch('fetchAppConfig');
        }, 500);
      }
    },
    // created() {
    // this.initialize();
    // },
    mounted() {
      this.$store.dispatch('fetchAppConfig').then(() => {
        this.data = Object.assign({}, this.data, this.$store.getters.appconfig);
        this.showPrice = this.data.price.enabled === 'True';
        this.showStorage = this.data.storage.enabled === 'True';
        this.showEmail = this.data.smtp.enabled === 'True';
      });
      // console.log(this.$store.getters.appconfig);
    }
  };
</script>

