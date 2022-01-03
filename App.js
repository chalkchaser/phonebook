import React, { useEffect, useState } from 'react'
import axios from 'axios'
import personService from './services/notes'

const People = ({persons,searchTerm, updatePersons,setNotification }) => {


 const handleDelete = (id) => {
  const url = `http://localhost:3001/persons/${id}`
  axios.delete(url)
    .then( response=> updatePersons())
      .catch(error => setNotification('deny'), "")//response is necessary for asynchronous handling
}


  const persons_copy = persons.filter(x => x.name.toLowerCase().startsWith(searchTerm.toLowerCase())) 
  return(
  <ul>
    {persons_copy
      .map(person => <div key={person.name} >
        {person.name}  {person.number}<button 
          onClick={()=>handleDelete(person.id)}>delete</button></div>)}
      
  </ul>
  )
 }

 /*
 const Person = ({person}) =>{
   return(
  <div key={person.name} >{person.name}  {person.number}<button onClick={()=>handleDelete(person.id)}>delete</button></div>
  
  )
 }
*/


 const PersonsForm = ({newName, newNumber, handleNameChange,handleNumberChange}) =>{
   return(
  <div>
  name: 
    <input
    value = {newName}
    onChange={handleNameChange}
  />
  <div>number:
     <input 
     value = {newNumber}
     onChange = {handleNumberChange}/></div>
</div>
   )
 }

 const Notification = ({message, person}) => {
  if( message === null){
    return null
  }

  let messageStyle = null
  if(message === "accept"){
    messageStyle = {
      color:'green',
      fontSize:16
    }
    return(
      <div style={messageStyle}>{person} has been added to the phonebook</div>
      )
  
  }else{   messageStyle = {
    color:'red',
    fontSize:16
  }}return(
    <div style={messageStyle}>Person has been denied</div>
    )


}


const App = () => {
  const [persons, setPersons] = useState([
 ]) 
 const [newName, setNewName] = useState('')
  const [newNumber,setNewNumber] = useState('')
  const[newSearch, setNewSearch] = useState('')
  const[NotificationMessage, setNotification] =useState(null)


 useEffect(() =>{
   personService.getAll()
   .then(response =>{
    setPersons(response.data)

    })
  },[])
 

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    console.log(event.target.value)
    setNewSearch(event.target.value)
  }

  const updatePersons = () => {
    console.log("an update should be happening now")
    personService.getAll()
      .then(response => setPersons(response.data))
  }



  const addName= (event)=>{
    event.preventDefault()
   const nameObject ={
     name: newName,
     number: newNumber,
   }

  
  if(persons.some(x => x.name === newName)){
    if(persons.some(x => x.number === newNumber)){
      alert(`${newName} and ${newNumber} is already included`)
    }else{
      if(window.confirm('do you want overwrite the old number?')){
        personService.getAll()
          .then(response => response.data.find(x => x.name === newName))
            .then(response => axios.put(`http://localhost:3001/persons/${response.id}`,{name: newName, number : newNumber}))
              .then(response => updatePersons())
        
        
        //axios.put(`http://localhost:3001/persons`,{name: newName,number: newNumber})
        }
    }
   }else{
    //adds a person to the book
    
    
    personService.create(nameObject)
    .then(response => {
      console.log(response.data)//why is it not only response.data -> REST principle of uniform Api
      setPersons(persons.concat(response.data))
    })
   }
 
   


   setNotification(`accept`)
   setTimeout(() => {
    setNotification(null)
  }, 5000)

  } 


  
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message ={NotificationMessage} person = {newName}/>
      <div>search
      <input onChange={handleSearchChange}></input>
      </div>
      <PersonsForm newName ={newName} newNumber ={newNumber} 
        handleNameChange ={handleNameChange} handleNumberChange ={handleNumberChange}></PersonsForm>
      <form onSubmit={addName}>
      
        <div>
          <button type="submit">add</button>
        </div>
        
      </form>
      <h2>Numbers</h2>

      <People persons = {persons} searchTerm = {newSearch} updatePersons={updatePersons} setNotification={setNotification}></People>
     
    </div>
    
  )

}

export default App