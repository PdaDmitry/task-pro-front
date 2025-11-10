import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import css from './SortableColumnWrapper.module.css';

const SortableColumnWrapper = ({ id, data = {}, children }) => {
  ///////////data = {}////////
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(id), data }); ////////data///////////

  const style = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition: transition || undefined,
    // opacity: isDragging ? 0.5 : 1,/////////////////////
    zIndex: isDragging ? 9999 : undefined,
  };

  const childWithProps = React.isValidElement(children)
    ? React.cloneElement(children, {
        dragActivatorRef: setActivatorNodeRef,
        dragListeners: listeners,
        dragAttributes: attributes,
        isDragging,
      })
    : children;

  return (
    <li ref={setNodeRef} style={style} className={isDragging ? css.dragActive : ''}>
      {childWithProps}
    </li>
  );
};

export default SortableColumnWrapper;
