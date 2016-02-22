import Ember from 'ember';
import layout from '../templates/components/deferred-content';

const { Component } = Ember;

const DeferredContentComponent = Component.extend({
  layout
});

DeferredContentComponent.reopenClass({
  positionalParams: ['promise']
});

export default DeferredContentComponent;
