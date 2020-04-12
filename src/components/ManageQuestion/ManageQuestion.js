import React, { Component } from 'react';
import { Drawer, Form, Button, Col, Row, Input, Select } from 'antd';
import { PlusOutlined, PlusCircleOutlined, DeleteFilled, BackwardFilled, ForwardFilled } from '@ant-design/icons';
import { MIN_QUESTION_NUMBER, MAX_QUESTION_NUMBER } from '../../constants'

const { Option } = Select;

function OneAnswer(props) {
    //
    const doRemove = () => {
        console.log("remove answer");
        
    }
    return (   
        <div style={{ marginBottom: 10 }}>
        <Row gutter={16}>
            <Col span={18}> 
                <Input
                    style={{ width: '100%' }}
                    addonBefore="Answer No."
                    // addonAfter={<Button type="danger">Remove</Button>}
                    placeholder="Please enter answer"
                  />  
        </Col>
        <Col span={6}><Button type="danger" onClick={() => doRemove()}><DeleteFilled /></Button></Col>
        </Row>  
        </div>  
    );
}

class ManageQuestion extends Component {
  state = { 
        quesNo: 1,
        questions: []
    };

  onClose = () => {
    this.props.closeEdit();
  };

  plusQuestion = () => {
    // console.log("+++");
    const quesNo = (this.state.quesNo < MAX_QUESTION_NUMBER) ? this.state.quesNo + 1 : this.state.quesNo;
    this.setState({ quesNo });
  }

  minusQuestion = () => {
    //   console.log("---");
      const quesNo = (this.state.quesNo > MIN_QUESTION_NUMBER) ? this.state.quesNo - 1 : this.state.quesNo;

      this.setState({ quesNo });
  }

  componentDidMount(){
      console.log(`ManageQuestion did mount`);
      const { addNewExam } = this.props;
      if (!addNewExam) {
          const exam  = this.props.exam;
          if ( Object.keys(exam).includes('questions') ){
              const { questions } = exam;    
              this.setState({ questions });        
          }
      }
  }

  render() {
    console.log(this.state.questions);
    const { questions } = this.state;
    let totalQuestion = questions ? questions.length : 0;
    if (questions) {
        console.log(`OK`, questions.length,  typeof questions);
    }
    const allAnswer = [<OneAnswer/>, <OneAnswer/>]
    const allCorrectOption = []
    return (
      <div>
        <Drawer
          title={
            <>
            Create new Question -> <Button type="dashed" onClick={this.minusQuestion}><BackwardFilled /></Button> 
            Question No.{this.state.quesNo}/{totalQuestion} <Button type="dashed" onClick={this.plusQuestion}><ForwardFilled /></Button>
            </>
            }
          width={720}
          onClose={this.onClose}
          visible={this.props.visible}
          bodyStyle={{ paddingBottom: 10, marginBottom: 10 }}          
        >
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="title"
                  label="Question title"
                  rules={[{ required: true, message: 'Please enter question title' }]}
                >
                  <Input placeholder="Please enter question title" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                    name="content"
                    label="Question Content"
                    rules={[
                        {
                        required: true,
                        message: 'please enter question content',
                        },
                    ]}
                    >
                    <Input.TextArea rows={4} placeholder="please enter question content" />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={12}>
                    {/* Answers */}
                    {allAnswer}
                </Col>
                <Col span={12}>
                    {/* Nothing */}
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Button type="default" onClick={this.addAnswer}><PlusCircleOutlined /></Button>
                </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="correct"
                  label="Correct"
                  style={{marginTop: 10}}
                  rules={[{ required: true, message: 'Please choose the correct answer' }]}
                >
                  <Select placeholder="Please choose the correct answer" required={true}>
                    <Option value="jack">Jack Ma</Option>
                    <Option value="tom">Tom Liu</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
              </Col>
            </Row>

            <Row gutter={16}>
                <Col span={24}>
                    <Button type="ghost" >Submit</Button>
                </Col>
            </Row>

          </Form>
        </Drawer>
      </div>
    );
  }
}

export default ManageQuestion;
