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

test('shows rejected component when rejected, hide when pending or rejected', function(assert) {
  assert.expect(5);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise as |d|}}
      {{#d.rejected as |reason|}}<div id="rejected">Rejected: {{reason}}</div>{{/d.rejected}}
    {{/deferred-content}}
  `);

  assert.equal(this.$('#rejected').length, 0, 'hides the rejected component');

  deferred.reject('failed');

  return wait()
    .then(() => {
      let fulfilledDiv = this.$('#rejected');
      assert.equal(fulfilledDiv.length, 1, 'shows the rejected component when rejected');
      assert.equal(fulfilledDiv.text().trim(), 'Rejected: failed', 'yields the rejected value to the component');
    })
    .then(() => {
      deferred = RSVP.defer();
      this.set('promise', deferred.promise);
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#rejected').length, 0, 'hides the rejected component');
      deferred.resolve();
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#rejected').length, 0, 'hides the rejected component when fulfilled');
    });
});

test('shows fulfilled component when fulfilled, hide when pending or rejected', function(assert) {
  assert.expect(5);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise as |d|}}
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
    {{#deferred-content promise as |d|}}
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

test('shows settled component when settled, hide when unresolved', function(assert) {
  assert.expect(4);

  let deferred = RSVP.defer();

  this.set('promise', deferred.promise);

  this.render(hbs`
    {{#deferred-content promise as |d|}}
      {{#d.settled}}<div id="settled">Settled</div>{{/d.settled}}
    {{/deferred-content}}
  `);

  assert.equal(this.$('#settled').length, 0, 'hide the settled component when resolving');

  deferred.resolve();

  return wait()
    .then(() => {
      assert.equal(this.$('#settled').length, 1, 'display the settled component');
    })
    .then(() => {
      deferred = RSVP.defer();
      this.set('promise', deferred.promise);
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#settled').length, 0, 'hide the settled component when rejecting');
      deferred.reject();
      return wait();
    })
    .then(() => {
      assert.equal(this.$('#settled').length, 1, 'display the settled component');
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
