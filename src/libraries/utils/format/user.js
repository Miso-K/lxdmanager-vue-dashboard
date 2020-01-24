// import _map from 'lodash/map';

export default function user(us) {
  // console.log(us);
  return {
    id: us.id,
    username: us.username,
    email: us.email,
    name: us.name,
    phone: us.phone,
    address: us.address,
    city: us.city,
    country: us.country,
    postal_code: us.postal_code,
    ico: us.ico,
    ic_dph: us.ic_dph,
    dic: us.dic,
    language: us.language,
    registered_on: us.registered_on,
    otp_enabled: us.otp_enabled,
    otp_type: us.otp_type,
    admin: us.admin,
    containers: us.relationships.containers.map(container => container),
    groups: us.relationships.groups.map(group => group)
  };
}
