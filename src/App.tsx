import { updateDoc, doc, deleteDoc, onSnapshot, query, collection } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from './data/firebase'
import Title from './components/Title';
import AddTask from './components/AddTask';
import Task from './components/Task';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const App = (): React.JSX.Element => {

  const [task, setTask] = useState<Task[]>([])

  useEffect(() => {
    const unsubscribe = onSnapshot(query(collection(db, 'Task')), (querySnapshot) => {
      const updatedTasks: Task[] = [];
      querySnapshot.forEach((doc) => {
        updatedTasks.push({ id: doc.id, ...doc.data() } as Task)
      })
      setTask(updatedTasks);
    })
    return () => unsubscribe();
  }, [])

  const handleEdit = async (task: Task, newTitle: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'Task', task.id), { title: newTitle })
    } catch (error) {
      console.error("Error al editar la tarea:", error);
    }
  }



  const handleDelete = async (task: Task): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'Task', task.id))
    } catch (error) {
      console.error("Error al eliminar la tarea:", error);
    }
  }

  const toggleComplete = async (task: Task): Promise<void> => {
    await updateDoc(doc(db, 'Task', task.id), { completed: !task.completed });
  }

  return (
    <div className='min-h-screen bg-zinc-800 w-full font-onest'>
      <div className="">
        <Title />
      </div>
      <div className="">
        <AddTask />
      </div>
      <div className="p-4 flex items-center justify-center w-full">
        <div className="bg-zinc-800 px-4 rounded-lg">
          {task.map((task: Task) => (

            <Task
              key={task.id}
              {...task}
              handleDelete={() => handleDelete(task)}
              toggleComplete={() => toggleComplete(task)}
              handleEdit={(newTitle: string) => handleEdit(task, newTitle)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
