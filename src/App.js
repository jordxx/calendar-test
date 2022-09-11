import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import './App.css';
import { Button, Label, Modal, TextInput } from 'flowbite-react';

function App() {
  const [event, setEvent] = useState([])
  const [detail, setDetail] = useState({})
  // SHOW MODAL
  const [show, setShow] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  // DUE DATE CALENDAR
  const [dueDate, setDueDate] = useState("")
  const [input, setInput] = useState({
    title: "",
    date: "",
    color: ""
  })
  // FETCH DATA
  useEffect(() => {
    fetch(`http://localhost:4000/Events`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Fetch error")
        return response.json()
      })
      .then((data) => setEvent(data))
      .catch((err) => console.log(err))

  }, [])

  // TO HANDLE DELETE EVENTS
  const eventClick = (event) => {
    setShowDetail(true)
    if (event.event._def.publicId) {
      fetch(`http://localhost:4000/Events/${event.event._def.publicId}`)
        .then((response) => {
          if (!response.ok) throw new Error("Fetch error")
          return response.json()
        })
        .then((data) => {
          setDetail(data)
          setInput({
            title: data.title,
            date: data.date,
            color: data.color
          })
        })
        .catch((err) => console.log(err))
    }
  }
  const handleChange = (event) => {
    const { name, value } = event.target
    setInput({ ...input, [name]: value })
  }
  // INPUT DATA TO SERVER
  const handleSubmit = (event) => {
    event.preventDefault()
    const { title } = input
    fetch(`http://localhost:4000/Events`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        date: dueDate,
        color: 'red'
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Create failed")
        return res.json()
      })
      .then((data) => setEvent(data))
      .finally(() => setShow(false))
      .catch((err) => console.log(err))
  }
  const addTask = (selectInfo) => {
    setShow(true)
    setDueDate(selectInfo.startStr)
  }
  const onClose = () => {
    setShow(false)
  }
  const onCloseEvent = () => {
    setShowDetail(false)
  }
  const handleUpdate = (event) => {
    event.preventDefault()
    const { title, date, color } = input
    fetch(`http://localhost:4000/Events/${detail.id}`, {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: title,
        date: date,
        color: color
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Update failed")
        return res.json()
      })
      .finally(() => setShowDetail(false))
      .catch((err) => console.log(err))

  }
  const handleDelete = (_id) => {
    fetch(`http://localhost:4000/Events/${_id}`, {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((response) => {
        if (!response.ok) throw new Error("Fetch error")
        return response.json()
      })
      .then(() => setShowDetail(false))
      .catch((err) => console.log(err))
  }
  return (
    <div className="App">
      {/* ADD EVENT */}
      <Modal
        show={show}
        size="md"
        popup={true}
        onClose={onClose}
      >
        <Modal.Header />
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <Label
              htmlFor='formTitle'
            >Event: </Label>
            <TextInput
              type='text'
              className='border'
              name='title'
              value={input.title}
              placeholder='name'
              onChange={handleChange}
            />
            <div className='mt-4 rounded-xl'>
              <Button onClick={handleSubmit} className='border text-white text-sm'>SUBMIT</Button>

            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* UPDATE / DELETE EVENT */}
      <Modal
        show={showDetail}
        size="xl"
        popup={true}
        onClose={onCloseEvent}
      >
        <Modal.Header />
        <Modal.Body>
          <div className='container m-auto'>
            <h1 className='text-center'>EVENT</h1>
            <div>
              <p>{input.title}</p>
              <p>{input.date}</p>
              <form onSubmit={handleUpdate}>
                <Label
                  htmlFor='updateTitle'
                >Event: </Label>
                <TextInput
                  type='text'
                  className='border'
                  name='title'
                  value={input.title}
                  onChange={handleChange}
                />

                <Label
                  htmlFor='updateDate'
                >Date: </Label>
                <TextInput
                  type='date'
                  className='border'
                  name='date'
                  value={input.date}
                  onChange={handleChange}
                />

                <Label
                  htmlFor='updateColor'
                >Color: </Label>
                <TextInput
                  type='text'
                  className='border'
                  name='color'
                  value={input.color}
                  onChange={handleChange}
                />

                <div>
                  <button onClick={handleUpdate} type="button" className="text-white bg-gradient-to-r from-blue-500 
              via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none
               focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 
               py-2.5 text-center mr-2 mb-2">Update</button>

                  <button onClick={() => handleDelete(detail.id)} type="button" className="text-white bg-gradient-to-r from-red-400 
            via-red-500 to-red-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none 
            focus:ring-red-300 dark:focus:ring-red-800 font-medium rounded-lg text-sm px-5 py-2.5 
            text-center mr-2 mb-2">Delete</button>
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <div className='container m-auto w-1/2'>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          editable={true}
          selectable={true}
          selectMirror={true}
          droppable={true}
          initialView="dayGridMonth"
          events={event}
          eventClick={eventClick} //FOR DELETE
          select={addTask}
        />
      </div>
    </div>
  );
}

export default App;
