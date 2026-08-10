import { useState, type FormEvent } from "react";

type Task = { title: string };

export default function App() {

  const [state, setState] = useState(0);
  const [list, setList] = useState<Task[]>([]);
  const [title, setTitle] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
      event?.preventDefault();

      if(!title.trim()) return;
      setTitle("");
      setList((prev) => ([...prev, { title: title.trim()}]))
  };

  return <div>

    <form onSubmit={handleSubmit}>
        <label htmlFor="title">Название задачи</label>
        <input
         type="text" 
         id="title" 
         name="title" 
         value={title}
         onChange={((event) => setTitle(event.currentTarget.value))}/>
        <button>Сохранить</button>
    </form>

    {list.map((task, index) => {
      return <div key={task.title}>{task.title}</div>
    })}

    <button 
    onClick={() => setState((prev) => prev + 1)}>clck | {state}</button>
  </div>
}