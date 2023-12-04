import { useState, useEffect, useRef } from 'react'
import { nanoid } from 'nanoid'
import {MoreOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons'
import { Button, Dropdown, Form, List, ConfigProvider, Input, Row, Col, Checkbox, Typography, message, Popconfirm} from 'antd'
import './App.css'

if (localStorage.getItem ('tasks') == null){
  localStorage.setItem ('tasks', JSON.stringify([]))
}

let data = JSON.parse(localStorage.getItem ('tasks'))


function App() {
  const {Text} = Typography
  const items= [
    {key: "item3", label: (<Popconfirm onConfirm={deleteAll} okText='Delete all' okButtonProps={{type: 'dashed'}} title='WARNING! YOU ARE GOING TO DELETE ALL TASKS' description='This action is permanent, are you sure to proceed?'><Button className='menu-burger__item' type='text' size='small' danger icon={<DeleteOutlined></DeleteOutlined>}>Delete all tasks</Button></Popconfirm>)}
  ]
  const [messageAPI, contexHolder] = message.useMessage()
  const success = (content)=>{messageAPI.open({
    type: 'success',
    content: content,
  })}
  const error = (content)=>{messageAPI.open({
    type: 'error',
    content: content,
  })}
  const [editTaskName, setEditTaskName] = useState('')
  const [newTaskName, setNewTaskName] = useState('')
  const [tasks, setTasks] = useState([...data])
  let ref = useRef(null); const input = ref.current
  useEffect (()=>{localStorage.setItem ("tasks", JSON.stringify(tasks))}, [tasks])

  function addTask(){
    try{
      let newTask = {name: newTaskName, id: nanoid(), completed: false}
      setTasks([newTask, ...tasks])
      setNewTaskName('')    
      success ('New task added')
    }catch(e){
      error (e)
    }
  }

  function handleEdit (id, val){
    try{
      const updatedTasks = tasks.map((task)=>{
        if (task.id == id){
          return {...task, name: val}
        }else{
          return task
        }
      })
      setTasks (updatedTasks)
      message.success ('Task modified')
    }catch(e){
      message.error (e)
    }
  }

  function deleteTask (id){
    try{
      const remainingTask = tasks.filter ((task)=> task.id != id)
      setTasks (remainingTask)
      message.success ('Task deleted')
    }catch(e){
      message.error (e)
    }
  }
  function deleteAll (){
    try{
      setTasks([])
      message.success ('All tasks deleted')
    }catch (e){
      message.error (e)
    }
  }
  function handleComplete(id, value){
    try{
      const updatedTasks= tasks.map(task => {
        if (task.id == id){
          return {...task, completed: value}
        }else{
          return task
        }
      })
      setTasks (updatedTasks)
    }catch (e){
      error (e)
    }
  }
  return (
    <>
      {contexHolder}
      <div className='container'>
          <ConfigProvider theme={{
            token: {
              colorPrimary: '#4E1BD7',
              colorBgBase: 'rgb(27, 31, 44)',
              colorTextBase: '#FFFFFF',
              colorBorder: '#FFF',
              boxShadow: 'none'
            },
            components: {
              Input:{
                colorBgBase: '#FFF',
              },
              Form:{
                fontSize: 11
              },
              Popconfirm:{
                fontSize: '0.8rem'
              }
            }
          }}>
            <section className='interface'>
              <div className='menu'>
                <Row justify={'space-between'} className='menu__item'>
                  <Col>
                    <h1>To-Do</h1>
                  </Col>
                  <Col>
                    <Dropdown menu={{items}} trigger={'click'}>
                      <Button size='middle' type='text' icon={<MoreOutlined></MoreOutlined>}></Button>
                    </Dropdown>
                  </Col>
                </Row>
                <Form layout='inline' style={{width: '100%', display: 'flex', justifyContent: 'center', rowGap: '10px'}} onFinish={()=> {addTask()}}> 
                  <Form.Item validateTrigger={['onBlur', 'onChange']} rules={[{required: true, message: 'No empty value'}]}>
                    <Input allowClear name='task_name' placeholder='Task name' required style={{backgroundColor: 'rgb(20, 22, 29)'}} ref={ref} onChange={(e)=> setNewTaskName(e.target.value)}></Input>
                  </Form.Item>

                  <Form.Item>
                    <Button name='Add Task' type='primary' htmlType='submit' aria-label='Click to add task'>Add Task</Button>
                  </Form.Item>   
                </Form>
              </div>
              <main className='content'>
                <List className='tasksList' itemLayout='horizontal' dataSource={tasks} 
                size='default'
                renderItem={(item)=>(
                  <List.Item>
                    <Row wrap={false} gutter={16} align={'middle'} justify={'space-between'} style={{maxWidth: '100%', width: '100%', height:"auto"}}>
                      <Col flex={"none"}><Checkbox defaultChecked = {item.completed} onChange={(e)=> handleComplete(item.id, e.target.checked)}></Checkbox></Col>
                      <Col flex={"auto"} style={{wordWrap: 'break-word'}}>
                          <Text aria-label='Task Name' disabled={item.completed? true: false}  style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', columnGap: '10px', textDecoration: item.completed? 'line-through': 'none'}} editable={!item.completed? {icon:<EditOutlined style={{marginLeft: 'auto'}}/> ,onChange: (val)=>handleEdit(item.id, val)}: false}>{item.name}</Text>
                      </Col>
                      <Col flex={'none'} style={{marginLeft: 'auto'}}>
                        <Popconfirm title='Delete the task' description='Are you sure to delete this task?' okText='Delete' cancelText='no' onConfirm={()=>deleteTask(item.id)}>
                        <Button size='small' aria-label='Edit task' danger type='text' icon={<DeleteOutlined></DeleteOutlined>}></Button>
                        </Popconfirm>
                      </Col>
                    </Row>
                  </List.Item>
                )}>
                </List>
              </main>
            </section>
          </ConfigProvider>
      </div>
    </>
  )
}

export default App
