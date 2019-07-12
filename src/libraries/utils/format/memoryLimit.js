import { humanFileSize } from '../helpers';
import I18n from '../../i18n';

export default function memoryLimit(value, hostValue) {
  if (!value || !isNaN(value)) return I18n.t('unlimited');

  return value > hostValue ? I18n.t('unlimited') : humanFileSize(value);
}
