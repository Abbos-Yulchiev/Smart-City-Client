import React, {useContext, useEffect, useState} from 'react';
import {BASE_URL, TOKEN} from "../resources/Const";
import {toast, ToastContainer} from "react-toastify";
import {deleteRequest, getRequest, postRequest, putRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {Pagination, Select} from "antd";
import {Button, FormGroup, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {AvFeedback, AvField, AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import DatePicker from "react-datepicker";

function Event({history}) {

    const value = useContext(GlobalContext);
    const [totalElements, setTotalElements] = useState(0);
    const [eventInfo, setEventInfo] = useState([]);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [placeId, setPlaceId] = useState('');
    const [eventId, setEventId] = useState('');
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
        {value: 'PARTY', label: 'Party'}
    ];
    const type = [
        {value: 'CONCERT', label: 'Concert'},
        {value: 'FESTIVAL', label: 'Festival'},
        {value: 'PARTY', label: 'Party'}
    ];
    const statuses = [
        {value: 'ACTIVE', label: 'Active'},
        {value: 'FINISHED', label: 'Finished'},
        {value: 'DELAY', label: 'Delay'},
        {value: 'CANCELED', label: 'Canceled'}
    ]

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getEventInfo(1);
                    getRecreation().then(res => {
                        setRecreation(res.data.content);
                    })
                }
            })/*.catch((error) => {
                localStorage.removeItem(TOKEN);
                toast.error(error);
                value.setLogged(false);
                value.setUser('');
                history.push("/");
            })*/
        } else {
            value.setLogged(false);
            value.setUser('');
            history.push("/");
        }
    }, [])

    async function getUser() {
        return await getRequest(urlPath.authToken);
    }

    async function getEventInfo(page) {
        return await getRequest(urlPath.getAllEvent + "?page=" + (page - 1) + "&size=10").then(res => {
            setEventInfo(res.data.content);
            setTotalElements(res.data.totalElements);
            setPage(page);
        })
    }

    async function saveComment(commentary) {
        return await postRequest(urlPath.addCommentary, commentary)

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

    async function saveEvent(event) {
        return await postRequest(urlPath.addEvent, event)
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
            else if (res.status === 409){
                toast.success(res.data.message)
            }

        }).catch(error => {
            toast.error("Error occurred!")
        })
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

    function toggle3(value) {
        setEventId(value);
        setStatusModal(false);
    }

    function deleteToggle(value) {
        if (value !== null) {
            setDeleteLink(value)
            setModalDelete(!modalDelete)
        } else {
            setDeleteLink('')
            setModalDelete(!modalDelete)
        }
    }

    function statusToggle() {
        setStatusModal(!statusModal)
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

    function deleteEvent(value) {
        deleteRequest(value).then(res => {
            if (res.status === 200) {
                toast.success(res.data.message)
                getEventInfo(1);
                setModalDelete(false);
            }
        }).catch(error => {
            deleteToggle(null);
            toast.error("Error occurred or Event already deleted!")
        })
    }

    function ticketUrl() {
        history.push("/Admin/Event")
    }

    async function editEventStatus(status) {
        return await putRequest(urlPath.editEventStatus + eventId, status)
    }

    function editStatus(event, error, values) {

        editEventStatus(eventStatus).then(res => {
            if (res.status === 202) {
                console.log(res);
                toast.success(res.data.message)
                statusToggle();
            }
        }).catch(error => {
            toast.error("Error occurred!")
        })
    }

    return (
        <div>
            <ToastContainer/>
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
                <th>Edit Status</th>
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
                                <td>{res.startTime[0] + "-" + res.startTime[1] + "-" + res.startTime[2] + " " + res.startTime[3] + ":" + res.startTime[4]}</td>
                                <td>{res.endTime[0] + "-" + res.endTime[1] + "-" + res.endTime[2] + " " + res.endTime[3] + ":" + res.endTime[4]}</td>
                                <th>{res.confirmed + ""}</th>
                                <td>
                                    <Button onClick={() => {
                                        toggle3(res.id);
                                        statusToggle();
                                    }} style={{backgroundColor: "#1c80b6", fontSize: 14, width: 100}}>Edit
                                        status</Button>
                                </td>
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
                                <td>
                                    {
                                        res.isDeleted !== null
                                            ? <Button style={{fontSize: 13}} disabled>Tickets</Button>
                                            : <Button href={`/admin/Tickets/${res.id}`} onClick={ticketUrl}
                                                      color="warning"
                                                      style={{fontSize: 13}}>
                                                Tickets
                                            </Button>
                                    }
                                </td>
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

            {/*Edit status modal*/}
            <Modal isOpen={statusModal} toggle={statusToggle}>
                <ModalHeader toggle={statusToggle}>Edit status</ModalHeader>
                <AvForm onSubmit={editStatus}>
                    <ModalBody>
                        <Select className="col-md-12"
                                options={statuses} onChange={e => setEventStatus(e)}
                                defaultValue={"Active"}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <FormGroup>
                            <Button color="primary">Submit</Button>{' '}
                        </FormGroup>
                        <Button color="secondary" onClick={statusToggle}
                                type={'button'}>Cancel</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>

            {/*Modal For watching photo and comments*/}
            <Modal isOpen={modalDelete} toggle={deleteToggle}>
                <ModalHeader>Delete Event</ModalHeader>
                <ModalBody>
                    Are you sure for deleting?
                </ModalBody>
                <ModalFooter>
                    <FormGroup>
                        <Button color="success" onClick={deleteToggle}>No</Button>{' '}
                    </FormGroup>
                    <Button color="danger" type={'button'} onClick={() => deleteEvent(deleteLink)}>Yes,
                        delete</Button>
                </ModalFooter>
            </Modal>

            {/*Modal Delete Event*/}
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
                                    <div style={{marginTop: 10, backgroundColor: "wheat"}}>
                                        {
                                            comRes[0] === null
                                                ?
                                                <p className={"d-flex flex-row mx-2 my-1"}>
                                                    By: Unknown
                                                </p>
                                                : <p className={"d-flex flex-row mx-2 my-0"}>
                                                    By : {comRes.writer}
                                                </p>
                                        }
                                        <p className={"d-flex flex-row mx-2 my-0"}
                                           style={{margin: "5"}}>Comment: {comRes.commentText}</p>
                                        <p className={"d-flex flex-row mx-2 my-0"}>
                                            Written
                                            time: {comRes.writtenTime[0] + "-" + comRes.writtenTime[1] + "-" + comRes.writtenTime[2] + " " + comRes.writtenTime[3] + ":" + comRes.writtenTime[4]}
                                        </p>
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
        </div>
    );
}

export default Event;