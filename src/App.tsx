import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import * as dotenv from 'dotenv';
import { Button, Row, Col, Card, Divider, Input, Flex ,Spin} from 'antd';
import { RightSquareOutlined, EditFilled,DeleteFilled } from '@ant-design/icons';
import const_1 from './constants'


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
      await axios.post(`${const_1.REACT_APP_API_SERVER}/duty`,{"dutyName": targetDuty.name})
      .catch(error => console.error(error));
    } else {
      await axios.put(`${const_1.REACT_APP_API_SERVER}/duty?dutyId=${targetDuty.id}&dutyName=${targetDuty.name}`)
      .catch(error => console.error(error));
    }
      setTargetDuty({id: "", name: ""})
      loadAllDuties();
  }

  const handleDeleteDutyClick = async(dutyId:string) => {
    await axios.delete(`${const_1.REACT_APP_API_SERVER}/duty?dutyId=${dutyId}`)
    .catch(error => console.error(error));
    loadAllDuties();
  }


  const loadAllDuties = () => {
    axios.get(`${const_1.REACT_APP_API_SERVER}/duty`)
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

export default App;