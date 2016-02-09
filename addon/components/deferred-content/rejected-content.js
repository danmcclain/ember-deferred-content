import Ember from 'ember';
import layout from '../../templates/components/deferred-content/rejected-content';

const {
  Component,
  computed,
  set
} = Ember;

export default Component.extend({
  layout,
  promise: computed({
    set(key, promise) {
      set(this, 'isRejected', false);
      set(this, 'result', null);

      promise.catch((result) => {
        set(this, 'isRejected', true);
        set(this, 'result', result);
      });

      return promise;
    }
  })
});
