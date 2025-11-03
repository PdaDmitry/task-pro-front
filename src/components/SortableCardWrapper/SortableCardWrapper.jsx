// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';

// const SortableCardWrapper = ({ id, children }) => {
//   const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

//   const style = {
//     transform: CSS.Transform.toString(transform),
//     transition,
//     cursor: 'grab',
//   };

//   return (
//     <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
//       {children}
//     </div>
//   );
// };

// export default SortableCardWrapper;

// src/components/SortableCardWrapper/SortableCardWrapper.jsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import css from './SortableCardWrapper.module.css';

const SortableCardWrapper = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: String(id) });

  const style = {
    transform: CSS.Transform.toString(transform) || undefined,
    transition: transition || undefined,
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

export default SortableCardWrapper;
