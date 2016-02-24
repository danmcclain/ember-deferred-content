import Ember from 'ember';
import layout from '../../templates/components/deferred-content/rejected-content';

const {
  Component,
  computed,
  get,
  set
} = Ember;

export default Component.extend({
  layout,
  promise: computed({
    set(key, promise) {
      set(this, 'isRejected', false);
      set(this, 'result', null);

      promise.catch((result) => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'isRejected', true);
          set(this, 'result', result);
        }
      });

      return promise;
    }
  })
});
