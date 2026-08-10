import { useMemo, useState, type FormEvent } from "react";
import { useTodos, type Todo, type TodoFilter } from "./TodoContext";

<button 
  type="submit"
  className="rounded-xl bg-[orange] text-white font-bold"
>Добавить</button>

const filters: { value: TodoFilter, label: string }[] = [
  {value: "all", label: "Все"},
  {value: "active", label: "Активные"},
  {value: "completed", label: "Готово"},
];


export default function App() {
  const{
    todos,
    activeCount,
    completedCount,
    storageError,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted
  } = useTodos();

  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<TodoFilter>("all");


  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      if(filter === "active") return !todo.completed;
      if(filter === "completed") return todo.completed;
      return true;
    });
  }, [todos])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if(!title.trim()) return;
      setTitle("");
      setList((prev) => ([...prev, { title: title.trim()}]))
  };

  return(
    <main className={[
      "grid min-h-screen min-w-80 place-items-center",
      "bg-white px-5 py-12 text-black"
    ].join(" ")}>
      <section className={[
        "w-full max-w-[680px] overflow-hidden rounded-3xl",
        "border border-[#2751f0]/8 bg-white"
      ].join(" ")}>
        <header className={[
        "bg-[#4f3] px-10 pt-11 pb-8 text-white"
        ].join(" ")}>
          <p className="m-0 text-xs font-bold uppercase"> План на сегодня</p>

          <h1 id="page-title" 
          className="mt-1 mb-2 text-3xl font-bold"
          >Мои задачи</h1>

          <p className="m-0 text-zinc-400">
              {activeCount
              ? `Осталось выполнить: ${activeCount}}`
              : "Все выполнено"
              }
          </p>
        </header>

        <form className="flex gap-2.5 px-10 pt-7 pb-5"
        onSubmit={handleSubmit}>
          
          <label htmlFor="new-todo">Новая задача</label>
          <input 
          type="text"
          id="new-todo"
          value={title}
          onChange={(event) =>
            setTitle(event.currentTarget.value)
          }
          />
        </form>
      </section>
    

    </main>
  );
}