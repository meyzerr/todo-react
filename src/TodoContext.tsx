import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useReducer,
    useState,
    type ReactNode
} from "react"

import type { Todo } from "./types"

const STORAGE_KEY = "todo-context-app:todos";

type TodoAction =
| { type: "add", title: string }
| { type: "toggle", id: string }
| { type: "delete", id: string }
| {type: "clearCompleted"};

type TodoContextValue = {
    todos: Todo[];
    activeCount: number;
    completedCount: number;
    storageError: string | null;
    addTodo: (title: string) => void;
    toggleTodo: (title: string) => void;
    deleteTodo: (title: string) => void;
    cleatCompleted: (title: string) => void;
};

const TodoContext = createContext<TodoContextValue | null>(null);

const isTodo = (value: unknown): value is Todo => {
    if(typeof value !== "object" || value == null) return false;

    const todo = value as Record<string, unknown>;
    return (
        typeof todo.id === "string" &&
        typeof todo.title === "string" &&
        typeof todo.comleted === "boolean"
    )
}

const loadTodos = (): Todo[] => {
    try {
        const savedTodos: unknown = 
            JSON.parse(window.localStorage.get(STORAGE_KEY) ?? "[]");

        if(Array.isArray(savedTodos) && savedTodos.every(isTodo)) 
            return savedTodos;

        console.warn("Сохраненный список задач имеет неверный формат.");
    } catch(e) {
        console.warn("Не удалось прочитать сохраненный список задач.");
    }
}

const todoReducer = (todos: Todo[], action: TodoAction): Todo[] => {
    switch(action.type){
        case "add": {
            const title = action.title.trim();
            if(!title) return todos;




            return[...todos, 
                {id: crypto.randomUUID(), title: title, completed: false}]
        }
        case "toggle": {
            return todos.map(todo =>
                todo.id === action.id 
                ? {...todo, completed: !todo.completed}
                : todo            
            );
        }
        case "delete": {
            return todos.filter((todo) => todo.id !== action.id)
        }

        case "clearCompleted": {
            return todos.filter((todo) => !todo.completed)
        }
    }
};

export function TodoProvider({ children }: {children: ReactNode}) {
    const [todos, dispatch] = 
        useReducer(todoReducer, undefined, loadTodos)
    const [storageError, setStorageError] = useState<string | null>(null);

    useEffect(() => {
            try {
                window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
                setStorageError(null)
            } catch(e) {
                setStorageError("Не удалось сохранить изменения в браузере")
            }
    }, [todos]);

    const value = useMemo<TodoContextValue>(() => {
            const completedCount = todos.filter(todo => todo.complete).length;

            return {
                todos,
                activeCount: todos.length - completedCount,
                completedCount,
                storageError,
                addTodo: (title: string) => dispatch({type:"add", title}),
                toggleTodo: (id: string) => dispatch({type:"toggle", id}),
                deleteTodo: (id: string) => dispatch({type:"delete", id}),
                cleatCompleted: () => dispatch({type:"clearCompleted"}),
            }
    });
}