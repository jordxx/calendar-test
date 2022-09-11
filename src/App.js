import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import './App.css';
import { Modal } from 'flowbite-react';
import CreateModal from './components/modal/CreateModal';

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
  const [value, setValue] = useState({})

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
  }, [value])

  const test = (kontol) => {
    setValue(kontol)
  }
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
  const addTask = (selectInfo) => {
    setShow(true)
    setDueDate(selectInfo.startStr)
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

  const dropdrop = (info) => {
    const dateInfo = info.event.start.toLocaleString('id-ID', { year: 'numeric', day: '2-digit', month: '2-digit' }).split('/')

    fetch(`http://localhost:4000/Events/${info.event._def.publicId}`, {
      method: 'put',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: info.event._def.title,
        date: `${dateInfo[2]}-${dateInfo[1]}-${dateInfo[0]}`,
        color: info.event._def.ui.backgroundColor
      })
    })
      .then((res) => {
        if (!res.ok) throw new Error("Drag Calendar failed");
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  }

  return (
    <div className="App">
      {/* ADD EVENT COMPONENT */}
      <CreateModal show={show} dueDate={dueDate} setEvent={setEvent} setShow={setShow} test={test} />

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
                <label
                  htmlFor='updateTitle'
                >Event: </label>
                <input
                  type='text'
                  className='border'
                  name='title'
                  value={input.title}
                  onChange={handleChange}
                />

                <label
                  htmlFor='updateDate'
                >Date: </label>
                <input
                  type='date'
                  className='border'
                  name='date'
                  value={input.date}
                  onChange={handleChange}
                />

                <label
                  htmlFor='updateColor'
                >Color: </label>
                <input
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
          eventDrop={dropdrop}
        />
      </div>
    </div>
  );
}

export default App;
