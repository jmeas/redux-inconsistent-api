# redux-simple-resource

A Redux framework for interacting with remote resources.

[![Travis build status](http://img.shields.io/travis/jmeas/redux-simple-resource.svg?style=flat)](https://travis-ci.org/jmeas/redux-simple-resource)
[![Test Coverage](https://codeclimate.com/github/jmeas/redux-simple-resource/badges/coverage.svg)](https://codeclimate.com/github/jmeas/redux-simple-resource)

### Table of Contents

- [Motivation](#motivation)
  - [Features](#features)
  - [Why This Project?](#why-this-project)
- [Getting Started](#getting-started)
- [API](#api)
  - [createResource()](#createresource-resourcename-options-)
  - [requestStatuses](#requeststatuses)
  - [actionTypes](#actiontypes)
  - [updateResourceMeta()](#updateresourcemeta-resourcemeta-newmeta-id-replace-)
  - [updateManyResourceMetas()](#updatemanyresourcemetas-resourcemeta-newmeta-ids-replace-)
  - [upsertResource()](#upsertresource-resources-resource-id-replace-)
  - [upsertManyResources()](#upsertmanyresources-resources-newresources-replace-)
- [Guides](#guides)
  - [Resource Metadata](#resource-metadata)
  - [Request Statuses](#request-statuses)
  - [Structure of the Store](#structure-of-the-store)
  - [Customizing the Default Reducers](#customizing-the-default-reducers)
  - [Shallow Cloning](#shallow-cloning)
  - [What is a "simple" resource?](#what-is-a-simple-resource)

### Motivation

Use this project to drastically reduce Redux boilerplate when CRUD'ing remote
resources.

#### Features

✓ Reducers, action types, and initial state created for you  
✓ All features are opt-out: pick and choose what works for you  
✓ Store ["metadata"](#resource-metadata) for resources and resource lists  
✓ Works well with most APIs  
✓ Unopinionated technology decisions  
✓ Zero dependencies  

#### Why this project?

There are numerous projects with a similar goal as this library. One primary
difference between this library and other options is that this library
[stores metadata about resources separately from the resource itself](#resource-metadata),
which facilitates the creation of sophisticated UIs.

### Getting started

Install this library through [npm ⇗](https://www.npmjs.com).

`npm install redux-simple-resource`

Then, import it and create a resource reducer.

```js
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {resourceReducer} from 'redux-simple-resource';

const reducers = combineReducers({
  books: resourceReducer('books'),
  ...myOtherReducers
});

const store = createStore(reducers);
```

## API

The primary export of this library is a named export, `resourceReducer`. There
are several other named exports, which are utilities that may help you when
working with redux-simple-resource.

### `resourceReducer( resourceName [, initialState] [, options] )`

This is the default export of this library. We recommend passing a plural
version of your resource as `resourceName`. For instance, if this resource is
for "books", then `resourceName` should be "books", and not "book."

For multi-word resource names, use camel case. For instance, "cat people" should
be input as "catPeople".

This method returns a reducer.

The second parameter, `initialState`, is an optional object that can be used to
add additional initial state. The default initial state is:

```js
{
  // These are the actual resources that the server sends back.
  resources: [],
  // This is metadata about _specific_ resources. For instance, if a DELETE
  // is in flight for a book with ID 24, then you could find that here.
  // For more, see the Resource Meta guide in this README.
  meta: {},
  // This is metadata about the entire collection of resources. For instance,
  // on page load, you might fetch all of the resources. The request status for
  // that request would live here.
  // For more, see the Resource Meta guide in this README.
  listMeta: {
    readStatus: requestStatuses.NULL,
    createStatus: requestStatuses.NULL,
    createManyStatus: requestStatuses.NULL
  }
}
```

Example usage is below:

```js
const food = createResource('food', {
  // Add this property to the default initial state. Custom action reducers
  // could be used to modify this property. For more, see the `actionReducers`
  // option.
  peopleAreHungry: true
});
```

The optional `options` argument is documented below:

#### `options.plugins`

An array of functions that are called _after_ the built-in reducer behavior. You
can use
plugins to do two things:

1. Add support for custom action types
2. Customize the behavior of the built-in action types

Plugins have the same signature as a reducer: `(state, action)`. Plugins are
run in order.

Example usage is below:

```js
const food = createResource('books', {}, {
  plugins: [
    (state, action) => {
      switch action: {
        case 'CUSTOM_TYPE': {
          return {
            ...state,
            someData: action.someField
          }
        }
      }
    }
  ]
});
```

### `requestStatuses`

This is a named export from this library. It is an Object that represents
the different states that a request can be in.

```js
// requestStatuses
{
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  NULL: 'NULL'
}
```

For an explanation of what each of these means, refer to
[the Request Statuses guide](#request-statuses).

You will usually use this object to determine the state of requests for your
resources. Let's see what this might look like:

```js
import React, {Component} from 'react';
import {requestStatuses} from 'redux-simple-resource';

// Within a component's render, you may use it to conditionally render some JSX.
class MyComponent extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    // This is a value that is pulled from the store, and automatically kept
    // up-to-date for you. For more, see the Guides section below.
    const {listMeta} = this.props;

    // Render loading text if a retrieve request is in flight
    if (listMeta.readStatus === requestStatuses.PENDING) {
      return (<div>Loading data</div>);
    } else {
      return (<div>Not loading data</div>);
    }
  }
}
```

### actionTypes

redux-simple-resource comes with a series of action types for the different
CRUD operations.

The action types for read one, for instance, are:

```js
`READ_RESOURCE`
`READ_RESOURCE_FAIL`
`READ_RESOURCE_SUCCEED`
`READ_RESOURCE_RESET`
```

These four types reflect the four [Request Statuses](#request-statuses), as each of
these actions will update the Request Status in the resource's metadata.

Actions that operate on a single resource **must** include an "id" attribute to
uniquely identify the resource being acted upon.

You can attach as many properties as you want to your action types, but the
following properties have special meaning in redux-simple-resource:

| Name | Used for | Description |
|------|----------|-------------|
| type | all      | The type of the action |
| resourceName | all      | The name of the resource that is being affected by this action |
| id   | read, delete, update, create | Uniquely identifies the resource. |
| ids  | delete many | Uniquely identifies the resource. |
| resource | read, update, create | The data for the resource |
| resources | read many, update many, create many | An array of resources being affected by this action |
| replace | read, read many, update, update many | Whether or not to replace existing data |

#### The "replace" property

All `SUCCEED` action types support a `replace` property, which is whether or
not the updated data should replace existing data in the store. `replace` is
`true` by default, except for bulk updates (this inconsistency will be resolved
in v2.0. For more, see #106).

For single resources, passing `replace: false` will merge in the new data with
the existing data for that resource, if it exists. `replace: true` will replace
the old data with the new.

For multiple resources, `replace: false` will leave the existing list, but
merge in new resources with their existing versions, if they exist. New items
will be added at the end of the list. `replace: true` will completely remove the
existing list of resources, and their metadata, and replace it with the new
list.

Given the above description, it might make sense why update many has `replace`
set to `false` by default. You normally don't want to throw out the rest of the
list of resources when you do a bulk update on a subset of that list.

#### "Start" action type

Each CRUD action has a start action type, which represents the start of a
request. This will update the metadata for this particular action to be in
an `requestStatuses.PENDING` state.

These are the start action types:

```js
`READ_RESOURCE`
`CREATE_RESOURCE`
`UPDATE_RESOURCE`
`DELETE_RESOURCE`

`READ_MANY_RESOURCES`
`CREATE_MANY_RESOURCES`
`UPDATE_MANY_RESOURCES`
`DELETE_MANY_RESOURCES`
```

An example start action type is:

```js
{
   READ_RESOURCE,
  resourceName: 'books',
  id: 5
}
```

#### FAIL action type

This will update the metadata for the affected resources to be in an
`requestStatuses.FAILED` state.

These are the five FAIL action types:

```js
`READ_RESOURCE_FAIL`
`CREATE_RESOURCE_FAIL`
`UPDATE_RESOURCE_FAIL`
`DELETE_RESOURCE_FAIL`

`READ_MANY_RESOURCES_FAIL`
`CREATE_MANY_RESOURCES_FAIL`
`UPDATE_MANY_RESOURCES_FAIL`
`DELETE_MANY_RESOURCES_FAIL`
```

An example fail action type is:

```js
{
   READ_RESOURCE_FAIL,
  resourceName: 'books',
  id: 5
}
```

#### SUCCEED action type

This will update the metadata for the affected resources to be in an
`requestStatuses.SUCCEED` state. It will also update the resources themselves in
your store.

For reads and writes, the data that you pass in will replace existing data in
the store unless you include `replace: false` in your action.

> Note: Bulk updates are an exception: they have `replace: false` as the
  default.

Example success actions are:

```js
{
  type: 'UPDATE_RESOURCE_SUCCESS',
  resourceName: 'books',
  id: 10,
  resource: {
    id: 10,
    name: 'Twilight',
    pages: 325
  }
}
```

```js
{
  type: 'READ_MANY_RESOURCES_SUCCESS',
  resourceName: 'books',
  resources: [
    {id: 2, name: 'Moby Dick'},
    {id: 10, name: 'Twilight'},
  ],
  replace: false
}
```

```js
{
  type: 'DELETE_RESOURCE_SUCCESS',
  resourceName: 'books',
  id: 10
}
```

#### RESET action type

This action type is intended to be used to update a particular request status
from a non-`NULL` value back to `NULL`. For instance, consider if a request
fails, and you use the metadata in the store to conditionally render an alert
to the user. If the user dismisses the alert, then you may wish to fire a
`RESET` action type to reset the state back to `NULL`, which would cause the
alert to disappear.

Also, if you abort a request, then you may also choose to fire this action type.

An example reset action is:

```js
{
  type: 'DELETE_RESOURCE_RESET',
  resourceName: 'books',
  id: 10
}
```

#### Custom Action Types

Coming soon.

### `updateResourceMeta({ meta, newMeta, id, replace })`

Use this method to update the metadata for a single resource. `meta`
is **all** of the existing meta, `newMeta` is the new meta to assign to
the resource, and `id` is the ID of the resource that you are updating.

This does not directly modify the `meta` object; instead, it returns
a shallow clone.

| Name | Required | Description |
|------|-------------|----------|
|meta | Yes | The current meta object for **all** resources |
|newMeta | Yes | The new metadata |
|id | Yes | The ID of the resource to update |
|replace | No | Whether or not to replace any existing meta for this resource. Defaults to `false` |

### `updateManyResourceMetas({ meta, newMeta, ids, replace })`

Similar to `updateResourceMeta`, but this enables you to update a list of `ids`
with the same `newMeta`. `meta` is **all** of the existing meta.

If `replace: true` is passed, then the existing meta is discarded, and what you
pass in will be all of the meta in the store.

Pass `replace: false` to keep all existing meta, and to merge in `newMeta` with
any existing metadata for each resource. (default behavior)

This method does not enable you to update multiple IDs with different metadata.

| Name | Required | Description |
|------|-------------|----------|
|meta | Yes | The current meta object for **all** resources. |
|newMeta | Yes | The new metadata |
|ids | Yes | An array of IDs to update |
|replace | No | Whether or not to replace the current list, or to merge in the new data. Defaults to `false` |

### `upsertResource({ resources, resource, id, replace })`

Insert or update a resource to the list of resources.

| Name | Required | Description |
|------|-------------|----------|
|resources | Yes | The current list of resources from the store |
|resource | Yes | The new resource to add |
|id | Yes | The id value of the new resource |
|replace | No | Whether or not to replace the resource (if it already exists). Defaults to `false` |

### `upsertManyResources({ resources, newResources, replace })`

Insert or update a list of resources to the list of resources.

| Name | Required | Description |
|------|-------------|----------|
|resources | Yes | The current list of resources from the store |
|newResources | Yes | The new resources to add |
|replace | No | Whether or not to replace the existing resource list, or to merge new with old. Defaults to `false` |

## Guides

### Resource Metadata

A resource typically has attributes associated with it. For instance, if your
application displays cats, then maybe each "cat" resource has a `name` and
`age` associated with it. This is the data for that resource.

In client side applications, it is frequently the case that there is a lot of
_other_ data associated with a particular resource, too. For instance, you may
want to track if the user has "selected" a particular cat in the UI, or if
they have made a request to delete a particular cat. This extra information is
"metadata."

In redux-simple-resource, metadata for each resource is stored in a separate
location in the store. There is also metadata associated with the entire _list_
of resources.

redux-simple-resource comes with some built-in metadata for every resource out
of the box. The metadata that it gives you are related to CRUD actions. If you
fire off a request to delete a resource, for instance, then
redux-simple-resource will take care of updating that resource's metadata with
[the status of that request](#request-statuses).

You can use this built-in metadata to easily show loading spinners, error
messages, success messages, and other UI features that conditionally appear
based on the status of requests against a resource.

And, of course, you can add in your own metadata, too.

#### Individual Resource Metadata

The built-in metadata for individual resources is stored in each store slice
as `meta`. This is an object, where each key is the ID of your object.

The built-in metadata for each resource is below:

```js
{
  // The status of any existing request to update the resource
  updateStatus: requestStatuses.NULL,
  // The status of any existing request to fetch the resource
  readStatus: requestStatuses.NULL,
  // The status of an any existing request to delete the resource. Note that
  // this will never be "SUCCEEDED," as a successful delete removes the
  // resource, and its metadata, from the store.
  deleteStatus: requestStatuses.NULL
}
```

For instance, if we had two cats, and the first one had a request in flight to
delete it, then a piece of the store might look like:

```js
// store.cats
{
  resources: [
    {id: 1, name: 'sarah'},
    {id: 6, name: 'brian'},
  ]
  meta: {
    1: {
      updateStatus: requestStatuses.NULL,
      // The request is in flight!
      readStatus: requestStatuses.PENDING,
      deleteStatus: requestStatuses.NULL,
    },
    6: {
      updateStatus: requestStatuses.NULL,
      readStatus: requestStatuses.NULL,
      deleteStatus: requestStatuses.NULL,
    }
  },
  ...otherThings
}
```

You are free to add custom metadata for every resource.

> Note: We do not recommend modifying the built-in meta values directly. Let
redux-simple-resource's reducers manage those for you.

#### Resource List Metadata

Sometimes, metadata needs to be associated with the entire list of resources.
For instance, in REST, to create a resource you must make a POST request to the
list of resources to. Following this pattern, the [request status](#request-statuses)
of create requests is stored in the list metadata in redux-simple-resource.

The default list metadata is:

```js
listMeta: {
  readStatus: requestStatuses.NULL,
  createStatus: requestStatuses.NULL,
  createManyStatus: requestStatuses.NULL
}
```

You can also store your own custom metadata on the list. For instance, if a
user can select a series of items in a list, you may choose to keep an array
of selected IDs in the `listMeta`. Or, you might instead add a
`selected: true` boolean to each resource's individual meta. Both solutions
would work fine.

### Request Statuses

Network requests go through a series of states, such as being in flight, or
succeeding, or being aborted. The metadata associated with each request reflects
each of these statuses.

This library stores four possible states for each request in Redux. These
five states are available as a [named export from the module](#requeststatuses).

The states are:

##### `PENDING`

The request has been sent, but a response has not yet been received. This state
is colloquially referred to as being "in flight."

##### `SUCCEEDED`

A success response was returned.

##### `FAILED`

An error response was returned.

##### `NULL`

This status is applied to a request that has not begun, or to reset a request
that you do not care about. For instance, when a resource is first created, its
read, update, and delete request statuses are all `NULL`, because none of those
requests have been made.

When requests have been made, there may also come a time when your application
no longer cares about the result of a request. At that time, you have the option
to set the request status to `NULL` by dispatching the `RESET` action type.

Two common use cases for the `NULL` are:

1. aborting a request
2. dismissing an alert that appears whenever a status is `SUCCEEDED` or `FAILED`

If you do not need to use the `NULL` status, then that is fine. There are many
situations where you do not need to reset the status of a request.

### Structure of the Store

redux-simple-resource creates the overall structure of the store for resources.
The default initial state that is created for you represents this overall
structure:

```js
{
  // These are the actual resources that the server sends back.
  resources: [],
  // This is metadata about _specific_ resources. For instance, if a DELETE
  // is in flight for a book with ID 24, then you could find that here.
  // For more, see the Resource Meta guide in this README.
  meta: {},
  // This is metadata about the entire collection of resources. For instance,
  // on page load, you might fetch all of the resources. The request status for
  // that request would live here.
  // For more, see the Resource Meta guide in this README.
  listMeta: {
    readStatus: requestStatuses.NULL,
    createStatus: requestStatuses.NULL,
    createManyStatuses: requestStatuses.NULL
  }
}
```

For instance, if you're building a component that interacts with a particular
book resource, then you may use the following `mapStateToProps`:

```js
mapStateToProps(state, props) {
  // Grab our book
  const book = _.find(state.books.resources, {id: props.bookId});
  // Grab its metadata
  const bookMeta = state.meta[props.bookId];

  // Pass that into the component
  return {
    book,
    bookMeta
  };
}
```

### Customizing the Default Reducers

Sometimes, the default reducers may not do exactly what you want. Maybe you
want to handle a particular action in a different way. Or perhaps you want to
add more metadata with a different type.

If the way a particular action type is reduced is not what you want, then you
do not need to dispatch an action with that action type.

If you wish to add additional data to the store after a particular action, then
we recommend that you fire a separate, custom action immediately after the
default one. For instance,

```js
// Dispatch the default action
dispatch({type: 'READ_RESOURCE_SUCCESS', resourceName: 'books', id: 5});
// Dispatch your default action
dispatch({type: 'CUSTOM_ACTION', resourceName: 'books', id: 5});
```

If you're worried about performance, give it a try. If you can demonstrate that
this pattern causes performance issues, then we will consider alternative
solutions.

tl;dr: we do not recommend attempting to modify the built-in reducers. Either
don't dispatch those action types, or dispatch separate actions with custom
types before or after the built-in types.

### Shallow Cloning

redux-simple-resource makes updates to the store via shallow cloning. This
system works well if you make it a habit to never modify data from your store.

There are tools like Immutable to strongly enforce this, but you can also work
on teams on large products and not use Immutable.

If you absolutely need deep cloning, or Immutable support, rather than shallow
cloning, then know that there are plans to add a hook to replace the shallow
cloning with a custom cloning function. If this interests you, then follow along
on [this issue](https://github.com/jmeas/redux-simple-resource/issues/11).

### What is a simple resource?

The notion of "simple" refers to APIs that do not have a specification for
compound documents. Compound documents are documents that contain primary
resources, as well as resources that they have relationships with (one-to-one,
many-to-one, etc.).

For instance, consider fetching a "cat" resource. If you also wish to fetch
the cat's "owner" and its "location" in one request, what does the response look
like? Your API may not support this at all. Or it may merge all of the
attributes from all of these objects together, requiring the client to pick them
apart. In both of those situations, the resource is what I am calling "simple."

On the other hand, your API may return these other resources in a "related"
key, which has a list of other resources, as well as their type. This formal
support for relationships enables you to build abstractions around them.

In summary, your API returns simple resources if:

- it does _not_ support returning compound documents at all. Every request is
  always against a single resource, and not the other resources it has
  relationships with.
- it _does_ support returning compound documents, but it is done in an ad hoc
  way. In other words, there is no specification or format that applies to
  every resource, and every relationship.

Building APIs that support relationships in a consistent way is more difficult,
and therefore, most APIs return simple resources.

An example of a system that _does_ provide a formal relationship definition is
[JSON API]((http://jsonapi.org/)).

#### What if my API supports more than "simple" resources?

Relationship support is on the way. See #96 for more information.
