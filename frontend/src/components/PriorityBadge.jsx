const priorityConfig = {
  high: { label: '🔴 Высокий', class: 'bg-red-100 text-red-700' },
  medium: { label: '🟡 Средний', class: 'bg-yellow-100 text-yellow-700' },
  low: { label: '🟢 Низкий', class: 'bg-green-100 text-green-700' }
};

export const PriorityBadge = ({ priority }) => {
  const config = priorityConfig[priority] || priorityConfig.medium;
  return (
    <span className={`text-xs px-2 py-1 rounded-full ${config.class}`}>
      {config.label}
    </span>
  );
};
