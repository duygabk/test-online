import React, { Component } from 'react';
import { signup, checkUsernameAvailability, checkEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { Link } from 'react-router-dom';
import {
    NAME_MIN_LENGTH, NAME_MAX_LENGTH,
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';

import { Form, Input, Button, notification, Radio, Upload, Icon, Select, Row, Col } from 'antd';
import { countryData, provinceData, VIETNAM, JAPAN } from '../../data/Location';

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

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: {
                value: ''
            },
            username: {
                value: ''
            },
            email: {
                value: ''
            },
            password: {
                value: ''
            },
            gender: {
                value: ''
            },

            day: {
                value: ''
            },

            month: {
                value: ''
            },

            year: {
                value: ''
            },

            country: {
                value: ''
            },

            province: {
                value: ''
            },

            provinces: '',

            isLoadingImage: false
        }

        const year = (new Date()).getFullYear();
        this.years = Array.from(new Array(100), (val, index) => year - index);

        this.days = Array.from(new Array(31), (val, index) => index + 1);


        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSelectInput = this.handleSelectInput.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validateUsernameAvailability = this.validateUsernameAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
        this.handleChangeImage = this.handleChangeImage.bind(this);
        this.handleCountryChange = this.handleCountryChange.bind(this);
        this.onProvinceChange = this.onProvinceChange.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;
        this.setState({
            [inputName]: {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSelectInput(value, type, validationFun) {
        switch (type) {
            case "day":
                this.setState({
                    [type]: {
                        value,
                        ...validationFun(value)
                    }
                })
                break;
            case "month":
                this.setState({
                    [type]: {
                        value,
                        ...validationFun(value)
                    }
                })
                break;
            case "year":
                this.setState({
                    [type]: {
                        value,
                        ...validationFun(value)
                    }
                })
                break;
        }
    }

    handleSubmit(event) {
        event.preventDefault();

        const signupRequest = {
            name: this.state.name.value,
            email: this.state.email.value,
            username: this.state.username.value,
            password: this.state.password.value,
            gender: this.state.gender.value,
            avatar: this.state.avatar,
            birthDay: this.state.year.value + '-' + this.state.month.value + '-' + this.state.day.value,
            country: this.state.country.value,
            province: this.state.province.value
        };
        signup(signupRequest)
            .then(response => {
                notification.success({
                    message: 'Dating App',
                    description: "Thank you! You're successfully registered. Please Login to continue! and check email inbox",
                });
                this.props.history.push("/login");
            }).catch(error => {
                notification.error({
                    message: 'Dating App',
                    description: error.message || 'Sorry! Something went wrong. Please try again!'
                });
            });
    }

    isFormInvalid() {
        return !(this.state.name.validateStatus === 'success' &&
            this.state.username.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.password.validateStatus === 'success' &&
            this.state.gender.validateStatus === 'success' &&
            this.state.day.validateStatus === 'success' &&
            this.state.month.validateStatus === 'success' &&
            this.state.year.validateStatus === 'success' &&
            this.state.country.validateStatus === 'success' &&
            this.state.province.validateStatus === 'success'
        );
    }

    handleChangeImage = info => {
        if (info.file.status === 'uploading') {
            this.setState({ isLoadingImage: true });
            return;
        }
        if (info.file.status === 'done') {
            // Get this url from response in real world.
            getBase64(info.file.originFileObj, avatar =>
                this.setState({
                    avatar,
                    isLoadingImage: false,
                }),
            );
        }
    };

    handleCountryChange = (country, validationFun) => {

        if (country === VIETNAM) {
            this.setState({
                country: {
                    value: country, ...validationFun(country)
                },
                province: {
                    value: provinceData[0][0], ...validationFun(country)
                },
                provinces: provinceData[0]
            });
        } else if (country === JAPAN) {
            this.setState({
                country: {
                    value: country, ...validationFun(country)
                },
                province: {
                    value: provinceData[1][0], ...validationFun(country)
                },
                provinces: provinceData[1]
            });
        }
    };

    onProvinceChange = (value, validationFun) => {
        this.setState({
            province: { value: value, ...validationFun(value) }
        });
    };

    render() {
        const uploadButton = (
            <div>
                <Icon type={this.state.isLoadingImage ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        const { avatar } = this.state;

        const provinces = this.state.provinces;

        return (
            <div className="signup-container">
                <h1 className="page-title">Sign Up</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input
                                suffix={<Icon type="mail" />}
                                size="large"
                                name="email"
                                type="email"
                                autoComplete="off"
                                placeholder="Email address"
                                value={this.state.email.value}
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)} />
                        </FormItem>

                        <FormItem
                            hasFeedback
                            validateStatus={this.state.name.validateStatus}
                            help={this.state.name.errorMsg}>
                            <Input
                                suffix={<Icon type="user" />}
                                size="large"
                                name="name"
                                autoComplete="off"
                                placeholder="Full name"
                                value={this.state.name.value}
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />
                        </FormItem>

                        <FormItem
                            hasFeedback
                            validateStatus={this.state.username.validateStatus}
                            help={this.state.username.errorMsg}>
                            <Input
                                suffix={<Icon type="user" />}
                                size="large"
                                name="username"
                                autoComplete="off"
                                placeholder="Username"
                                value={this.state.username.value}
                                onBlur={this.validateUsernameAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateUsername)} />
                        </FormItem>

                        <FormItem
                            validateStatus={this.state.gender.validateStatus}
                            help={this.state.gender.errorMsg}>
                            <Radio.Group name="gender" value={this.state.gender.value} onChange={(event) => this.handleInputChange(event, this.validateGender)}>
                                <Radio value="male">Male</Radio>
                                <Radio value="female">Female</Radio>
                                <Radio value="other">Other</Radio>
                            </Radio.Group>
                        </FormItem>

                        <FormItem label="Avatar">
                            <Row gutter={8}>
                                <Col span={8}>
                                    <Upload
                                        name="avatar"
                                        listType="picture-card"
                                        className="avatar-uploader"
                                        showUploadList={false}
                                        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                        beforeUpload={beforeUpload}
                                        onChange={this.handleChangeImage}
                                    >
                                        {avatar ? <img src={avatar} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
                                    </Upload>

                                </Col>
                                <Col span={16}>
                                    <Select
                                        defaultValue="Country"
                                        className="mg-select"
                                        style={{ width: 120 }}
                                        onChange={(event) => this.handleCountryChange(event, this.validateLocation)}
                                    >
                                        {countryData.map(country => (
                                            <Option key={country}>{country}</Option>
                                        ))}
                                    </Select>

                                    <Select
                                        style={{ width: 120 }}
                                        value={this.state.province.value}
                                        onChange={(event) => this.onProvinceChange(event, this.validateLocation)}
                                    >
                                        {this.state.province.value.length > 0 && provinces.map(province => (
                                            <Option key={province}>{province}</Option>
                                        ))}
                                    </Select>
                                </Col>
                            </Row>
                        </FormItem>

                        <FormItem
                            hasFeedback
                            validateStatus={this.state.password.validateStatus}
                            help={this.state.password.errorMsg}>
                            <Input
                                suffix={<Icon type="lock" />}
                                size="large"
                                name="password"
                                type="password"
                                autoComplete="off"
                                placeholder="Create a password between 6 to 20 characters"
                                value={this.state.password.value}
                                onChange={(event) => this.handleInputChange(event, this.validatePassword)} />
                        </FormItem>

                        <div>Birthday</div>
                        <div>To sign up, you need to be at least 18. Other people who use website won’t see your birthday.</div>
                        <FormItem>
                            <Select defaultValue="Month" className="mg-select" onChange={(event) => this.handleSelectInput(event, "month", this.validateBirthDay)} style={{ width: 120 }}>
                                <Option value="disabled" disabled>
                                    Month
                                </Option>
                                <Option value="01">January</Option>
                                <Option value="02">February</Option>
                                <Option value="03">March</Option>
                                <Option value="04">April</Option>
                                <Option value="05">May</Option>
                                <Option value="06">June</Option>
                                <Option value="07">July</Option>
                                <Option value="08">August</Option>
                                <Option value="09">September</Option>
                                <Option value="10">October</Option>
                                <Option value="11">November</Option>
                                <Option value="12">December</Option>
                            </Select>

                            <Select defaultValue="Day" className="mg-select" onChange={(event) => this.handleSelectInput(event, "day", this.validateBirthDay)} style={{ width: 120 }}>
                                <Option value="disabled" disabled>
                                    Day
                                </Option>
                                {
                                    this.days.map((day, index) => {
                                        if (day > 9) {
                                            return <Option key={`day${index}`} value={day}>{day}</Option>
                                        } else {
                                            return <Option key={`day${index}`} value={'0' + day}>{day}</Option>
                                        }

                                    })
                                }
                            </Select>
                            <Select defaultValue="Year" onChange={(event) => this.handleSelectInput(event, "year", this.validateBirthDay)} style={{ width: 120 }}>
                                <Option value="disabled" disabled>
                                    Year
                                </Option>
                                {
                                    this.years.map((year, index) => {
                                        return <Option key={`year${index}`} value={year}>{year}</Option>
                                    })
                                }
                            </Select>
                        </FormItem>

                        <FormItem>
                            <Button type="danger"
                                htmlType="submit"
                                size="large"
                                className="signup-form-button"
                                disabled={this.isFormInvalid()}>Sign up</Button>
                            Already have an account? <Link to="/login">Login now!</Link>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateName = (name) => {
        if (name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

    validateEmail = (email) => {
        if (!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if (!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if (email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validateUsername = (username) => {
        if (username.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Username is too short (Minimum ${USERNAME_MIN_LENGTH} characters needed.)`
            }
        } else if (username.length > USERNAME_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Username is too long (Maximum ${USERNAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validateGender = (gender) => {
        if (gender.length < 0) {
            return {
                validateStatus: 'error',
                errorMsg: `Gender may not be empty`
            }
        }

        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateBirthDay = (value) => {
        if (value == null || value == undefined) {
            return {
                validateStatus: 'error',
                errorMsg: `Day, Month or Year may not be empty`
            }
        }
        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateLocation = (value) => {
        if (value == null || value == undefined) {
            return {
                validateStatus: 'error',
                errorMsg: `Country or Province may not be empty`
            }
        }
        return {
            validateStatus: 'success',
            errorMsg: null
        }
    }

    validateUsernameAvailability() {
        // First check for client side errors in username
        const usernameValue = this.state.username.value;
        const usernameValidation = this.validateUsername(usernameValue);

        if (usernameValidation.validateStatus === 'error') {
            this.setState({
                username: {
                    value: usernameValue,
                    ...usernameValidation
                }
            });
            return;
        }

        this.setState({
            username: {
                value: usernameValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkUsernameAvailability(usernameValue)
            .then(response => {
                if (response.available) {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        username: {
                            value: usernameValue,
                            validateStatus: 'error',
                            errorMsg: 'This username is already taken'
                        }
                    });
                }
            }).catch(error => {
                // Marking validateStatus as success, Form will be recchecked at server
                this.setState({
                    username: {
                        value: usernameValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            });

    }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if (emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
            .then(response => {
                if (response.available) {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'success',
                            errorMsg: null
                        }
                    });
                } else {
                    this.setState({
                        email: {
                            value: emailValue,
                            validateStatus: 'error',
                            errorMsg: 'This Email is already registered'
                        }
                    });
                }
            }).catch(error => {
                // Marking validateStatus as success, Form will be recchecked at server
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            });
    }

    validatePassword = (password) => {
        if (password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };
        }
    }

}

export default Signup;