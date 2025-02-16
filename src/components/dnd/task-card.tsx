import { useDraggable } from "@dnd-kit/core";
import { Task } from "../../types";

interface TaskCardProps {
  task: Task;
}

const TaskCard = ({ task }: TaskCardProps) => {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className={`bg-slate-800 p-4 rounded-lg shadow-md space-y-2.5 select-none ${
        isDragging ? "cursor-grabbing shadow-lg" : "cursor-grab"
      }`}
      style={style}
    >
      <h3 className='text-base text-slate-300'>{task.title}</h3>

      <p className='text-sm text-slate-400'>{task.description}</p>
    </div>
  );
};

export default TaskCard;
