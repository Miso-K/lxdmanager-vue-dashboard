// import _reduce from 'lodash/reduce';
// import build from 'redux-object';

const getUserAbilities = (state) => {
  const user = state.myself;
  const abilities = [];
  // console.log(user);
  if (Object.keys(user).length !== 0 && user.relationships.groups) {
    const abbs = state.groups[0].relationships.abilities;
    abbs.forEach((ability) => {
      if (ability && ability.name) {
        if (abilities.indexOf(ability.name) === -1) {
          abilities.push(ability.name);
        }
      }
    });
    return abilities;
  }
  return [];
};

export default getUserAbilities;
