import {resourceReducer, requestStatuses} from '../../../src';

describe('reducers: deleteMany', function() {
  it('should handle `DELETE_MANY_RESOURCES`', () => {
    const reducer = resourceReducer('hellos', {
      resources: [
        {id: 1},
        {id: 3},
        {id: 4},
      ]
    });

    const reduced = reducer(undefined, {
      type: 'DELETE_MANY_RESOURCES',
      resourceName: 'hellos',
      ids: [3, 4]
    });

    expect(reduced).to.deep.equal({
      resources: [
        {id: 1},
        {id: 3},
        {id: 4},
      ],
      meta: {
        3: {
          deleteStatus: requestStatuses.PENDING
        },
        4: {
          deleteStatus: requestStatuses.PENDING
        }
      },
      listMeta: {
        readStatus: requestStatuses.NULL,
        createManyStatus: requestStatuses.NULL,
        createStatus: requestStatuses.NULL
      }
    });
  });

  it('should handle `DELETE_MANY_RESOURCES_FAIL`', () => {
    const reducer = resourceReducer('hellos', {
      resources: [
        {id: 1},
        {id: 3},
        {id: 4},
      ]
    });

    const reduced = reducer(undefined, {
      type: 'DELETE_MANY_RESOURCES_FAIL',
      resourceName: 'hellos',
      ids: [3, 4]
    });

    expect(reduced).to.deep.equal({
      resources: [
        {id: 1},
        {id: 3},
        {id: 4},
      ],
      meta: {
        3: {
          deleteStatus: requestStatuses.FAILED
        },
        4: {
          deleteStatus: requestStatuses.FAILED
        }
      },
      listMeta: {
        readStatus: requestStatuses.NULL,
        createManyStatus: requestStatuses.NULL,
        createStatus: requestStatuses.NULL
      }
    });
  });

  it('should handle `DELETE_MANY_RESOURCES_RESET`', () => {
    const reducer = resourceReducer('hellos', {
      resources: [
        {id: 1},
        {id: 3},
        {id: 4},
      ]
    });

    const reduced = reducer(undefined, {
      type: 'DELETE_MANY_RESOURCES_RESET',
      resourceName: 'hellos',
      ids: [3, 4]
    });

    expect(reduced).to.deep.equal({
      resources: [
        {id: 1},
        {id: 3},
        {id: 4},
      ],
      meta: {
        3: {
          deleteStatus: requestStatuses.NULL
        },
        4: {
          deleteStatus: requestStatuses.NULL
        }
      },
      listMeta: {
        readStatus: requestStatuses.NULL,
        createManyStatus: requestStatuses.NULL,
        createStatus: requestStatuses.NULL
      }
    });
  });

  it('should handle `DELETE_MANY_RESOURCES_SUCCEED`', () => {
    const reducer = resourceReducer('hellos', {
      resources: [
        {id: 1},
        {id: 3},
        {id: 4},
      ],
      meta: {
        1: {
          name: 'what'
        },
        3: {
          deleteStatus: 'sandwiches'
        }
      }
    });

    const reduced = reducer(undefined, {
      type: 'DELETE_MANY_RESOURCES_SUCCEED',
      resourceName: 'hellos',
      ids: [3, 4]
    });

    expect(reduced).to.deep.equal({
      resources: [
        {id: 1},
      ],
      meta: {
        1: {
          name: 'what'
        },
        3: null,
        4: null
      },
      listMeta: {
        readStatus: requestStatuses.NULL,
        createManyStatus: requestStatuses.NULL,
        createStatus: requestStatuses.NULL
      }
    });
  });
});
