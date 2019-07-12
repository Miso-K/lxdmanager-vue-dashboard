// import _map from 'lodash/map';

export default function user(us) {
  return {
    id: us.id,
    username: us.attributes.username,
    email: us.attributes.email,
    name: us.attributes.name,
    phone: us.attributes.phone,
    address: us.attributes.address,
    city: us.attributes.city,
    country: us.attributes.country,
    postal_code: us.attributes.postal_code,
    ico: us.attributes.ico,
    ic_dph: us.attributes.ic_dph,
    dic: us.attributes.dic,
    language: us.attributes.language,
    registered_on: us.attributes.registered_on,
    otp_enabled: us.attributes.otp_enabled,
    otp_type: us.attributes.otp_type,
    admin: us.attributes.admin,
    containers: us.relationships.containers.data.map(container => container.id),
    groups: us.relationships.groups.data
  };
}
