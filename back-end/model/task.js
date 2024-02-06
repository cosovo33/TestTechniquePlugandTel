const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Definition de modéle tâche
const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    dueDate: { type: Date, default: null },
    status: { type: String, enum: ['To Do', 'In Progress', 'Done'], default: 'To Do' },
    order: { type: Number, unique:true, required: true}
});
const Task =mongoose.model('Task',taskSchema);
module.exports = Task;