# ember-deferred-content
## Fancy pants handling of async content
[![Build Status](https://travis-ci.org/danmcclain/ember-deferred-content.svg?branch=master)](https://travis-ci.org/danmcclain/ember-deferred-content)
[![npm version](https://badge.fury.io/js/ember-deferred-content.svg)](https://badge.fury.io/js/ember-deferred-content)


```no-highlight
ember install ember-deferred-content
```

## Usage

```hbs
  {{! This assumes that post has an async relationship called comments}}
  {{#deferred-content promise=post.comments as |d|}}
    {{#d.settled}}
      <h2>Comments</h2>
    {{/d.settled}}
    {{#d.pending}}
      <img src="spinner.gif">
    {{/d.pending}}
    {{#d.fulfilled as |comments|}}
      <ul>
        {{#each comments as |comment|}}
          <li>{{comment.author}} said: {{comment.body}}
        {{/each}}
      </ul>
    {{/d.fulfilled}}
    {{#d.rejected as |reason|}}
      Could not load comments: {{reason}}
    {{/d.rejected}}
  {{/deferred-content}}
```

`ember-deferred-content` takes the promise you need to resolve to show
your content, and yields 4 subcomponents that you can use to show
content during the different states of your promise

 - `d.settled`: displays the content when the promise is resolved or
   rejected
 - `d.pending`: displays the content before the promise is resolved or
   rejected
 - `d.fulfilled`: displays the content only when the promise is
   resolved; yields the result of the promise
 - `d.rejected`: displays the content only when the promise is rejected;
   yields the result of the promise

## Compatibility

This addon will work on Ember versions `2.3.x` and up only, due to use
of the new `(hash` helper
([details](http://emberjs.com/blog/2016/01/15/ember-2-3-released.html#toc_hash-helper)).


## Developing

* `git clone` this repository
* `npm install`
* `bower install`

## Running Tests

* `npm test` (Runs `ember try:testall` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

