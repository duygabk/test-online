import React, { Component } from 'react';
import { List, Avatar, Button, Skeleton } from 'antd';
import './QuestionList.css';
import { getQuestion, getAllQuestion, removeExamByNumber } from '../../util/firebase'
import { DeleteOutlined, EditOutlined, PlusOutlined} from '@ant-design/icons'
import ManageQuestion from '../ManageQuestion/ManageQuestion';

// import reqwest from 'reqwest';

const count = 3;
// const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

const ListItem = (props) => {

  const {exam, examNo, doEdit} = props;

  const editExam = () => {
    console.log(`edit exam....`);
    // show edit form and load data into form
    doEdit(examNo);
  }

  const removeExam = async () => {
    // console.log(`remove exam....`);
    await removeExamByNumber(examNo);
    console.log(`remove ${examNo}`);
  }
  
  // console.log(`Exam No.${examNo}`);

  return (
    <div>
    <List.Item
      actions={[
      <Button type="primary" onClick={editExam}><EditOutlined /></Button>, 
      <Button type="danger" onClick={removeExam}><DeleteOutlined /></Button>
    ]}
    >
      <Skeleton avatar title={false} loading={props.loading} active>
        <List.Item.Meta
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title={<h3>{exam.title}</h3>}
          description={exam.content}
        />
      </Skeleton>
    </List.Item>
    </div>
  );
}

class ListExam extends Component {
    state = {
      initLoading: true,
      loading: false,
      data: [],
      list: [],
      showEdit: false,
      examNo: null,
      addNewExam: true
    };
  
    componentDidMount() {
      getAllQuestion().then(resp => {
        this.setState({
          data: resp,
          list: resp,
          initLoading: false,
        });
      });    
    }  
    onLoadMore = () => {
      this.setState({
        loading: true,
        list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
      });
      this.getData(res => {
        const data = this.state.data.concat(res.results);
        this.setState(
          {
            data,
            list: data,
            loading: false,
          },
          () => {
            // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
            // In real scene, you can using public method of react-virtualized:
            // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
            window.dispatchEvent(new Event('resize'));
          },
        );
      });
    };

    doEdit = async(examNo) => {
      this.setState({ 
        showEdit: true,
        examNo,
        addNewExam: false
      });
    }

    closeEdit = () => {
      this.setState({ showEdit: false });
    }

    render() {
      const { initLoading, loading, list } = this.state;
      const loadMore =
        !initLoading && !loading ? (
          <div
            style={{
              textAlign: 'center',
              marginTop: 12,
              height: 32,
              lineHeight: '32px',
            }}
          >
            <Button onClick={this.onLoadMore}>loading more</Button>
          </div>
        ) : null;
      const {data, examNo} = this.state;
      const listItem = data.map((x, k) => <ListItem exam={x} examNo={k} doEdit={this.doEdit}/>);
      const questionManager = this.state.showEdit ? <ManageQuestion visible={this.state.showEdit} closeEdit={this.closeEdit} exam={data[examNo]} addNewExam={this.state.addNewExam} /> : null;
      return (
        <>
        {questionManager}
        <Button type="primary" onClick={this.showDrawer}>
          <PlusOutlined /> New Exam
        </Button>
        <List
          className="demo-loadmore-list"
          loading={initLoading}
          itemLayout="horizontal"
          loadMore={loadMore}
        >
          {listItem}
        </List>
        </>
      );
    }
  }
  

class QuestionList extends Component {
    constructor(props) {
        super(props);
        this.state={
        }
        // bind this to all function

    }

    componentDidMount() {
        // load all Questions from database

    }    
    render() {
        return (
            <React.Fragment>
                <ListExam />
            </React.Fragment>
        );
    }
}

export default QuestionList;

