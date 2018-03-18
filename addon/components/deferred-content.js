import { assert } from '@ember/debug';
import Component from '@ember/component';
import { computed, get, set } from '@ember/object';
import { not } from '@ember/object/computed';
import layout from '../templates/components/deferred-content';

const DeferredContentComponent = Component.extend({
  layout,
  isPending: not('isSettled'),
  tagName:'',
  promise: computed({
    set(key, promise) {
      assert('You must pass a promise to ember-deferred-content', typeof promise.then === 'function');
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
