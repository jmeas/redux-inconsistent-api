import _ from 'lodash';
import simpleResource from '../../src';

describe('actionTypes', function() {
  it('should be an object', () => {
    const result = simpleResource('hello');
    expect(result.actionTypes).to.be.an('object');
  });

  describe('create', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello').actionTypes;
      expect(actionTypes.CREATE_HELLO).to.equal('CREATE_HELLO');
      expect(actionTypes.CREATE_HELLO_SUCCEED).to.equal('CREATE_HELLO_SUCCEED');
      expect(actionTypes.CREATE_HELLO_FAIL).to.equal('CREATE_HELLO_FAIL');
      expect(actionTypes.CREATE_HELLO_ABORT).to.equal('CREATE_HELLO_ABORT');
      expect(actionTypes.CREATE_HELLO_RESET).to.equal('CREATE_HELLO_RESET');
    });
  });

  describe('createMany', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello').actionTypes;
      expect(actionTypes.CREATE_MANY_HELLOS).to.equal('CREATE_MANY_HELLOS');
      expect(actionTypes.CREATE_MANY_HELLOS_SUCCEED).to.equal('CREATE_MANY_HELLOS_SUCCEED');
      expect(actionTypes.CREATE_MANY_HELLOS_FAIL).to.equal('CREATE_MANY_HELLOS_FAIL');
      expect(actionTypes.CREATE_MANY_HELLOS_ABORT).to.equal('CREATE_MANY_HELLOS_ABORT');
      expect(actionTypes.CREATE_MANY_HELLOS_RESET).to.equal('CREATE_MANY_HELLOS_RESET');
    });
  });

  describe('read', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello').actionTypes;
      expect(actionTypes.READ_HELLO).to.equal('READ_HELLO');
      expect(actionTypes.READ_HELLO_SUCCEED).to.equal('READ_HELLO_SUCCEED');
      expect(actionTypes.READ_HELLO_FAIL).to.equal('READ_HELLO_FAIL');
      expect(actionTypes.READ_HELLO_ABORT).to.equal('READ_HELLO_ABORT');
      expect(actionTypes.READ_HELLO_RESET).to.equal('READ_HELLO_RESET');
    });
  });

  describe('readMany', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello').actionTypes;
      expect(actionTypes.READ_MANY_HELLOS).to.equal('READ_MANY_HELLOS');
      expect(actionTypes.READ_MANY_HELLOS_SUCCEED).to.equal('READ_MANY_HELLOS_SUCCEED');
      expect(actionTypes.READ_MANY_HELLOS_FAIL).to.equal('READ_MANY_HELLOS_FAIL');
      expect(actionTypes.READ_MANY_HELLOS_ABORT).to.equal('READ_MANY_HELLOS_ABORT');
      expect(actionTypes.READ_MANY_HELLOS_RESET).to.equal('READ_MANY_HELLOS_RESET');
    });
  });

  describe('update', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello').actionTypes;
      expect(actionTypes.UPDATE_HELLO).to.equal('UPDATE_HELLO');
      expect(actionTypes.UPDATE_HELLO_SUCCEED).to.equal('UPDATE_HELLO_SUCCEED');
      expect(actionTypes.UPDATE_HELLO_FAIL).to.equal('UPDATE_HELLO_FAIL');
      expect(actionTypes.UPDATE_HELLO_ABORT).to.equal('UPDATE_HELLO_ABORT');
      expect(actionTypes.UPDATE_HELLO_RESET).to.equal('UPDATE_HELLO_RESET');
    });
  });

  describe('updateMany', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello').actionTypes;
      expect(actionTypes.UPDATE_MANY_HELLOS).to.equal('UPDATE_MANY_HELLOS');
      expect(actionTypes.UPDATE_MANY_HELLOS_SUCCEED).to.equal('UPDATE_MANY_HELLOS_SUCCEED');
      expect(actionTypes.UPDATE_MANY_HELLOS_FAIL).to.equal('UPDATE_MANY_HELLOS_FAIL');
      expect(actionTypes.UPDATE_MANY_HELLOS_ABORT).to.equal('UPDATE_MANY_HELLOS_ABORT');
      expect(actionTypes.UPDATE_MANY_HELLOS_RESET).to.equal('UPDATE_MANY_HELLOS_RESET');
    });
  });

  describe('delete', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello').actionTypes;
      expect(actionTypes.DELETE_HELLO).to.equal('DELETE_HELLO');
      expect(actionTypes.DELETE_HELLO_SUCCEED).to.equal('DELETE_HELLO_SUCCEED');
      expect(actionTypes.DELETE_HELLO_FAIL).to.equal('DELETE_HELLO_FAIL');
      expect(actionTypes.DELETE_HELLO_ABORT).to.equal('DELETE_HELLO_ABORT');
      expect(actionTypes.DELETE_HELLO_RESET).to.equal('DELETE_HELLO_RESET');
    });
  });

  describe('deleteMany', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello').actionTypes;
      expect(actionTypes.DELETE_MANY_HELLOS).to.equal('DELETE_MANY_HELLOS');
      expect(actionTypes.DELETE_MANY_HELLOS_SUCCEED).to.equal('DELETE_MANY_HELLOS_SUCCEED');
      expect(actionTypes.DELETE_MANY_HELLOS_FAIL).to.equal('DELETE_MANY_HELLOS_FAIL');
      expect(actionTypes.DELETE_MANY_HELLOS_ABORT).to.equal('DELETE_MANY_HELLOS_ABORT');
      expect(actionTypes.DELETE_MANY_HELLOS_RESET).to.equal('DELETE_MANY_HELLOS_RESET');
    });
  });

  describe('custom', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello', {
        actionReducers: [
          {
            actionType: 'WHO_IS_HUNGRY',
            reducer(state) {
              return state;
            }
          }
        ]
      }).actionTypes;
      expect(actionTypes.WHO_IS_HUNGRY).to.equal('WHO_IS_HUNGRY');
    });
  });

  describe('only allowing readMany', () => {
    it('should have the right actionTypes', () => {
      const actionTypes = simpleResource('hello', {
        supportedActions: {
          create: false,
          read: false,
          update: false,
          del: false,

          createMany: false,
          readMany: true,
          updateMany: false,
          delMany: false
        }
      }).actionTypes;
      expect(_.size(actionTypes)).to.equal(5);
      expect(actionTypes.READ_MANY_HELLOS).to.equal('READ_MANY_HELLOS');
      expect(actionTypes.READ_MANY_HELLOS_SUCCEED).to.equal('READ_MANY_HELLOS_SUCCEED');
      expect(actionTypes.READ_MANY_HELLOS_FAIL).to.equal('READ_MANY_HELLOS_FAIL');
      expect(actionTypes.READ_MANY_HELLOS_ABORT).to.equal('READ_MANY_HELLOS_ABORT');
      expect(actionTypes.READ_MANY_HELLOS_RESET).to.equal('READ_MANY_HELLOS_RESET');
    });
  });

  describe('passing in various names', () => {
    it('should have the right actionTypes', () => {
      const helloThereActionTypes = simpleResource('helloThere').actionTypes;
      expect(helloThereActionTypes.READ_MANY_HELLO_THERES).to.equal('READ_MANY_HELLO_THERES');

      const bookCaseActionTypes = simpleResource('bookCase').actionTypes;
      expect(bookCaseActionTypes.READ_MANY_BOOK_CASES).to.equal('READ_MANY_BOOK_CASES');

      const jsonViewerActionTypes = simpleResource('JSONViewer').actionTypes;
      expect(jsonViewerActionTypes.READ_MANY_JSON_VIEWERS).to.equal('READ_MANY_JSON_VIEWERS');

      const catPersonActionTypes = simpleResource('catPerson', {pluralForm: 'catPeople'}).actionTypes;
      expect(catPersonActionTypes.READ_MANY_CAT_PEOPLE).to.equal('READ_MANY_CAT_PEOPLE');
    });
  });
});
