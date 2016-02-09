import Ember from 'ember';
import { moduleForComponent, test } from 'ember-qunit';
import wait from 'ember-test-helpers/wait';
import hbs from 'htmlbars-inline-precompile';

const {
  RSVP
} = Ember;

moduleForComponent('pretty-color', 'Integration | Component | deferred content', {
  integration: true
});

test('shows pending component when unresolved, hide when resolved or rejected', function(assert) {
  assert.expect(4);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise=promise as |d|}}
      {{#d.pending}}<div id="pending">Pending</div>{{/d.pending}}
    {{/deferred-content}}
  `);

  assert.equal(this.$('#pending').length, 1, 'display the pending component');

  deferred.resolve();

  return wait()
    .then(() => {
      assert.equal(this.$('#pending').length, 0, 'hide the pending component when resolving');
    })
    .then(() => {
      deferred = RSVP.defer();
      this.set('promise', deferred.promise);
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#pending').length, 1, 'display the pending component');
      deferred.reject();
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#pending').length, 0, 'hide the pending component when rejecting');
    });
});
