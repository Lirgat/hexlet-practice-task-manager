import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../api';
import toast from 'react-hot-toast';
import { Plus, Search, Calendar, CheckCircle } from 'lucide-react';
import { EditTaskModal } from '../components/EditTaskModal';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [editingTask, setEditingTask] = useState(null);
  const [draggedTask, setDraggedTask] = useState(null);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки задач');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Введите название задачи');
      return;
    }
    setLoading(true);
    try {
      await createTask({ title: newTitle, description: newDescription });
      setNewTitle('');
      setNewDescription('');
      await loadTasks();
      toast.success('Задача создана!');
    } catch (error) {
      toast.error('Ошибка создания');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, currentStatus) => {
    const statuses = ['todo', 'in-progress', 'done'];
    const currentIndex = statuses.indexOf(currentStatus);
    const nextStatus = statuses[(currentIndex + 1) % statuses.length];
    try {
      await updateTask(id, { status: nextStatus });
      await loadTasks();
      toast.success('Статус обновлён');
    } catch (error) {
      toast.error('Ошибка обновления');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Удалить задачу?')) {
      try {
        await deleteTask(id);
        await loadTasks();
        toast.success('Задача удалена');
      } catch (error) {
        toast.error('Ошибка удаления');
      }
    }
  };

  const handleEdit = async (id, newTitle, newDescription) => {
    try {
      await updateTask(id, { title: newTitle, description: newDescription });
      await loadTasks();
      toast.success('Задача обновлена');
      setEditingTask(null);
    } catch (error) {
      toast.error('Ошибка обновления');
    }
  };

  // Drag & Drop handlers
  const onDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', task.id);
    e.target.style.opacity = '0.4';
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    // Убираем подсветку со всех колонок
    document.querySelectorAll('.kanban-column').forEach(col => {
      col.classList.remove('drag-over');
    });
  };

  const onDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    // Подсветка колонки
    const column = e.currentTarget;
    document.querySelectorAll('.kanban-column').forEach(col => {
      col.classList.remove('drag-over');
    });
    column.classList.add('drag-over');
  };

  const onDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const onDrop = async (e, newStatus) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    
    if (!draggedTask) return;
    
    const taskId = draggedTask.id;
    const oldStatus = draggedTask.status;
    
    if (oldStatus === newStatus) return;
    
    try {
      await updateTask(taskId, { status: newStatus });
      await loadTasks();
      
      const statusNames = {
        'todo': 'К выполнению',
        'in-progress': 'В процессе',
        'done': 'Выполнено'
      };
      toast.success(`Задача "${draggedTask.title}" перемещена в "${statusNames[newStatus]}"`);
    } catch (error) {
      toast.error('Ошибка перемещения задачи');
    }
    
    setDraggedTask(null);
  };

  // Фильтрация и поиск
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || task.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Сортировка
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    if (sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const columns = {
    todo: { 
      id: 'todo',
      title: '📋 К выполнению', 
      tasks: sortedTasks.filter(t => t.status === 'todo'),
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    },
    'in-progress': { 
      id: 'in-progress',
      title: '⚙️ В процессе', 
      tasks: sortedTasks.filter(t => t.status === 'in-progress'),
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    done: { 
      id: 'done',
      title: '✅ Выполнено', 
      tasks: sortedTasks.filter(t => t.status === 'done'),
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Task Manager
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Прогресс: {completionRate}%</p>
                <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${completionRate}%` }}></div>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                👋 Привет, <span className="font-semibold text-gray-900">{user?.name}</span>
              </span>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition duration-200"
              >
                Выйти
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Всего задач</p>
                <p className="text-2xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Выполнено</p>
                <p className="text-2xl font-bold text-green-600">{completedTasks}</p>
              </div>
              <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">В процессе</p>
                <p className="text-2xl font-bold text-blue-600">{tasks.filter(t => t.status === 'in-progress').length}</p>
              </div>
              <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">К выполнению</p>
                <p className="text-2xl font-bold text-orange-600">{tasks.filter(t => t.status === 'todo').length}</p>
              </div>
              <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Create Task Form */}
        <div className="card p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Plus className="h-5 w-5 text-blue-500" />
            Создать новую задачу
          </h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Название задачи"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="input"
                required
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Описание (необязательно)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="input"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50"
            >
              {loading ? 'Создание...' : 'Создать задачу'}
            </button>
          </form>
        </div>

        {/* Filters */}
        <div className="card p-4 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск задач..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input w-auto"
              >
                <option value="all">Все статусы</option>
                <option value="todo">К выполнению</option>
                <option value="in-progress">В процессе</option>
                <option value="done">Выполнено</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input w-auto"
              >
                <option value="date">По дате</option>
                <option value="title">По названию</option>
              </select>
            </div>
          </div>
        </div>

        {/* Kanban Board with Native Drag & Drop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([status, column]) => (
            <div
              key={status}
              className={`kanban-column ${column.bgColor} rounded-xl p-4 min-h-[500px] transition-all duration-200`}
              onDragOver={(e) => onDragOver(e, status)}
              onDragLeave={onDragLeave}
              onDrop={(e) => onDrop(e, status)}
            >
              <div className={`text-center mb-4 pb-3 border-b ${column.borderColor}`}>
                <h2 className="text-xl font-semibold text-gray-800">{column.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{column.tasks.length} задач</p>
              </div>
              <div className="space-y-3">
                {column.tasks.map(task => (
                  <div
                    key={task.id}
                    draggable="true"
                    onDragStart={(e) => onDragStart(e, task)}
                    onDragEnd={onDragEnd}
                    className="card p-4 hover:shadow-lg transition-all duration-200 group cursor-grab active:cursor-grabbing"
                  >
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">{task.title}</h3>
                        {task.description && (
                          <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                        )}
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <button
                            onClick={() => handleStatusChange(task.id, task.status)}
                            className={`text-sm px-3 py-1 rounded-lg transition duration-200 ${
                              task.status === 'todo' ? 'bg-green-100 hover:bg-green-200 text-green-700' :
                              task.status === 'in-progress' ? 'bg-blue-100 hover:bg-blue-200 text-blue-700' :
                              'bg-gray-100 hover:bg-gray-200 text-gray-700'
                            }`}
                          >
                            {task.status === 'todo' ? '▶ Начать' : 
                             task.status === 'in-progress' ? '✓ Завершить' : '↺ Вернуть'}
                          </button>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingTask(task)}
                              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-lg transition duration-200"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDelete(task.id)}
                              className="text-sm bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded-lg transition duration-200"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {column.tasks.length === 0 && (
                  <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                    <p>Нет задач</p>
                    <p className="text-sm">Перетащите задачу сюда</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Edit Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleEdit}
        />
      )}

      <style jsx>{`
        .kanban-column.drag-over {
          transform: scale(1.02);
          transition: all 0.2s ease;
          box-shadow: 0 0 0 2px #3b82f6, 0 0 0 4px rgba(59, 130, 246, 0.2);
        }
      `}</style>
    </div>
  );
};
