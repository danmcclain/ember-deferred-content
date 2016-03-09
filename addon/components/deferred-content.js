import Ember from 'ember';
import layout from '../templates/components/deferred-content';

const {
  Component,
  computed,
  computed: { not },
  get,
  set
} = Ember;

const DeferredContentComponent = Component.extend({
  layout,
  isPending: not('isSettled'),
  promise: computed({
    set(key, promise) {
      set(this, 'isRejected', false);
      set(this, 'isFulfilled', false);
      set(this, 'isSettled', false);
      set(this, 'content', null);

      promise
        .then((result) => {
          if (!get(this, 'isDestroyed')) {
            set(this, 'isFulfilled', true);
            set(this, 'content', result);
          }
        }, (result) => {
          if (!get(this, 'isDestroyed')) {
            set(this, 'isRejected', true);
            set(this, 'content', result);
          }
        })
        .finally(() => {
          if (!get(this, 'isDestroyed')) {
            set(this, 'isSettled', true);
          }
        });

      return promise;
    }
  })
});

DeferredContentComponent.reopenClass({
  positionalParams: ['promise']
});

export default DeferredContentComponent;
