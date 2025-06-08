declare module 'react-beautiful-dnd' {
  import * as React from 'react';

  export interface DraggableProvided {
    draggableProps: {
      style?: React.CSSProperties;
      [key: string]: any;
    };
    dragHandleProps: {
      [key: string]: any;
    } | null;
    innerRef: (element: HTMLElement | null) => void;
  }

  export interface DraggableStateSnapshot {
    isDragging: boolean;
    isDropAnimating: boolean;
    isClone: boolean;
    dropAnimation: {
      duration: number;
      curve: string;
      moveTo: {
        x: number;
        y: number;
      };
    } | null;
    draggingOver: string | null;
    combineWith: string | null;
    combineTargetFor: string | null;
    mode: 'FLUID' | 'SNAP' | null;
  }

  export interface DraggableProps {
    draggableId: string;
    index: number;
    children: (provided: DraggableProvided, snapshot: DraggableStateSnapshot) => React.ReactNode;
    isDragDisabled?: boolean;
    disableInteractiveElementBlocking?: boolean;
    shouldRespectForcePress?: boolean;
  }

  export interface DroppableProvided {
    innerRef: (element: HTMLElement | null) => void;
    placeholder?: React.ReactNode;
    droppableProps: {
      [key: string]: any;
    };
  }

  export interface DroppableStateSnapshot {
    isDraggingOver: boolean;
    draggingOverWith: string | null;
    draggingFromThisWith: string | null;
    isUsingPlaceholder: boolean;
  }

  export interface DroppableProps {
    droppableId: string;
    children: (provided: DroppableProvided, snapshot: DroppableStateSnapshot) => React.ReactNode;
    type?: string;
    mode?: 'standard' | 'virtual';
    isDropDisabled?: boolean;
    isCombineEnabled?: boolean;
    direction?: 'horizontal' | 'vertical';
    ignoreContainerClipping?: boolean;
    renderClone?: (provided: DraggableProvided, snapshot: DraggableStateSnapshot, rubric: any) => React.ReactNode;
    getContainerForClone?: () => HTMLElement;
  }

  export interface DropResult {
    draggableId: string;
    type: string;
    source: {
      droppableId: string;
      index: number;
    };
    destination: {
      droppableId: string;
      index: number;
    } | null;
    reason: 'DROP' | 'CANCEL';
    combine?: {
      draggableId: string;
      droppableId: string;
    };
    mode: 'FLUID' | 'SNAP';
  }

  export interface DragDropContextProps {
    onDragEnd: (result: DropResult) => void;
    onDragStart?: (initial: any) => void;
    onDragUpdate?: (update: any) => void;
    children: React.ReactNode;
  }

  export class Draggable extends React.Component<DraggableProps> {}
  export class Droppable extends React.Component<DroppableProps> {}
  export class DragDropContext extends React.Component<DragDropContextProps> {}
} 