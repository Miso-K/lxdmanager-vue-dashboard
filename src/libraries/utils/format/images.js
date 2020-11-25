// import _map from 'lodash/map';

export default function images(data) {
  // return first non empty alias name
  const alias = data.aliases.find(el => el.name !== '');
  return {
    // id: data.id,
    name: alias ? alias.name : '',
    alias_description: alias ? alias.description : '',
    fingerprint: data.fingerprint.substring(0, 12),
    public: data.public,
    description: data.properties.description,
    architecture: data.architecture,
    type: data.type,
    size: data.size,
    uploaded_at: data.uploaded_at,
    relationships: data.relationships
  };
}
