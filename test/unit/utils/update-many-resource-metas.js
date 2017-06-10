import {updateManyResourceMetas} from '../../../src';

describe('updateManyResourceMetas', function() {
  beforeEach(() => {
    this.meta = {
      1: {
        isSelected: false,
        otherData: {
          hungry: true,
          food: 'pizza'
        }
      },
      2: {thirsty: true},
      3: {what: false}
    };
  });

  describe('replace: true', () => {
    it('should only keep metadata that is passed in', () => {
      const result = updateManyResourceMetas({
        meta: this.meta,
        newMeta: {isSelected: true},
        ids: [1, 2, 5],
        replace: true
      });

      expect(result).to.deep.equal({
        1: {isSelected: true},
        2: {isSelected: true},
        5: {isSelected: true}
      });

      // The original `meta` is shallow cloned
      expect(result).to.not.equal(this.meta);
      // The existing item is not modified
      expect(result[1]).to.not.equal(this.meta[1]);
      expect(result[2]).to.not.equal(this.meta[2]);
    });
  });

  describe('replace: false', () => {
    it('should keep other list items and merge in the new results', () => {
      const result = updateManyResourceMetas({
        meta: this.meta,
        newMeta: {isSelected: true},
        ids: [1, 2, 5],
        replace: false
      });

      expect(result).to.deep.equal({
        1: {
          isSelected: true,
          otherData: {
            hungry: true,
            food: 'pizza'
          }
        },
        2: {thirsty: true, isSelected: true},
        3: {what: false},
        5: {isSelected: true}
      });

      // The original `meta` is shallow cloned
      expect(result).to.not.equal(this.meta);
      // The existing item is not modified
      expect(result[1]).to.not.equal(this.meta[1]);
      expect(result[2]).to.not.equal(this.meta[2]);
      // Unrelated items pass through unchanged
      expect(result[3]).to.equal(this.meta[3]);
    });
  });
});
