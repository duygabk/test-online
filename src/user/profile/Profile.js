import React, { Component } from 'react';
import { getUserProfile, updateProfileUser } from '../../util/APIUtils';
import { Avatar, Input, Form, Row, Col, Button, Upload, notification, Select } from 'antd';
import { getAvatarColor } from '../../util/Colors';
import { formatDate } from '../../util/Helpers';
import LoadingIndicator from '../../common/LoadingIndicator';
import './Profile.css';
import NotFound from '../../common/NotFound';
import ServerError from '../../common/ServerError';
import { withRouter } from 'react-router-dom';
import { countryData, provinceData, VIETNAM, JAPAN } from '../../data/Location';

const { TextArea } = Input;
const { Option } = Select;
const FormItem = Form.Item;

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

function beforeUpload(file) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
        notification.error({
            message: 'Dating App',
            description: 'You can only upload JPG/PNG file!'
        })
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        notification.error({
            message: 'Dating App',
            description: 'You can only upload JPG/PNG file!'
        })
    }
    return isJpgOrPng && isLt2M;
}

class Profile extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            isLoadingImage: false,
            country: '',
            province: '',
            description: '',
            provinces: '',
        }
        this.loadUserProfile = this.loadUserProfile.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.onProvinceChange = this.onProvinceChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
    }

    loadUserProfile(username) {
        this.setState({
            isLoading: true,
        });

        getUserProfile(username)
            .then(response => {
                if (this._isMounted) {
                    if (response.country === VIETNAM) {
                        this.setState({
                            user: response,
                            country: response.country,
                            province: response.province,
                            updateAvatar: response.avatar,
                            description: response.description,
                            isLoading: false,
                            provinces: provinceData[0]
                        });
                    } else {
                        this.setState({
                            user: response,
                            country: response.country,
                            province: response.province,
                            updateAvatar: response.avatar,
                            description: response.description,
                            isLoading: false,
                            provinces: provinceData[1]
                        });
                    }
                }
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    handleSubmit(event) {
        event.preventDefault();

        let editUserRequest = {
            avatar: this.state.updateAvatar,
            id: this.state.user.id,
            country: this.state.country,
            province: this.state.province,
            description: this.state.description
        };

        updateProfileUser(editUserRequest)
            .then(response => {
                this.setState({
                    user: response,
                    isLoading: false,
                });
            }).catch(error => {
                if (error.status === 404) {
                    this.setState({
                        notFound: true,
                        isLoading: false
                    });
                } else {
                    this.setState({
                        serverError: true,
                        isLoading: false
                    });
                }
            });
    }

    handleChangeImage = info => {
        if (info.file.status === 'uploading') {
            this.setState({ isLoadingImage: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, updateAvatar =>
                this.setState({
                    updateAvatar,
                    isLoadingImage: false,
                }),
            );
        }
    };

    handleDescriptionChange = (event) => {
        this.setState({
            description: event.target.value
        })
    }

    handleCountryChange = (country) => {
        if (country == VIETNAM) {
            this.setState({
                country: country,
                province: provinceData[0][0],
                provinces: provinceData[0]
            });
        } else if (country == JAPAN) {
            this.setState({
                country: country,
                province: provinceData[1][0],
                provinces: provinceData[1]
            });
        }
    };

    onProvinceChange = (value) => {
        this.setState({
            province: value
        });
    };

    componentDidMount() {
        this._isMounted = true;
        const username = this.props.match.params.username;
        this.loadUserProfile(username);
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentDidUpdate(nextProps) {
        if (this.props.match.params.username !== nextProps.match.params.username) {
            this.loadUserProfile(nextProps.match.params.username);
        }
    }

    render() {
        if (this.state.isLoading) {
            return <LoadingIndicator />;
        }

        if (this.state.notFound) {
            return <NotFound />;
        }

        if (this.state.serverError) {
            return <ServerError />;
        }

        const provinces = this.state.provinces ? this.state.provinces : this.state.user;

        const editFormUser =
            <div className="form-edit-user">
                <Form onSubmit={this.handleSubmit} className="signup-form">
                    <FormItem label="About">
                        <TextArea
                            value={this.state.description}
                            onChange={(event) => this.handleDescriptionChange(event)}
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </FormItem>

                    {this.state.user !== null ?
                        (
                            <FormItem label="Location">
                                <Select
                                    className="mg-select"
                                    style={{ width: 120 }}
                                    value={this.state.country}
                                    onChange={this.handleCountryChange}
                                >
                                    {countryData.map(country => (
                                        <Option key={country}>{country}</Option>
                                    ))}
                                </Select>

                                <Select
                                    style={{ width: 120 }}
                                    value={this.state.province}
                                    onChange={this.onProvinceChange}
                                >
                                    {this.state.user.province.length > 0 && provinces.map(province => (
                                        <Option key={province}>{province}</Option>
                                    ))}
                                </Select>
                            </FormItem>
                        ) : null}

                    <FormItem>
                        <Button type="danger"
                            htmlType="submit"
                            className="btn-save">Save</Button>
                    </FormItem>

                </Form>
            </div>


        let imageUser;

        if (this.state.updateAvatar) {
            imageUser = this.state.updateAvatar;
        } else if (this.state.user) {
            imageUser = this.state.user.avatar;
        }

        return (
            <div className="profile">
                {
                    this.state.user && this.props.isAuthenticated ? (
                        <Row type="flex" justify="center" align="top">
                            <Col span={4} offset={2}>
                                <div className="form-edit-user">
                                    <Form.Item>
                                        <div className="user-avatar">
                                            <div>
                                                <Upload
                                                    name="avatar"
                                                    listType="picture-card"
                                                    className="avatar-uploader"
                                                    showUploadList={false}
                                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                                    beforeUpload={beforeUpload}
                                                    onChange={this.handleChangeImage}
                                                >
                                                    {imageUser ? (
                                                        <div>
                                                            <img className="user-avatar-circle" src={imageUser} />
                                                            <p>Update Photo</p>
                                                        </div>
                                                    ) : (
                                                            <div>
                                                                <Avatar className="user-avatar-circle" style={{ backgroundColor: getAvatarColor(this.state.user.name) }}>
                                                                    {this.state.user.name[0].toUpperCase()}
                                                                </Avatar>
                                                                <p>Update Photo</p>
                                                            </div>
                                                        )
                                                    }
                                                </Upload>
                                            </div>
                                        </div>
                                    </Form.Item>
                                </div>
                            </Col>
                            <Col span={8} offset={2}>
                                <div className="user-profile">
                                    <div className="user-details">
                                        <div className="user-summary">
                                            <div className="full-name">{this.state.user.name}</div>
                                            {/* <div className="username">@{this.state.user.username}</div> */}
                                            <div className="user-joined">
                                                Joined {formatDate(this.state.user.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                    {editFormUser}
                                </div>
                            </Col>
                        </Row>
                    ) : null}
            </div>
        );
    }
}

export default withRouter(Profile);