// import _map from 'lodash/map';

export default function request(data) {
  // console.log(data);
  return {
    id: data.id,
    action: data.action,
    message: data.message,
    status: data.status,
    meta_data: data.meta_data,
    created_on: data.created_on,
    changed_on: data.changed_on,
    // eslint-disable-next-line max-len
    last_change: data.changed_on ? data.changed_on : data.created_on,
    users: data.relationships.users
  };
}
