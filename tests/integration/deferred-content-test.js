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

test('shows fulfilled component when fulfilled, hide when pending or rejected', function(assert) {
  assert.expect(5);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise=promise as |d|}}
      {{#d.fulfilled as |content|}}<div id="fulfilled">Fulfilled: {{content}}</div>{{/d.fulfilled}}
    {{/deferred-content}}
  `);

  assert.equal(this.$('#fulfilled').length, 0, 'hides the fulfilled component');

  deferred.resolve('hello world');

  return wait()
    .then(() => {
      let fulfilledDiv = this.$('#fulfilled');
      assert.equal(fulfilledDiv.length, 1, 'shows the fulfilled component when fulfilled');
      assert.equal(fulfilledDiv.text().trim(), 'Fulfilled: hello world', 'yields the fulfilled value to the component');
    })
    .then(() => {
      deferred = RSVP.defer();
      this.set('promise', deferred.promise);
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#fulfilled').length, 0, 'hides the fulfilled component');
      deferred.reject();
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#fulfilled').length, 0, 'hides the fulfilled component when rejected');
    });
});

test('shows pending component when unresolved, hide when fulfilled or rejected', function(assert) {
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
