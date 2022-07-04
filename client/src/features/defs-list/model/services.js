import { isEmpty } from 'lodash';

export   const rowCountSize = items => {
  if (isEmpty(items)) {
    return 0
  } else {
    return items.length
  }
}
