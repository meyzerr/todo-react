import { useMemo, useState, type FormEvent } from "react";
import { useTodos, type Todo, type TodoFilter } from "./TodoContext";

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
      addTodo(title)
      setTitle("");
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
        "bg-[#415f4f] px-10 pt-11 pb-8 text-white"
        ].join(" ")}>
          <p className="m-0 text-xs font-bold uppercase"> План на сегодня</p>

          <h1 id="page-title" 
          className="mt-1 mb-2 text-3xl font-bold"
          >Мои задачи</h1>

          <p className="m-0 text-zinc-400">
              {activeCount
              ? `Осталось выполнить: ${activeCount}`
              : "Все выполнено"
              }
          </p>
        </header>

        <form className="flex gap-2.5 px-10 pt-7 pb-5"
        onSubmit={handleSubmit}>
          <input 
          type="text"
          id="new-todo"
          className="min-w-0 flex-1 rounded-xl border border-[#dedbd2] bg-[#fbfaf7] px-4 py-3 text-[#27251f]"
          placeholder="Что нужно сделать?"
          value={title}
          onChange={(event) =>
            setTitle(event.currentTarget.value)
          }
          />

          <button
            type="submit"
              className="rounded-xl bg-[#c16f49] text-white font-bold px-5"
            >Добавить</button>
        </form>

            {storageError && (
              <p className="text-red-700 rounded-lg bg-white"
              >{storageError}</p>
            )}

            <div className="flex items-center justify-between gap-4 px-[42px]">
              <div className="gap-1 flex rounded-lg p-1 bg-[#f1efe9]">
                {filters.map(({value, label}) =>
                  <button
                  className="cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold aria-pressed:bg-white aria-pressed:text-[#334b3e]" 
                  key={value} 
                  type="button"
                  aria-pressed={filter==value}
                  onClick={() => setFilter(value)}>
                  {label}</button>)}
              </div>
              <span className="text-xs text-[#8b877e]">Всего {todos.length} задач</span>
            </div>
          
          {visibleTodos.length 
          ?(
            <ul className="m-0 grid list-none gap-px p-0">
                {visibleTodos.map((todo) => (
                    <li className="flex min-h-16 items-center gap-3 px-[42px]">
                      <label className="flex min-w-0 flex-1 cursor-point items-center gap-3">
                        <input 
                        type="checkbox"
                        className=""
                        />

                        <span className="grid size-[23-px] shrink-0 place-items-center rounded-full border-2 border-[#c9c5bb] text-xs font-bold">*</span>
                        <span className={`${todo.completed ? "text-[#a09c93] line-through" : ""}`}>{todo.title}</span>
                      </label>

                      <button onClick={() => deleteTodo(todo.id)}>
                        x
                      </button>
                    </li>
                ))}
            </ul>
          ) : (
            <p className="px-[42px] py-5">Задачи отсутствуют</p>
          )
        }

      </section>
    

    </main>
  );
}