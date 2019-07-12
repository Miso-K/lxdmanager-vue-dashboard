import _reduce from 'lodash/reduce';
import build from 'redux-object';

const getUserAbilities = (state, identity) => {
  const user = build(state, 'users', identity);

  let abilities = [];

  if (user && user.groups) {
    abilities = _reduce(user.groups, (acc, group) => {
      if (group && group.abilities) {
        group.abilities.forEach((ability) => {
          if (ability && ability.name) {
            if (acc.indexOf(ability.name) === -1) {
              acc.push(ability.name);
            }
          }
        });
      }

      return acc;
    }, []);
  }

  return abilities;
};

export default getUserAbilities;
