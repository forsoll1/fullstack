import React, { useState, useEffect } from 'react'
import axios from 'axios'

const InfoDump = ({country}) =>{
  return(
    <div>
      <h1>{country['name']}</h1>
      <p>capital {country['capital']} 
      <br></br>
      population {country['population']}</p>
      <h2>languages</h2>
      <ul>
      {country['languages'].map(language => <li key={language['name']}>{language['name']}</li>)}
      </ul>
      <img src={country['flag']} style={{width: '20%', height: '20%' }} alt='flag'></img>
    </div>
  )
}

const Countries = ({countriesToShow, forceFilter}) =>{
  if (countriesToShow.length===1){
  return(
    <div>
      <InfoDump country = {countriesToShow[0]} />
    </div>
  )
  }else if(countriesToShow.length>10){
    return(
    <div>
      <p>Too many matches, specify another filter</p>
    </div>
    )
  }else{
  return(
    <div>
      {countriesToShow.map(country => 
      <li key={country['name']}> {country['name']} <button onClick={forceFilter} value={country['name']}>show</button></li>
      )}
    </div>
  )
  }
}


const App = () => {

  const [countries, setCountries] = useState([])
  const [newFilter, setNewFilter] = useState('')

  const forceFilter = (event) =>{
    setNewFilter(event.target.value)
  }

  const handleFilterChange = (event) =>{
      setNewFilter(event.target.value)
  }

  useEffect(() => {
    axios
      .get('https://restcountries.eu/rest/v2/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])
  
  const countriesToShow = newFilter.length===0
  ? []
  : countries.filter(country => country['name'].toLowerCase().includes(newFilter.toLowerCase()))


  return (
    <div>
      <h1>Country lookup</h1>
      <form>
        find countries: <input value={newFilter} onChange={handleFilterChange}></input>
      </form>
      <Countries countriesToShow={countriesToShow} forceFilter={forceFilter} />
    </div>
  );
}

export default App;
