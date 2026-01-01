// Task operations controller
// In-memory task store for demo (replace with DB in production)
let tasks = [
  { id: 1, title: 'Sample Task', description: 'This is a sample task', owner: 1 }
];

exports.getTasks = (req, res) => {
  // Admin sees all, user sees own
  if (req.user.role === 'admin') {
    return res.json(tasks);
  }
  res.json(tasks.filter(t => t.owner === req.user.id));
};

exports.createTask = (req, res) => {
  const { title, description } = req.body;
  const id = tasks.length + 1;
  const task = { id, title, description, owner: req.user.id };
  tasks.push(task);
  res.status(201).json(task);
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (req.user.role !== 'admin' && task.owner !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  task.title = req.body.title || task.title;
  task.description = req.body.description || task.description;
  res.json(task);
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const task = tasks.find(t => t.id == id);
  if (!task) return res.status(404).json({ message: 'Task not found' });
  if (req.user.role !== 'admin' && task.owner !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  tasks = tasks.filter(t => t.id != id);
  res.json({ message: 'Task deleted' });
};
