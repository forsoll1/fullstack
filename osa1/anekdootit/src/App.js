import React, { useState } from 'react'

const Button = (props) =>{
  return(
    <button onClick={props.func}>{props.text}</button>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
  
  const [selected, setSelected] = useState(0)
  const getRandom = () => setSelected(Math.floor(Math.random() * anecdotes.length))

  const test = new Array(anecdotes.length).fill(0)
  const [pisteet, aseta] = useState([...test])
  const annaPiste = () => {
    let vali = [...pisteet]
    vali[selected] +=1
    aseta(vali)
  }
 
  return (
    <div>
      <h1>Anecdote of the day</h1>
      {anecdotes[selected]}
      
      <br></br>
      <Button text="vote" func={annaPiste}/><Button text="next anecdote" func={getRandom}/>
      <br></br>
      <h1>Anecdote with most votes</h1>
      <br></br>
      {anecdotes[pisteet.indexOf(Math.max(...pisteet))]}
    </div>
  )
}

export default App