import React, { useState } from 'react'

const Button = (props) =>{
  return(
    <button onClick={props.func}>{props.name}</button>
  )
}

const Feedback = (props) =>{
  return (
    <div>
      <h1>give feedback</h1>
      <Button func={props.good} name='good' /><Button func={props.neutral} name='neutral' /><Button func={props.bad} name='bad' />
    </div>
  )    
}

const StatisticLine = (props) =>{
  return(
      <tr>
        <td>{props.text}</td>
        <td>{props.value} {props.special}</td>
      </tr>
  )
}

const Statistics = (props) =>{
  const sum = props.good+props.neutral+props.bad
  const average = (props.good - props.bad)/ sum

  if(sum===0){
    return(
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return(
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text="good" value={props.good} />
          <StatisticLine text="neutral" value={props.neutral} />
          <StatisticLine text="bad" value={props.bad} />
          <StatisticLine text="all" value={sum} />
          <StatisticLine text="average" value={average} />
          <StatisticLine text="positive" value={props.good/sum*100} special="%" />
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => {setGood(good + 1)}
  const handleNeutral = () => {setNeutral(neutral +1)}
  const handleBad = () => {setBad(bad+1)}

  return (
    <div>
      <Feedback good={handleGood} neutral={handleNeutral} bad={handleBad} />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App