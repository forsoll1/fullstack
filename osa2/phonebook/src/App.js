import React, { useState, useEffect } from 'react'
import personService from './services/persons'

const Filter = ({handleFilterChange, newFilter}) =>{
  return(
    <div>
      <form>
        <div>
          filter shown with: <input value={newFilter}
          onChange={handleFilterChange}/>
        </div>
      </form>
    </div>
  )
}
const AddInfo = ({lisaaNimi,newName,newNumber,handleNameChange,handleNumberChange}) => {
  return(
    <div>
      <form onSubmit={lisaaNimi}>
        <div>
          name: <input value={newName}
          onChange={handleNameChange} />
        </div>
        <div>
          number: <input value={newNumber} 
          onChange={handleNumberChange}/>
          </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </div>
  )
}

const NumeroLista = ({personsToShow, handleDeleteButton}) =>{
  return(
    <div>
      <ul>
      {personsToShow.map(person => <NumeroRivi handleDeleteButton={handleDeleteButton} key={person['name']} person={person}/>)}
      </ul>
    </div>
  )
}

const NumeroRivi = ({person,handleDeleteButton}) =>{
  return(
    <li>{person['name']} {person['number']} <button onClick={handleDeleteButton} value={person['id']}>delete</button></li>
  )
}

const Notification = ({ Message, errorMessage }) => {
  const NotificationStyle = {
    color: 'green',
    backgroundColor: 'lightGrey',
    fontSize: 24,
    border:'4px solid green' 
  }
  const errorStyle = {
    color: 'red',
    backgroundColor: 'lightGrey',
    fontSize: 24,
    border:'4px solid red' 
  }
  if (Message === null && errorMessage===null) {
    return null
  }else if(errorMessage===null && Message !== null){
    return (
      <div style={NotificationStyle}>
        {Message}
      </div>
    )
  }else{
    return (
      <div style={errorStyle}>
        {errorMessage}
      </div>
    )
  }


}

const App = () => {

  const [ persons, setPersons] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter] = useState('')
  const [ Message, setNewMessage] = useState(null)
  const [ errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialList =>{
        setPersons(initialList)
      })

  },[])

  const lisaaNimi = (event) => {

    event.preventDefault()
    const person = {
      name: newName,
      number: newNumber,
    } 
    if(persons.some(person => person['name']===newName)){
      const answer = window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
      if (!answer){
        return
      }else{
        const henkilo = persons.filter(person => person['name']==newName)[0]
        personService
          .update(henkilo['id'], person)
          .then(returnedPerson => {
          setPersons(persons.map(person=> person.id != henkilo.id ? person : returnedPerson))
          createMessage('Updated number for', person.name)
          setNewName('')
          setNewNumber('')
        })
        .catch(error =>{
          setErrorMessage(`Information of ${henkilo.name} has already been removed from server`)
          setPersons(persons.filter(person => person.id != henkilo.id))
          setNewName('')
          setNewNumber('')
        })
        return
      }
    }
    event.preventDefault()
    personService
    .create(person)
    .then(returnedPerson =>{
      setPersons(persons.concat(returnedPerson))
      createMessage('Added', person.name)
      setNewName('')
      setNewNumber('')
    })
  }

  const deletePerson = id =>{
    const henkilo = persons.filter(person => person.id==id)[0]
    const answer = window.confirm(`Delete ${henkilo.name}?`)
    if (answer==false){
      return
    }
    personService
    .deleteObj(id)
    .then(res =>{
      createMessage('Deleted', henkilo.name)
      setPersons(persons.filter(person=>person.id!=id))      
    })
    .catch(error =>{
      setErrorMessage(`Information of ${henkilo.name} has already been removed from server`)
      setPersons(persons.filter(person => person.id != henkilo.id))
      setNewName('')
      setNewNumber('')
    })
  }

  const createMessage = (tapahtuma, henkilo) =>
    setNewMessage(`${tapahtuma} ${henkilo}`)
    setTimeout(() => {
        setNewMessage(null)
      }, 5000)

  const createErrorMessage = (tapahtuma) =>
    setErrorMessage(`${tapahtuma}`)
    setTimeout(() => {
        setErrorMessage(null)
      }, 5000)  

  const handleNameChange = (event) =>{
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) =>{
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) =>{
    setNewFilter(event.target.value)
  }
  const handleDeleteButton = (event) =>{
    deletePerson(event.target.value)
  }


  const personsToShow = newFilter.length===0
  ? [...persons]
  : persons.filter(person => person['name'].toLowerCase().startsWith(newFilter.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification Message={Message} errorMessage={errorMessage} />
      <Filter handleFilterChange={handleFilterChange} newFilter={newFilter}/>
      <h2>add a new</h2>
      <AddInfo  lisaaNimi={lisaaNimi}
                newName={newName}
                newNumber={newNumber}
                handleNameChange={handleNameChange}
                handleNumberChange={handleNumberChange}
       />
      <h2>Numbers</h2>
      <NumeroLista  personsToShow={personsToShow}
                    handleDeleteButton={handleDeleteButton}
      />
    </div>
  )

}

export default App
