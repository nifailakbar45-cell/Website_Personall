// Task status constants (same as backend)
export const TASK_STATUS = {
  TODO: 'TODO',
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
};

// Status labels dalam Bahasa Indonesia
export const STATUS_LABELS = {
  TODO: 'Belum Dimulai',
  IN_PROGRESS: 'Sedang Dikerjakan',
  DONE: 'Selesai',
};

// Status colors untuk UI
export const STATUS_COLORS = {
  TODO: { bg: 'bg-gray-100', text: 'text-gray-800', icon: '📝', border: 'border-gray-300' },
  IN_PROGRESS: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: '⏳', border: 'border-yellow-300' },
  DONE: { bg: 'bg-green-100', text: 'text-green-800', icon: '✅', border: 'border-green-300' },
};

// Status order
export const STATUS_ORDER = [TASK_STATUS.TODO, TASK_STATUS.IN_PROGRESS, TASK_STATUS.DONE];
