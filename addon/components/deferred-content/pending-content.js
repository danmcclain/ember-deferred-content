import Ember from 'ember';
import layout from '../../templates/components/deferred-content/pending-content';

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
      set(this, 'isSettled', false);

      promise.finally(() => {
        if (!get(this, 'isDestroyed')) {
          set(this, 'isSettled', true);
        }
      });

      return promise;
    }
  })
});
