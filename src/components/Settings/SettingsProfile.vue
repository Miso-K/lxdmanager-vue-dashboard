<template>
  <v-card
    class="hide-overflow"
    color="lighteen-1"
  >
    <v-form ref="form" v-model="valid" lazy-validation>
    <v-toolbar
      card
      height="50px"
    >
      <v-icon>mdi-account</v-icon>
      <v-toolbar-title class="font-weight-light subheading">{{ $t('settings.profile.title') }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        fab
        small
        @click="isEditing = !isEditing"
      >
        <v-icon v-if="isEditing">close</v-icon>
        <v-icon v-else>edit</v-icon>
      </v-btn>
    </v-toolbar>
    <v-card-text>
      <v-container>
                    <v-layout wrap>
      <v-flex xs12 md6>
        <v-text-field
          disabled
          :label="$t('settings.profile.username')"
          v-model="data.username"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md6>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.email')"
          v-model="data.email"
          :rules="emailRules"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md12>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.name')"
          v-model="data.name"
          :rules="nameRules"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md4>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.phone')"
          v-model="data.phone"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md8>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.address')"
          v-model="data.address"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md4>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.city')"
          v-model="data.city"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md4>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.country')"
          v-model="data.country"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md4>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.postal_code')"
          v-model="data.postal_code"
        ></v-text-field>
      </v-flex>
                      <v-divider></v-divider>
      <v-flex xs12 md4>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.ico')"
          v-model="data.ico"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md4>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.icdph')"
          v-model="data.ic_dph"
        ></v-text-field>
      </v-flex>
      <v-flex xs12 md4>
        <v-text-field
          :disabled="!isEditing"
          :label="$t('settings.profile.dic')"
          v-model="data.dic"
        ></v-text-field>
      </v-flex>
                    </v-layout>
      </v-container>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!isEditing"
        color="success"
        @click="save"
      >
        {{ $t('actions.save') }}
      </v-btn>
    </v-card-actions>
    </v-form>
  </v-card>
</template>

<script>
  export default {
    data() {
      return {
        hasSaved: false,
        isEditing: null,
        model: null,
        data: {
          username: '',
          name: '',
          email: '',
          phone: '',
          address: '',
          country: '',
          city: '',
          postal_code: '',
          ico: '',
          ic_dph: '',
          dic: ''
        },
        valid: false,
        nameRules: [
          v => !!v || 'Name is required',
          v => (v && v.length <= 16) || 'Name must be less than 10 characters'
        ],
        emailRules: [
          v => !!v || 'E-mail is required',
          v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
        ]
      };
    },
    computed: {
      loading() {
        return this.$store.state.loading;
      }
    },
    methods: {
      me() {
        // console.log(this.$store.getters['auth/me']);
        this.data = this.$store.getters['auth/me'];
      },
      save() {
        if (this.$refs.form.validate()) {
          this.isEditing = !this.isEditing;
          this.$store.dispatch('notify', { id: 0, message: 'Your profile has been updated', color: '' });
          this.$store.dispatch('updateMe', this.data);
          setTimeout(() => {
            this.$store.dispatch('fetchMe');
          }, 500);
        }
      }
    },
    mounted() {
    },
    created() {
      this.me();
    }
};
</script>
