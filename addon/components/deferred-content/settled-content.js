import Ember from 'ember';
import layout from '../../templates/components/deferred-content/settled-content';

const {
  Component,
  computed,
  set
} = Ember;

export default Component.extend({
  layout,
  promise: computed({
    set(key, promise) {
      set(this, 'isSettled', false);

      promise.finally(() => {
        set(this, 'isSettled', true);
      });

      return promise;
    }
  })
});
