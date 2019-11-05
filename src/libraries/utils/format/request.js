// import _map from 'lodash/map';

export default function request(data) {
  return {
    action: data.attributes.action,
    message: data.attributes.message,
    status: data.attributes.status,
    meta_data: data.attributes.meta_data,
    created_on: data.attributes.created_on,
    changed_on: data.attributes.changed_on,
    users: data.relationships.users.data
  };
}
