// import _map from 'lodash/map';

export default function createUser(data) {
  const ints = data.instances.map(c => ({
    type: 'instances',
    id: c
  }));

  return {
    data: {
      type: 'users',
      attributes: {
        admin: false,
        username: data.username,
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country,
        postalCode: data.postalcode,
        ico: data.ico,
        icDph: data.icDph,
        dic: data.dic,
        password: 'afdsG.d543saf'
      },
      relationships: {
        groups: {
          data: [
            {
              type: 'groups',
              id: 2
            }
          ]
        },
        instances: {
          data: ints
        }
      }
    }
  };
}
