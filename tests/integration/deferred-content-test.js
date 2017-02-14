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

test('shows rejected component when rejected, hide when pending or resolved', function(assert) {
  assert.expect(10);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise as |d|}}
      {{#d.rejected as |reason|}}<div id="rejected">Rejected: {{reason}}</div>{{/d.rejected}}
      {{#if d.isRejected}}<div id="rejected-flag">Rejected: {{d.content}}</div>{{/if}}
    {{/deferred-content}}
  `);

  assert.equal(this.$('#rejected').length, 0, 'hides the rejected component');
  assert.equal(this.$('#rejected-flag').length, 0, 'hides the rejected if block');

  deferred.reject('failed');

  return wait()
    .then(() => {
      let rejectedDiv = this.$('#rejected');
      assert.equal(rejectedDiv.length, 1, 'shows the rejected component when rejected');
      assert.equal(rejectedDiv.text().trim(), 'Rejected: failed', 'yields the rejected value to the component');
      let rejectedBlock = this.$('#rejected-flag');
      assert.equal(rejectedBlock.length, 1, 'shows the rejected if block when rejected');
      assert.equal(rejectedBlock.text().trim(), 'Rejected: failed', 'makes reject value available at d.content the rejected value to the component');
    })
    .then(() => {
      deferred = RSVP.defer();
      this.set('promise', deferred.promise);
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#rejected').length, 0, 'hides the rejected component');
      assert.equal(this.$('#rejected-flag').length, 0, 'hides the rejected if block');
      deferred.resolve();
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#rejected').length, 0, 'hides the rejected component when fulfilled');
      assert.equal(this.$('#rejected-flag').length, 0, 'hides the rejected if block when fufilled');
    });
});

test('shows fulfilled component when fulfilled, hide when pending or rejected', function(assert) {
  assert.expect(10);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise as |d|}}
      {{#d.fulfilled as |content|}}<div id="fulfilled">Fulfilled: {{content}}</div>{{/d.fulfilled}}
      {{#if d.isFulfilled}}<div id="fulfilled-flag">Fulfilled: {{d.content}}</div>{{/if}}
    {{/deferred-content}}
  `);

  assert.equal(this.$('#fulfilled').length, 0, 'hides the fulfilled component');
  assert.equal(this.$('#fulfilled-flag').length, 0, 'hides the fulfilled if block');

  deferred.resolve('hello world');

  return wait()
    .then(() => {
      let fulfilledDiv = this.$('#fulfilled');
      assert.equal(fulfilledDiv.length, 1, 'shows the fulfilled component when fulfilled');
      assert.equal(fulfilledDiv.text().trim(), 'Fulfilled: hello world', 'yields the fulfilled value to the component');
      let fulfilledBlock = this.$('#fulfilled-flag');
      assert.equal(fulfilledBlock.length, 1, 'shows the fulfilled if block when fulfilled');
      assert.equal(fulfilledBlock.text().trim(), 'Fulfilled: hello world', 'makes the resolve value availbe via d.content');
    })
    .then(() => {
      deferred = RSVP.defer();
      this.set('promise', deferred.promise);
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#fulfilled').length, 0, 'hides the fulfilled component');
      assert.equal(this.$('#fulfilled-flag').length, 0, 'hides the fulfilled if block');
      deferred.reject();
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#fulfilled').length, 0, 'hides the fulfilled component when rejected');
      assert.equal(this.$('#fulfilled-flag').length, 0, 'hides the fulfilled if block when rejected');
    });
});

test('shows pending component when unresolved, hide when fulfilled or rejected', function(assert) {
  assert.expect(8);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise as |d|}}
      {{#d.pending}}<div id="pending">Pending</div>{{/d.pending}}
      {{#if d.isPending}}<div id="pending-flag">Pending</div>{{/if}}
    {{/deferred-content}}
  `);

  assert.equal(this.$('#pending').length, 1, 'display the pending component');
  assert.equal(this.$('#pending-flag').length, 1, 'display the pending if block');

  deferred.resolve();

  return wait()
    .then(() => {
      assert.equal(this.$('#pending').length, 0, 'hide the pending component when resolving');
      assert.equal(this.$('#pending-flag').length, 0, 'hide the pending if block when resolving');
    })
    .then(() => {
      deferred = RSVP.defer();
      this.set('promise', deferred.promise);
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#pending').length, 1, 'display the pending component');
      assert.equal(this.$('#pending-flag').length, 1, 'display the pending if block');
      deferred.reject();
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#pending').length, 0, 'hide the pending component when rejecting');
      assert.equal(this.$('#pending-flag').length, 0, 'hide the pending if block when rejecting');
    });
});

test('shows settled component when settled, hide when unresolved', function(assert) {
  assert.expect(8);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise as |d|}}
      {{#d.settled}}<div id="settled">Settled</div>{{/d.settled}}
      {{#if d.isSettled}}<div id="settled-flag">Settled</div>{{/if}}
    {{/deferred-content}}
  `);

  assert.equal(this.$('#settled').length, 0, 'hide the settled component when pending');
  assert.equal(this.$('#settled-flag').length, 0, 'hide the settled if block when pending');

  deferred.resolve();

  return wait()
    .then(() => {
      assert.equal(this.$('#settled').length, 1, 'display the settled component when resolved');
      assert.equal(this.$('#settled-flag').length, 1, 'display the settled if block when resolved');
    })
    .then(() => {
      deferred = RSVP.defer();
      this.set('promise', deferred.promise);
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#settled').length, 0, 'hide the settled component when pending');
      assert.equal(this.$('#settled-flag').length, 0, 'hide the settled if block when pending');
      deferred.reject();
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#settled').length, 1, 'display the settled component when rejected');
      assert.equal(this.$('#settled-flag').length, 1, 'display the settled if block when rejected');
    });
});

test('accounts for being torn down - rejected', function(assert) {
  assert.expect(0);
  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);
  this.set('show', true);

  this.render(hbs`
    {{#if show}}
      {{#deferred-content promise as |d|}}
        {{#d.rejected}}{{/d.rejected}}
      {{/deferred-content}}
    {{/if}}
  `);

  this.set('show', false);
  deferred.reject();
  return wait();
});

test('accounts for being torn down - fullfilled', function(assert) {
  assert.expect(0);
  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);
  this.set('show', true);

  this.render(hbs`
    {{#if show}}
      {{#deferred-content promise as |d|}}
        {{#d.fulfilled}}{{/d.fulfilled}}
      {{/deferred-content}}
    {{/if}}
  `);

  this.set('show', false);
  deferred.resolve();
  return wait();
});

test('accounts for being torn down - pending', function(assert) {
  assert.expect(0);
  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);
  this.set('show', true);

  this.render(hbs`
    {{#if show}}
      {{#deferred-content promise as |d|}}
        {{#d.pending}}{{/d.pending}}
      {{/deferred-content}}
    {{/if}}
  `);

  this.set('show', false);
  deferred.resolve();
  return wait();
});

test('accounts for being torn down - settled', function(assert) {
  assert.expect(0);
  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);
  this.set('show', true);

  this.render(hbs`
    {{#if show}}
      {{#deferred-content promise as |d|}}
        {{#d.settled}}{{/d.settled}}
      {{/deferred-content}}
    {{/if}}
  `);

  this.set('show', false);
  deferred.resolve();
  return wait();
});

test('raises assertion when passed argument that is not promise', function(assert) {
  assert.expect(1);
  this.set('promise', { data: 'I\'m a POJO!' });

  try {
    Ember.run(() => {
      this.render(hbs`{{deferred-content promise}}`);
    });
  } catch (e) {
    let errorMessage = 'Assertion Failed: You must pass a promise to ember-deferred-content';
    assert.equal(
      e.message,
      errorMessage,
      'Raises assertion when argument provided to component is not a promise'
    );
  }
});
