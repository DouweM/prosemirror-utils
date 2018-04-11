import {
  createEditor,
  doc,
  p,
  strong,
  atom,
  toEqualDocument
} from '../test-helpers';
import { Fragment } from 'prosemirror-model';
import { canInsert, removeNodeAtPos } from '../src/helpers';

describe('helpers', () => {
  describe('canInsert', () => {
    it('should return true if insertion of a given node is allowed at the current cursor position', () => {
      const { state } = createEditor(doc(p('one<cursor>')));
      const { selection: { $from } } = state;
      const node = state.schema.nodes.atom.createChecked();
      expect(canInsert($from, node)).toBe(true);
    });

    it('should return true if insertion of a given Fragment is allowed at the current cursor position', () => {
      const { state } = createEditor(doc(p('one<cursor>')));
      const { selection: { $from } } = state;
      const node = state.schema.nodes.atom.createChecked();
      expect(canInsert($from, Fragment.from(node))).toBe(true);
    });

    it('should return false a insertion of a given node is not allowed', () => {
      const { state } = createEditor(
        doc(p(strong('zero'), 'o<cursor>ne'), p('three'))
      );
      const { selection: { $from } } = state;
      const node = state.schema.nodes.paragraph.createChecked(
        {},
        state.schema.text('two')
      );
      expect(canInsert($from, node)).toBe(false);
    });

    it('should return false a insertion of a given Fragment is not allowed', () => {
      const { state } = createEditor(
        doc(p(strong('zero'), 'o<cursor>ne'), p('three'))
      );
      const { selection: { $from } } = state;
      const node = state.schema.nodes.paragraph.createChecked(
        {},
        state.schema.text('two')
      );
      expect(canInsert($from, Fragment.from(node))).toBe(false);
    });
  });

  describe('removeNodeAtPos', () => {
    it('should remove a block top level node at the given position', () => {
      const { state: { tr } } = createEditor(doc(p('x'), p('one')));
      const newTr = removeNodeAtPos(4)(tr);
      expect(newTr).not.toBe(tr);
      toEqualDocument(newTr.doc, doc(p('x')));
    });

    it('should remove a nested inline node at the given position', () => {
      const { state: { tr } } = createEditor(doc(p('one', atom())));
      const newTr = removeNodeAtPos(5)(tr);
      expect(newTr).not.toBe(tr);
      toEqualDocument(newTr.doc, doc(p('one')));
    });
  });
});
