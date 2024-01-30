import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { Button, Row, Col, Card, Divider, Input, Flex ,Spin} from 'antd';
import { RightSquareOutlined, EditFilled,DeleteFilled } from '@ant-design/icons';



interface Duty {
  id: string;
  name: string;
}

var App: React.FC = () => {
  const [dutyFullList, setDutyFullLists] = useState<Duty[]>([])
  const [targetDuty, setTargetDuty] = useState<Duty>({ id: "", name: "" })

  const handleSelectDuty = (duty: Duty) => {
    setTargetDuty(duty)
  }
  const handleEditTargetDuty = (event: any) => {
    setTargetDuty({ ...targetDuty, name: event.target.value })
  }

  const handleCreateNewDutyClick = ()=> {
    setTargetDuty({id:"-1",name:""})
  }

  const handleConfirmSavingTargetDuty = async() => {
    if (targetDuty.name === "") {
      window.alert("Duty cannot be blank.")
      return
  }
    if(targetDuty.id === "-1"){
      await axios.post(`http://localhost:8080/duty`,{"dutyName": targetDuty.name})
      .catch(error => console.error(error));
    } else {
      await axios.put(`http://localhost:8080/duty?dutyId=${targetDuty.id}&dutyName=${targetDuty.name}`)
      .catch(error => console.error(error));
    }
      setTargetDuty({id: "", name: ""})
      loadAllDuties();
  }

  const handleDeleteDutyClick = async(dutyId:string) => {
    await axios.delete(`http://localhost:8080/duty?dutyId=${dutyId}`)
    .catch(error => console.error(error));
    loadAllDuties();
  }


  const loadAllDuties = () => {
    axios.get('http://localhost:8080/duty')
    .then(response => {
      setDutyFullLists(response.data.result)
    })
    .catch(error => console.error(error));
  }

  

  useEffect(() => {
    loadAllDuties();
  }, []);

  return (
    <Row>
      <Col span={12} push={6}>
        <Card className='mainBackGround'>
          <div className='tlt'>TODO List -  By Puil Chau</div>
          <Divider></Divider>
          <Button onClick={handleCreateNewDutyClick}>+ New</Button>
          {
            targetDuty.id === "-1"?
            <Flex gap="middle" vertical={false} className='dutyRow' id="dutyRow">
              <RightSquareOutlined className='iconClass' style={{ fontSize: '30px', color: '#08c' }} />
              <Flex gap="middle" vertical={false} align="center" >
                    <Input className='dutyNameSelected' onChange={handleEditTargetDuty} value={targetDuty.name} />
                    <Button onClick={handleConfirmSavingTargetDuty}>Create New Duty</Button>
                  </Flex>
              </Flex>
            :null
          }

          {dutyFullList.length > 0?
          dutyFullList.map((currentDuty) =>
            <Flex gap="middle" vertical={false} className='dutyRow' key={currentDuty.id}>
              <RightSquareOutlined className='iconClass' style={{ fontSize: '30px', color: '#08c' }} />
              {
                currentDuty.id !== targetDuty.id ?
                <Flex gap="middle" vertical={false} align="center" justify="space-between">
                    <div className='dutyNameNotSelected' >{currentDuty.name}</div>
                    <EditFilled style={{ fontSize: '20px' }} onClick={() => handleSelectDuty(currentDuty)}/>
                    <DeleteFilled style={{ fontSize: '20px' }} onClick={()=> handleDeleteDutyClick(currentDuty.id)}/>
                  </Flex>
                  :
                  <Flex gap="middle" vertical={false} align="center">
                    <Input className='dutyNameSelected' onChange={handleEditTargetDuty} value={targetDuty.name} />
                    <Button onClick={handleConfirmSavingTargetDuty}>Save</Button>
                    
                  </Flex>

              }
            </Flex>
          )
        :
        <Flex gap="middle" vertical={false} className='dutyRow' >
          There is no task within this To-do List. Create a new one!
        </Flex>
        }
        </Card>
      </Col>

    </Row>
  );
}



const TodoList: React.FC = () => {

  const [duties, setDuties] = useState<Duty[]>([]);
  const [newDutyName, setNewDutyName] = useState('');

  useEffect(() => {
    // Fetch duties from the backend
    fetch('/api/duties')
      .then(response => response.json())
      .then(data => setDuties(data))
      .catch(error => console.error(error));
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDutyName(event.target.value);
  };

  const handleAddDuty = () => {
    // Create a new duty and add it to the backend
    const newDuty: Duty = {
      id: Math.random().toString(),
      name: newDutyName
    };

    fetch('/api/duties', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newDuty)
    })
      .then(response => response.json())
      .then(data => {
        setDuties(prevDuties => [...prevDuties, data]);
        setNewDutyName('');
      })
      .catch(error => console.error(error));
  };

  const handleUpdateDuty = (id: string, newName: string) => {
    // Update the name of an existing duty in the backend
    const updatedDuties = duties.map(duty => {
      if (duty.id === id) {
        return { ...duty, name: newName };
      }
      return duty;
    });

    fetch(`/api/duties/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: newName })
    })
      .then(response => response.json())
      .then(() => setDuties(updatedDuties))
      .catch(error => console.error(error));
  };

  const handleDeleteDuty = (id: string) => {
    // Delete a duty from the backend
    fetch(`/api/duties/${id}`, {
      method: 'DELETE'
    })
      .then(() => {
        setDuties(prevDuties => prevDuties.filter(duty => duty.id !== id));
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h1>To-Do List</h1>
      <ul>
        {duties.map(duty => (
          <li key={duty.id}>
            <input
              type="text"
              value={duty.name}
              onChange={(event) => handleUpdateDuty(duty.id, event.target.value)}
            />
            <button onClick={() => handleDeleteDuty(duty.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <input
        type="text"
        value={newDutyName}
        onChange={handleInputChange}
      />
      <button onClick={handleAddDuty}>Add Duty</button>
    </div>
  );
};

// export default TodoList;


export default App;