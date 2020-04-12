import React, { Component } from 'react';
import {
  Link,
  withRouter
} from "react-router-dom";

import './AppHeader.css';
import { Layout, Menu, Dropdown, Avatar, Badge } from 'antd';
import SearchBox from '../components/search/SearchBox';

const Header = Layout.Header;

class AppHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      toggleBoxMessages: false,
      countOfMessages: 0,
      countOfNotifications: 0
    }

    this.handleMenuClick = this.handleMenuClick.bind(this);
    this.toggleBoxMessages = this.toggleBoxMessages.bind(this);
  }

  handleMenuClick({ key }) {
    if (key === "logout") {
      this.props.onLogout();
    }
  }

  toggleBoxMessages() {
    this.setState({ toggleBoxMessages: !this.state.toggleBoxMessages })
  }

  componentDidMount() {
    this.setState({
      toggleBoxMessages : false
    })
  }

  render() {
    let menuItems;

    if (this.props.currentUser) {
      menuItems = [
        <Menu.Item key="/messages">
          <span onClick={this.toggleBoxMessages}>Messages <Badge status="processing" className="message" /></span>
        </Menu.Item>,
        <Menu.Item key="/profile" className="profile-menu">
          <ProfileDropdownMenu
            currentUser={this.props.currentUser}
            handleMenuClick={this.handleMenuClick} />
        </Menu.Item>
      ];
    } else {
      menuItems = [
        <Menu.Item key="/login">
          <Link to="/login">Login</Link>
        </Menu.Item>,
        <Menu.Item key="/signup">
          <Link to="/signup">Signup</Link>
        </Menu.Item>
      ];
    }

    return (
      <div className="main-header">
        <Header className="app-header">
          <div className="container">
            <div className="app-title" >
              <Link to="/">Dating app</Link>
            </div>
            <div>
              <SearchBox />
            </div>
            <Menu
              className="app-menu"
              mode="horizontal"
              selectedKeys={[this.props.location.pathname]}
              style={{ lineHeight: '64px' }} >
              {menuItems}
            </Menu>
          </div>
        </Header>
        {
          this.state.toggleBoxMessages && this.props.currentUser ? (
            <div className="noti-message">
              <div className="link-msg" onClick={this.toggleBoxMessages}>
                  <Link to={`/users/inbox/${this.props.currentUser.username}`}>
                    <div className="txt-msg">Messages ({this.state.countOfMessages})</div>
                    <div className="txt-msg view-all"> View all</div>
                  </Link>
              </div>
              <div className="link-noti" onClick={this.toggleBoxMessages}>
                <Link to={`/users/notification/${this.props.currentUser.username}`}>
                  <div className="txt-msg">Notification ({this.state.countOfNotifications})</div>
                  <div className="txt-msg view-all"> View all</div>
                </Link>
              </div>
            </div>
          ) : null
        }
      </div>
    );
  }
}

function ProfileDropdownMenu(props) {
  const dropdownMenu = (
    <Menu onClick={props.handleMenuClick} className="profile-dropdown-menu">
      <Menu.Divider />
      <Menu.Item key="profile" className="dropdown-item">
        <Link to={`/users/${props.currentUser.username}`}>Profile</Link>
      </Menu.Item>
      <Menu.Item key="logout" className="dropdown-item">
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown
      overlay={dropdownMenu}
      trigger={['click']}
      getPopupContainer={() => document.getElementsByClassName('profile-menu')[0]}>
      <a className="ant-dropdown-link">
        <Avatar style={{ backgroundColor: '#87d068', marginRight: 0 }} icon="user" />
      </a>
    </Dropdown>
  );
}


export default withRouter(AppHeader);