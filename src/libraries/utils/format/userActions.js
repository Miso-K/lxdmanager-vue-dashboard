// import _map from 'lodash/map';

const formatCreateUser = (data) => {
  const obj = {
    data: {
      type: 'users',
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      relationships: {
        groups: data.groups ? data.groups.map(g => ({
          type: 'groups',
          id: g.id ? g.id : g
        })) : [
          {
            type: 'groups',
            id: 2
          }
        ],
        instances: data.instances ? data.instances.map(c => ({
          type: 'instances',
          id: c.id ? c.id : c
        })) : []
      }
    }
  };
  if (data.password !== '' && data.password) {
    obj.data.password = data.password;
  }
  if (data.phone !== '' && data.phone) {
    obj.data.phone = data.phone;
  }
  if (data.address !== '' && data.address) {
    obj.data.address = data.address;
  }
  if (data.city !== '' && data.city) {
    obj.data.city = data.city;
  }
  if (data.country !== '' && data.country) {
    obj.data.country = data.country;
  }
  if (data.postal_code !== '' && data.postal_code) {
    obj.data.postal_code = data.postal_code;
  }
  if (data.ico !== '' && data.ico) {
    obj.data.ico = data.ico;
  }
  if (data.ic_dph !== '' && data.ic_dph) {
    obj.data.ic_dph = data.ic_dph;
  }
  if (data.dic !== '' && data.dic) {
    obj.data.dic = data.dic;
  }
  if (data.language !== '' && data.language) {
    obj.data.language = data.language;
  }
  if (data.otp_type !== '' && data.otp_type) {
    obj.data.otp_type = data.otp_type;
  }
  return obj;
};

const formatUpdateUser = (data) => {
  const obj = {
    data: {
      type: 'users',
      id: data.id,
      username: data.username,
      name: data.name,
      email: data.email,
      relationships: {
        groups: data.groups ? data.groups.map(g => ({
          id: g.id ? g.id : g
        })) : [
          {
            id: 2,
            name: 'user'
          }
        ],
        instances: data.instances ? data.instances.map(c => ({
          id: c.id ? c.id : c
        })) : []
      }
    }
  };
  if (data.password !== '' && data.password) {
    obj.data.password = data.password;
  }
  if (data.phone !== '' && data.phone) {
    obj.data.phone = data.phone;
  }
  if (data.address !== '' && data.address) {
    obj.data.address = data.address;
  }
  if (data.city !== '' && data.city) {
    obj.data.city = data.city;
  }
  if (data.country !== '' && data.country) {
    obj.data.country = data.country;
  }
  if (data.postal_code !== '' && data.postal_code) {
    obj.data.postal_code = data.postal_code;
  }
  if (data.ico !== '' && data.ico) {
    obj.data.ico = data.ico;
  }
  if (data.ic_dph !== '' && data.ic_dph) {
    obj.data.ic_dph = data.ic_dph;
  }
  if (data.dic !== '' && data.dic) {
    obj.data.dic = data.dic;
  }
  if (data.language !== '' && data.language) {
    obj.data.language = data.language;
  }
  if (data.otp_type !== '' && data.otp_type) {
    obj.data.otp_type = data.otp_type;
  }
  return obj;
};

export {
  formatCreateUser,
  formatUpdateUser
};
