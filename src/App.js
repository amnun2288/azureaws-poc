import React, { useState, useRef, useEffect } from 'react';
import TodoList from './TodoList';
import uuidv4 from 'uuid/v4';
import Amplify, { Auth } from 'aws-amplify';
import awsconfig from './aws-exports';

Amplify.configure(awsconfig);

const LOCAL_STORAGE_KEY = 'todoApp.todos'

function App() {
  const [todos, setTodos] = useState([]);
  const [user, setUser] = useState(null);
  const todoNameRef = useRef();

  useEffect(() => {
    Auth.currentAuthenticatedUser({
      bypassCache: false
    }).then(user => setUser(user))
    .catch(err => console.log(err));
    Auth.currentSession()
    .then(session => console.log(session.getIdToken().getJwtToken()))
    .catch(err => console.log(err));
  }, [])

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

  function toggleTodo(id) {
    const newTodos = [...todos]
    const todo = newTodos.find(todo => todo.id === id)
    todo.complete = !todo.complete
    setTodos(newTodos)
  }

  function handleAddTodo(e) {
    const name = todoNameRef.current.value
    if (name === '') return
    setTodos(prevTodos => {
      return [...prevTodos, { id: uuidv4(), name: name, complete: false}]
    })
    todoNameRef.current.value = null
  }

  function handleClearTodos() {
    const newTodos = todos.filter(todo => !todo.complete)
    setTodos(newTodos)
  }
  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then(userData => console.log(userData))
      .catch(() => console.log('Not signed in'));
  }
  const AzureSignIn = async () => {
    
      Auth.federatedSignIn()
      .then(credentials => {
        console.log('get aws credentials',credentials)
      })
      .catch(e => console.log(e));
      alert('user logged in via Azure');
  }
  

  if(user)
  {
    console.log(user);
    return( <><TodoList todos={todos} toggleTodo={toggleTodo} />
      <input ref={todoNameRef} type="text" />
      <button onClick={handleAddTodo}>Add</button>
      <button onClick={handleClearTodos}>Clear</button>
      <div>{todos.filter(todo => !todo.complete).length} left to do</div>
      <button onClick={() => Auth.signOut().then(() =>{
        setUser(null)
      })}>Sign Out</button>
    </>)
  }
  return (
    <>
        <button onClick={AzureSignIn}>Azure Sign In</button>
      </>
  )
}

export default App;