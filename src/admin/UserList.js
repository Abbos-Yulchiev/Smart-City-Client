import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from "../App";
import {deleteRequest, getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {TOKEN} from "../resources/Const";
import {Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {AvFeedback, AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import {Pagination, Select} from 'antd';
import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap.css';
import {toast} from "react-toastify";

function UserList({history}) {

    const value = useContext(GlobalContext);

    const [modal, setModal] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [modalActivate, setActivate] = useState(false);
    const [deleteUserLink, setDeleteUserLink] = useState('');
    const [activateLink, setActivateLink] = useState('');
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [userRole, setUserRole] = useState('');
    const options = [
        {value: 'ADMIN', label: 'ADMIN'},
        {value: 'USER', label: 'USER'},
    ]

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            value.setLogged(true);
            getUsers().then(res => {
                if (res.data && res.status === 200) {
                    value.setUser(res.data.object);
                }
            }).catch((error) => {
                if (error.status === 403) {
                    localStorage.removeItem(TOKEN);
                    toast.error(error)
                    value.setLogged(false);
                    value.setUser('');
                    history.push("/");
                }
            })
        } else {
            value.setLogged(false);
            value.setUser('');
            history.push("/");
        }
    }, []);

    async function getUsers() {
        return await getRequest(urlPath.getUsers + "?page=" + (page - 1)).then(res => {
            setUsers(res.data.content);
            setTotalElements(res.data.totalElements)
            setPage(page)
        })

    }

    function addUser(event, error, values) {
        let user = {
            "citizenId": values.citizenId,
            "username": values.username,
            "password": values.password,
            "prePassword": values.password,
            "role": userRole
        }
        postRequest(urlPath.addUser, user).then(res => {
            if (res.status === 201) {
                toggle();
                toast.success(res.data.message)
                getUsers();
            }
        }).catch(error => {
            console.log(error);
            toast.error(error.response.data.errorMessage)
        })
    }

    function toggle() {
        setModal(!modal)
    }

    function deleteToggle(value) {
        if (value !== null) {
            setDeleteUserLink(value)
        } else {
            setDeleteUserLink('')
        }
        setModalDelete(!modalDelete)
    }

    function activateToggle(value) {
        if (value !== null) {
            setActivateLink(value);
        } else {
            setActivateLink("")
        }
        setActivate(!modalActivate);
    }

    function deleteUser(value) {
        deleteRequest(value).then(res => {
            if (res.status === 200) {
                toast.success(res.data.message)
                getUsers();
                deleteToggle(null);
            }
        }).catch(error => {
            deleteToggle(null);
            toast.error(error.response.data.errorMessage)
        })
    }

    function deactivateUser(values) {
        postRequest(values).then(res => {
            if (res.status === 202) {
                toast.success(res.data.message)
                getUsers();
                activateToggle(null);
            }
        }).catch(error => {
            toast.error(error.response.data.errorMessage)
            activateToggle(null);
        })
    }

    return <div className={'mt-3'}>
        <div className={'d-flex justify-content-between align-items-center'}>
            <h3>Users</h3>
            <button className={'btn btn-success'} onClick={toggle}>Add User</button>
        </div>

        <Table striped>
            <thead>
            <th>#</th>
            <th>ID</th>
            <th>Firstname</th>
            <th>Lastname</th>
            <th>Card number</th>
            <th>Username</th>
            <th>Role</th>
            <th>Activate</th>
            <th>Delete</th>

            </thead>
            <tbody>
            {
                users.map((res, index) =>
                    <tr>
                        <th scope={'row'}>{(page - 1) * 10 + index + 1}</th>
                        <td>{res.id}</td>
                        <td>{res.firstName}</td>
                        <td>{res.lastName}</td>
                        <td>{res.citizenId}</td>
                        <td>{res.username}</td>
                        <td>{res.roles.map((res) => <a>{" { " + res.name + " } "}</a>)}
                        </td>
                        <td>
                            {
                                (res.deleted === true
                                    || res.is_account_non_expired === false
                                    || res.is_account_non_locked === false
                                    || res.is_credentials_non_expired === false
                                    || res.is_enabled === false
                                )
                                    ?
                                    < Button size="sm" color="warning"
                                             onClick={() => activateToggle(urlPath.deactivateUser + res.id)}
                                    >
                                        Activate User
                                    </Button>
                                    : < Button size="sm" color="btn btn-light"
                                               disabled={true}
                                    >
                                        Activate User
                                    </Button>

                            }
                        </td>
                        {
                            res.deleted ?
                                <td><Button size="sm" color="btn btn-light"
                                            onClick={() => alert("User already deleted!")}>Deleted</Button></td>
                                : <td><Button size="sm" color="danger"
                                              onClick={() => deleteToggle(urlPath.deleteUser + res.id)}>Delete</Button>
                                </td>
                        }
                    </tr>
                )
            }
            </tbody>
        </Table>
        <Pagination current={page}
                    showTotal={total => `Total ${total} users`}
                    total={totalElements}
                    onChange={(page) => getUsers(page)}/>

        {/*Add user Modal*/}
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader>Add User</ModalHeader>
            <AvForm onSubmit={addUser}>
                <ModalBody>
                    <AvGroup>
                        <Label for="citizenId">Citizen ID</Label>
                        <AvInput name="citizenId" id="citizenId" required/>
                        <AvFeedback>Citizen ID must not be empty!</AvFeedback>
                    </AvGroup>
                    <AvGroup>
                        <Label for="username">Username</Label>
                        <AvInput name="username" id="username" required/>
                        <AvFeedback>Username must not be empty!</AvFeedback>
                    </AvGroup>
                    <AvGroup>
                        <Label for="password">Password</Label>
                        <AvInput name="password" id="password" type="password" required/>
                        <AvFeedback>Password must not be empty!</AvFeedback>
                    </AvGroup>
                    <label>Role</label>
                    <Select className="col-md-12 col-offset-4"
                            options={options} onChange={e => setUserRole(e)}
                            placeholder={"Chose role user role..."}
                    />
                </ModalBody>
                <ModalFooter>
                    <FormGroup>
                        <Button color="primary" >Add User</Button>{' '}
                    </FormGroup>
                    <Button color="danger" onClick={toggle} type={'button'}>Cancel</Button>
                </ModalFooter>
            </AvForm>
        </Modal>

        {/*Delete User Modal*/}
        <Modal isOpen={modalDelete} toggle={deleteToggle}>
            <ModalHeader>Delete User</ModalHeader>
            <ModalBody>
                Are you sure for deleting?
            </ModalBody>
            <ModalFooter>
                <FormGroup>
                    <Button color="success" onClick={deleteToggle}>No</Button>{' '}
                </FormGroup>
                <Button color="danger" type={'button'} onClick={() => deleteUser(deleteUserLink)}>Yes, delete</Button>
            </ModalFooter>
        </Modal>

        {/*Modal Activate User */}
        <Modal isOpen={modalActivate} toggle={modalActivate}>
            <ModalHeader>Activate User</ModalHeader>
            <ModalBody>
                Are you sure for Activate User?
            </ModalBody>
            <ModalFooter>
                <FormGroup>
                    <Button color="success" onClick={activateToggle}>No</Button>{' '}
                </FormGroup>
                <Button color="warning" type={'button'} onClick={() => deactivateUser(activateLink)}>
                    Sure! activate</Button>
            </ModalFooter>
        </Modal>
    </div>
}

export default UserList;