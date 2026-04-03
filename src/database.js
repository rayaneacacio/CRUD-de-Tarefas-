import fs from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import { locales } from './locales.js';

const databasePath = new URL('../db.json', import.meta.url);

const { REQUIRED_ITEMS_ERROR, TASK_NOT_FOUND_ERROR } = locales;

export class Database {
    #database = {};

    constructor() {
        (async() => {
            try {
                const response = await fs.readFile(databasePath, 'utf-8');

                this.#database = JSON.parse(response);
            } catch {
                this.#persist();
            }
        })();
    };

    #persist() {
        fs.writeFile(databasePath, JSON.stringify(this.#database));
    };

    create = (title, description) => {
        const tasks = this.#database.tasks || [];

        if (!title || !description) throw new Error(REQUIRED_ITEMS_ERROR);

        const newTask = {
            id: randomUUID(),
            title, 
            description, 
            completed_at: null, 
            created_at: new Date(),
            updated_at: new Date()
        };

        tasks.push(newTask);

        this.#database.tasks = tasks;

        this.#persist();

        return newTask;
    };

    read = (title, description) => {
        const { tasks } = this.#database;

        if (title && description) return tasks.filter(task =>
            task.title.toLowerCase().includes(title.toLowerCase()) &&
            task.description.toLowerCase().includes(description.toLowerCase()));

        if (title) return tasks.filter(task => 
            task.title.toLowerCase().includes(title.toLowerCase()));

        if (description) return tasks.filter(task => 
            task.description.toLowerCase().includes(description.toLowerCase()));

        return tasks;
    };

    update = ({id, title, description, isComplete}) => {
        const { tasks } = this.#database;

        if (!tasks) throw new Error(TASK_NOT_FOUND_ERROR);

        const rowIndex = tasks.findIndex(task => task.id === id);

        if (rowIndex === -1) throw new Error(TASK_NOT_FOUND_ERROR);

        let task = tasks[rowIndex];

        let updatedTask = {
            ...task,
            title: title || task.title, 
            description: description || task.description, 
            updated_at: new Date(),
        };

        if (typeof isComplete === 'boolean') updatedTask = {
            ...updatedTask,
            completed_at: isComplete
        };

        tasks[rowIndex] = updatedTask;
        this.#persist();

        return updatedTask;
    };

    delete = (id) => {
        const { tasks } = this.#database;

        if (!tasks) throw new Error(TASK_NOT_FOUND_ERROR);

        const rowIndex = tasks.findIndex(task => task.id === id);
        
        if (rowIndex === -1) throw new Error(TASK_NOT_FOUND_ERROR);
        
        tasks.splice(rowIndex, 1);
        
        this.#persist();

        return;
    };
}