import React, { useState, useEffect } from 'react'
import List from './List'
import Alert from './Alert'

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};

function App() {

  const [name, setName] = useState('');
  const [groceryList, setGroceryList] = useState(getLocalStorage);
  const [isEditing, setIsEditing] = useState(false);
  const [editID, setEditID] = useState(null);
  const [alert, setAlert] = useState({
    show:false, 
    msg:'', 
    type:''})

  function submited(e){
    e.preventDefault();
    if(!name){
      setAlert({show:true, msg:'enter a value',type:'danger'});
      // showAlert(true, 'danger', 'please enter value');
      hideAlert();
    }
    else if(name && isEditing){
      setGroceryList(groceryList.map((item)=>{
        if(item.id === editID){
          return {...item, title: name}
        }
        return item
      }))
      setName('');
      setEditID(null);
      setIsEditing(false);
      setAlert({show:true, msg:'value updated', type:'success'});
      hideAlert();
    }
    else{
      setAlert({show:true, msg:'Added Succesfully', type:'success'});
      hideAlert();
      const newItem = {id:new Date().getTime().toString(),title:name};
      setGroceryList([...groceryList, newItem]);
      setName('');
    }
    console.log(groceryList);
  }

  function hideAlert(){
    const timeout = setTimeout(() => {
      setAlert({show:false})
    }, 1500)
    return () => clearTimeout(timeout)
  }


  // function showAlert(show = false, type = '', msg = ''){
  //   setAlert({show,type,msg})
  // }

  function removeItem(id){
    setAlert({show:true, msg:'item removed', type:'danger'});
    hideAlert();
    setGroceryList(groceryList.filter((item) => item.id !== id))
  }

  function editItem(id){
    const editingItem = groceryList.find((item) => item.id === id);
    setIsEditing(true);
    setEditID(id);
    setName(editingItem.title);
  }

  function emptyList(){
    setGroceryList([]);
    setAlert({show:true,msg:'emptied the list',type:'danger'}); 
    hideAlert();
  }

  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(groceryList));
  }, [groceryList]);

  return (
  <>
    <section className="section-center">
      <form className='grocery-form' onSubmit={submited}>
        {alert.show && <Alert {...alert} />}
        <h3>grocery bud</h3>
        <div className="form-control">
          <input type="text" name="" id="" className='grocery' placeholder='e.g. eggs' value={name} onChange={(e)=> setName(e.target.value)}/>
          <button type='submit' className='submit-btn'>
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {groceryList.length > 0 && (
      <div className="grocery-container">
        <List items={groceryList} removeItem={removeItem} editItem={editItem} />
        <button className='clear-btn' onClick={emptyList}>clear items</button>
      </div>
      )}
    </section>
  </>
  )
}

export default App
