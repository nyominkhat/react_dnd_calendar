import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { type Column, Task } from "../../types";
import TaskCard from "./task-card";

interface ColumnProps {
  tasks: Task[];
  column: Column;
}

const Column = ({ tasks, column }: ColumnProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`w-80 rounded-lg transition-all ${
        isOver ? "bg-white" : "bg-none"
      }`}
    >
      <div className='bg-white p-4 h-fit rounded-lg'>
        <h2 className='font-semibold text-slate-600 mb-5'>{column.title}</h2>

        <SortableContext items={tasks} strategy={verticalListSortingStrategy}>
          <div className='space-y-4'>
            {tasks.map((item) => (
              <TaskCard key={item.id} task={item} />
            ))}
          </div>
        </SortableContext>
      </div>
    </div>
  );
};

export default Column;
