import React, {useContext, useEffect, useState} from 'react';
import {BASE_URL, TOKEN} from "../resources/Const";
import {toast} from "react-toastify";
import {deleteRequest, getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {Pagination, Select} from "antd";
import {Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {AvFeedback, AvField, AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import DatePicker from "react-datepicker";

function Event(history) {

    const value = useContext(GlobalContext);
    const [totalElements, setTotalElements] = useState(0);
    const [eventInfo, setEventInfo] = useState([]);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [placeId, setPlaceId] = useState('');
    const [recreation, setRecreation] = useState([]);
    const [recreationId, setRecreationId] = useState([]);
    const [startTime, setStartTime] = useState(new Date());
    const [endTime, setEndTime] = useState(new Date());
    const [comment, setComment] = useState([]);
    const [commentary, setCommentary] = useState('');
    const [eventType, setEventType] = useState('');
    const [eventStatus, setEventStatus] = useState('');
    const [deleteLink, setDeleteLink] = useState('');
    const [search, setSearch] = useState('');
    const searchType = [
        {value: '', label: 'All'},
        {value: 'CONCERT', label: 'Concert'},
        {value: 'FESTIVAL', label: 'Festival'},
        {value: 'SPORT_COMPETITION', label: 'Sport Competition'},
        {value: 'PARTY', label: 'Party'}
    ];
    const type = [
        {value: 'CONCERT', label: 'Concert'},
        {value: 'FESTIVAL', label: 'Festival'},
        {value: 'SPORT_COMPETITION', label: 'Sport Competition'},
        {value: 'PARTY', label: 'Party'}
    ];
    const statuses = [
        {value: 'ACTIVE', label: 'Active'},
        {value: 'FINISHED', label: 'Finished'},
        {value: 'DELAY', label: 'Delay'},
        {value: 'CANCELED', label: 'Canceled'}
    ]


    async function getUser() {
        return await getRequest(urlPath.authToken);
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getEventInfo(1);
                    getRecreation().then(res => {
                        setRecreation(res.data.object.content);
                    })
                }
            }).catch((error) => {
                localStorage.removeItem(TOKEN);
                toast.error(error);
                value.setLogged(false);
                value.setUser('');
                history.push("/");
            })
        } else {
            value.setLogged(false);
            value.setUser('');
            history.push("/");
        }
    }, [])

    async function getEventInfo(page) {
        return await getRequest(urlPath.getAllEvent + "?page=" + (page - 1) + "&size=10").then(res => {
            console.log(res.data)
            setEventInfo(res.data.object.content);
            setTotalElements(res.data.object.totalElements);
            setPage(page);
        })
    }

    function addEvent(event, error, values) {
        let events = {
            "name": values.name,
            "description": values.description,
            "availableSits": values.availableSits,
            "startTime": formatDate(startTime), // sample -> "2021-10-18 09:00:00"
            "endTime": formatDate(endTime), // sample -> "2021-10-18 09:00:00"
            "eventType": eventType,
            "eventStatus": eventStatus,
            "recreationId": [recreationId]
        }
        saveEvent(events).then(res => {
            if (res.status === 201) {
                toggle();
                toast.success(res.data.message)
                getEventInfo(1);

            }
        }).catch(error => {
            toast.error(error.response.data.message)
        })
    }

    async function saveEvent(event) {
        return await postRequest(urlPath.addEvent, event)
    }

    function formatDate(date) {
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        if (hours < 10) {
            hours = '0' + hours;
        }
        if (minutes < 10) {
            minutes = '0' + minutes;
        }
        if (seconds < 10) {
            seconds = '0' + seconds;
        }
        return [year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds];
    }

    function toggle() {
        setModal(!modal)
    }

    function toggle2(value) {
        setPlaceId(value);
        setModal2(!modal2)
    }

    async function getRecreation() {
        return await getRequest(urlPath.getAllRecreationByExist + "?page=0&size=20");
    }

    async function getRecreationId(event) {
        setRecreationId([]);
        if (event.target.value) {
            setRecreationId(event.target.value);
        }
    }

    async function getComments(id) {
        return await getRequest(urlPath.getCommentary + id).then(res => {
            setComment(res.data);
        })
    }

    function addComment(id) {
        if (commentary.length !== 0) {
            let comment = {
                "commentText": commentary,
                "recreationId": id
            }
            saveComment(comment).then(res => {
                if (res.status === 201) {
                    toast.success(res.data.message)
                    setCommentary('');
                }
            })
        } else return alert("Comment text is empty!");
    }

    async function saveComment(commentary) {
        return await postRequest(urlPath.addCommentary, commentary)

    }

    function deleteToggle(value) {
        if (value !== null) {
            setDeleteLink(value)
        } else {
            setDeleteLink('')
        }
        setModalDelete(!modalDelete)
    }

    function deleteRecreation(value) {
        console.log(value);
        deleteRequest(value).then(res => {
            if (res.status === 200) {
                toast.success(res.data.message)
                getEventInfo(1);
                setModalDelete(false);
            }
        }).catch(error => {
            deleteToggle(null);
            toast.error(error.response.data.errorMessage)
        })
    }

    return (
        <div>
            <br/>
            <div className={'d-flex justify-content-between align-items-center'}>
                <h3>Event Place</h3>
                <div>
                    <label>Search category</label>
                    <Select style={{fontSize: 16, width: 400, marginLeft: 10}} className="mb-2 col-md-12 col-offset-4"
                            options={searchType} onChange={e => setSearch(e)}
                            defaultValue={"All"}
                    />
                </div>
                <button className={'btn btn-success'} onClick={toggle}>Create new Event</button>
            </div>
            <br/>
            <Table bordered striped hover>
                <thead>
                <th>#</th>
                <th>Name</th>
                <th>Event Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Available Sits</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Confirmed</th>
                <th>Deleted</th>
                <th>Ticket</th>
                <th>Recreation</th>
                </thead>
                <tbody>
                {
                    eventInfo
                        // eslint-disable-next-line array-callback-return
                        .filter((value) => {
                                if (search === '') {
                                    return value;
                                } else if (value.eventType.toLowerCase().includes(search.toLowerCase())) {
                                    return value;
                                }
                            }
                        )
                        .map((res, index) =>
                            <tr>
                                <th scope={'row'}>{(page - 1) * 10 + index + 1}</th>
                                <td>{res.name}</td>
                                <td>{res.eventType}</td>
                                <td>{res.description}</td>
                                <td>{res.eventStatus}</td>
                                <td>{res.availableSits}</td>
                                <td>{res.startTime.substring(0, 10) + "  " + res.startTime.substring(11, 16)}</td>
                                <td>{res.endTime.substring(0, 10) + "  " + res.endTime.substring(11, 16)}</td>
                                <th>{res.confirmed + ""}</th>
                                <td>
                                    {
                                        res.isDeleted !== null ?
                                            <Button style={{fontSize: 13}} disabled>Deleted</Button> :
                                            <Button style={{fontSize: 13}} color="danger"
                                                    onClick={() => deleteToggle(urlPath.deleteEvent + res.id)}
                                            >
                                                Delete
                                            </Button>
                                    }
                                </td>
                                <td><Button color="success" style={{fontSize: 13}}>Buy ticket</Button></td>
                                <td style={{width: 300}}>
                                    {
                                        res.recreations.map((response) =>
                                            <div>
                                                Name: {" "}{response.name}
                                                {" "}
                                                Address: {" "} {response.address.building.street.district.name}
                                                {response.address.building.street.name}, {" "}
                                                Building: {response.address.building.buildingNumber} , {" "}
                                                Home: {response.address.homeNumber}
                                                <br/>
                                                <button style={{fontSize: 13}} className={'btn btn-success'}
                                                        onClick={() => toggle2(response.id)}>
                                                    Watch Photos
                                                </button>
                                                {" "}
                                            </div>
                                        )
                                    }
                                </td>
                            </tr>
                        )
                }
                </tbody>
            </Table>
            <Pagination current={page}
                        showTotal={total => `Total ${total} Recreation place`}
                        total={totalElements} onChange={(page) => getEventInfo(page)}
            />

            {/*Add Event Modal*/}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Event</ModalHeader>
                <AvForm onSubmit={addEvent}>
                    <ModalBody>
                        <label>Event</label>
                        <AvGroup>
                            <AvInput name="name" id="name" placeholder="Event name" required/>
                            <AvFeedback>Event name must not be empty!</AvFeedback>
                        </AvGroup>
                        <br/>
                        <AvGroup>
                            <AvInput name="description" id="description" placeholder="Description" required/>
                            <AvFeedback>Description must not be empty!</AvFeedback>
                        </AvGroup>
                        <br/>
                        <AvGroup>
                            <AvInput name="availableSits" id="availableSits" placeholder="Available Sits" required/>
                            <AvFeedback>Available sits must not be empty!</AvFeedback>
                        </AvGroup>
                        <label>Opening Time</label>
                        <DatePicker selected={startTime}
                                    showTimeSelect
                                    minDate={new Date()}
                                    timeFormat="HH:mm:ss"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd hh:mm:ss"
                                    withPortal
                                    onChange={(date) => setStartTime(date)}
                        />
                        <label>Closing Time</label>
                        <DatePicker selected={endTime}
                                    showTimeSelect
                                    minDate={new Date()}
                                    timeFormat="HH:mm:ss"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd hh:mm:ss"
                                    withPortal
                                    onChange={(date) => setEndTime(date)}
                        />
                        <br/>
                        <label>Event Type</label>
                        <Select style={{fontSize: 16}} className="col-md-12 col-offset-4"
                                options={type} onChange={e => setEventType(e)}
                        />
                        <label>Event Status</label>
                        <Select style={{fontSize: 16}} className="col-md-12 col-offset-4"
                                options={statuses} onChange={e => setEventStatus(e)}
                        />
                        <br/>
                        <AvField onChange={getRecreationId} type="select" key="recreation" name="recreation"
                                 label="Recreation" required>
                            <option/>
                            {
                                recreation.map(resp =>
                                    <option
                                        key={resp.id}
                                        value={resp.id}
                                        onChange={() => setRecreationId(resp.id)}
                                    >
                                        {resp.name}
                                    </option>)
                            }
                        </AvField>
                    </ModalBody>
                    <ModalFooter>
                        <FormGroup>
                            <Button color="primary">Add Event</Button>{' '}
                        </FormGroup>
                        <Button color="secondary" onClick={toggle}
                                type={'button'}>Cancel</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>

            {/*Modal For watching photo and comments*/}
            <Modal isOpen={modal2} toggle={toggle2} style={{content: "inherit"}} transparent={true}>
                <ModalHeader toggle={toggle2}>Watch Photo and Commentary</ModalHeader>
                <AvForm>
                    <ModalBody>
                        <AvGroup>
                            <Label for="photo" placeholder="chose photo">Photo</Label>
                            <img style={{width: 470}} src={BASE_URL + urlPath.getPhoto + placeId}/>
                            <br/>
                            <br/>
                            <Button color="secondary" onClick={() => getComments(placeId)}>Comments</Button>
                            {
                                comment.map((comRes, index) =>
                                    <div style={{backgroundColor: "wheat"}}>
                                        {
                                            comRes.createdBy === null ?
                                                <p style={{fontWeight: 'bold'}}
                                                   className={"d-flex flex-row mx-2 my-1"}>By: Unknown</p>
                                                : <p style={{fontWeight: 'bold'}}
                                                     className={"d-flex flex-row mx-2 my-0"}>By : {comRes.createdBy}
                                                    }
                                                </p>
                                        }
                                        <p className={"d-flex flex-row mx-2 my-0"}
                                           style={{margin: "5"}}>Comment: {comRes.commentText}</p>
                                        <p className={"d-flex flex-row mx-2 my-0"}>
                                            Written
                                            time: {comRes.createdAt.substring(0, 10)} {" "} {comRes.createdAt.substring(11, 16)}</p>
                                    </div>
                                )
                            }
                            <AvGroup>
                                <br/>
                                <input onChange={(e) => setCommentary(e.target.value)} name="comment"
                                       id="comment" placeholder={"Your comment(s)"}/>
                                <br/>
                                <Button style={{color: "white", backgroundColor: "green", marginTop: 8}}
                                        onClick={() => addComment(placeId)}>Add comment</Button>
                            </AvGroup>
                            <br/>
                        </AvGroup>
                    </ModalBody>
                </AvForm>
            </Modal>

            {/*Modal Delete Recreation*/}
            <Modal isOpen={modalDelete} toggle={deleteToggle}>
                <ModalHeader>Delete Recreation Place</ModalHeader>
                <ModalBody>
                    Are you sure for deleting?
                </ModalBody>
                <ModalFooter>
                    <FormGroup>
                        <Button color="success" onClick={deleteToggle}>No</Button>{' '}
                    </FormGroup>
                    <Button color="danger" type={'button'} onClick={() => deleteRecreation(deleteLink)}>Yes,
                        delete</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Event;