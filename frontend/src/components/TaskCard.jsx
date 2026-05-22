import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit2, Trash2, GripVertical } from 'lucide-react';

export const TaskCard = ({ task, onStatusChange, onDelete, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id.toString(),
    data: {
      type: 'task',
      task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const getStatusButtonText = (status) => {
    switch(status) {
      case 'todo': return '▶ Начать';
      case 'in-progress': return '✓ Завершить';
      case 'done': return '↺ Вернуть';
      default: return 'Сменить статус';
    }
  };

  const getStatusButtonColor = (status) => {
    switch(status) {
      case 'todo': return 'bg-green-100 hover:bg-green-200 text-green-700';
      case 'in-progress': return 'bg-blue-100 hover:bg-blue-200 text-blue-700';
      case 'done': return 'bg-gray-100 hover:bg-gray-200 text-gray-700';
      default: return 'bg-blue-100 hover:bg-blue-200 text-blue-700';
    }
  };

  return (
    <div ref={setNodeRef} style={style} className={`card p-4 hover:shadow-lg transition-all duration-200 group ${isDragging ? 'cursor-grabbing' : ''}`}>
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="h-4 w-4 text-gray-400 hover:text-gray-600" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
          {task.description && (
            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <button
              onClick={() => onStatusChange(task.id, task.status)}
              className={`text-sm px-3 py-1 rounded-lg transition duration-200 ${getStatusButtonColor(task.status)}`}
            >
              {getStatusButtonText(task.status)}
            </button>
            <div className="flex gap-2">
              <button
                onClick={onEdit}
                className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition duration-200"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
