import { useState } from 'react';
import { X, Calendar, Flag } from 'lucide-react';

export const EditTaskModal = ({ task, onClose, onSave }) => {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [dueDate, setDueDate] = useState(task.dueDate || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(task.id, title, description, priority, dueDate);
  };

  const getPriorityColor = (p) => {
    switch(p) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 transform transition-all animate-slide-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            ✏️ Редактировать задачу
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Название задачи */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Название задачи *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              required
              autoFocus
            />
          </div>

          {/* Описание */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Описание
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows="3"
              placeholder="Подробное описание задачи..."
            />
          </div>

          {/* Приоритет */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Flag className="h-4 w-4" />
              Приоритет
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPriority('high')}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-1 ${
                  priority === 'high' 
                    ? 'bg-red-500 border-red-600 text-white shadow-md transform scale-105' 
                    : 'bg-white border-gray-300 text-red-600 hover:bg-red-50'
                }`}
              >
                <span className="text-lg">🔴</span>
                <span className="text-sm font-medium">Высокий</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('medium')}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-1 ${
                  priority === 'medium' 
                    ? 'bg-yellow-500 border-yellow-600 text-white shadow-md transform scale-105' 
                    : 'bg-white border-gray-300 text-yellow-600 hover:bg-yellow-50'
                }`}
              >
                <span className="text-lg">🟡</span>
                <span className="text-sm font-medium">Средний</span>
              </button>
              <button
                type="button"
                onClick={() => setPriority('low')}
                className={`px-3 py-2 rounded-lg border transition-all duration-200 flex items-center justify-center gap-1 ${
                  priority === 'low' 
                    ? 'bg-green-500 border-green-600 text-white shadow-md transform scale-105' 
                    : 'bg-white border-gray-300 text-green-600 hover:bg-green-50'
                }`}
              >
                <span className="text-lg">🟢</span>
                <span className="text-sm font-medium">Низкий</span>
              </button>
            </div>
          </div>

          {/* Дедлайн */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Срок выполнения
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input"
            />
            <p className="text-xs text-gray-500 mt-1">
              {dueDate && new Date(dueDate) < new Date() 
                ? '⚠️ Эта задача уже просрочена!' 
                : 'Оставьте пустым, если нет срока'}
            </p>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3 pt-4">
            <button 
              type="submit" 
              className="btn-primary flex-1"
            >
              💾 Сохранить изменения
            </button>
            <button 
              type="button" 
              onClick={onClose} 
              className="btn-secondary flex-1"
            >
              Отмена
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
