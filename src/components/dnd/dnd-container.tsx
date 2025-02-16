import { useState } from "react";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import Column from "./column";
import { COLUMNS, INITIAL_TASKS } from "../../constants";
import { TaskStatus } from "../../types";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

const DndContainer = () => {
  const [tasks, setTasks] = useState(INITIAL_TASKS);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) return;

    const taskId = active.id as string;
    const newStatus = over?.id as TaskStatus;

    setTasks(() =>
      tasks.map((item) =>
        item.id === taskId ? { ...item, status: newStatus } : item
      )
    );
  };

  return (
    <div className='min-w-screen min-h-screen bg-slate-700 py-10'>
      <div className='container mx-auto flex gap-10 items-stretch'>
        <DndContext
          onDragEnd={onDragEnd}
          sensors={sensors}
          collisionDetection={closestCenter}
        >
          {COLUMNS.map((item) => (
            <Column
              key={item.id}
              column={item}
              tasks={tasks.filter((task) => task.status === item.id)}
            />
          ))}
        </DndContext>
      </div>
    </div>
  );
};

export default DndContainer;
