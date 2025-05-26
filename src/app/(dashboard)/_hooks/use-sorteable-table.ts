"use client";

import {
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  KeyboardSensor,
  DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useId, useMemo } from "react";
import { KeyedMutator } from "swr";

interface UseSortableTableOptions<T> {
  data: T[];
  setData?: (updater: (prev: T[]) => T[]) => void;
  mutate?: KeyedMutator<T[]>;
}

export function useSortableTable<T extends { id: UniqueIdentifier }>({
  data,
  setData,
  mutate,
}: UseSortableTableOptions<T>) {
  const sortableId = useId();

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor),
  );

  const dataIds = useMemo(() => data.map((item) => item.id), [data]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const oldIndex = dataIds.indexOf(active.id);
      const newIndex = dataIds.indexOf(over.id);

      const newOrder = arrayMove(data, oldIndex, newIndex);

      if (mutate) {
        void mutate(newOrder, false);
      } else if (setData) {
        setData(() => newOrder);
      }
    }
  }

  return {
    sortableId,
    sensors,
    dataIds,
    handleDragEnd,
  };
}
