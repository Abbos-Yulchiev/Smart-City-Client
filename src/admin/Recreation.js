import React, {useContext, useEffect, useState} from 'react';
import {deleteRequest, getRequest, postRequest, putRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {BASE_URL, MAIN_EXTERNAL_URL, TOKEN} from "../resources/Const";
import {toast, ToastContainer} from "react-toastify";
import 'bootstrap/dist/css/bootstrap.css';
import 'antd/dist/antd.css'
import {Pagination, Select, Upload} from "antd";
import {Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {AvFeedback, AvField, AvForm, AvGroup, AvInput} from "availity-reactstrap-validation";
import axios from "axios";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";
import {UploadOutlined} from "@ant-design/icons";
import * as PropTypes from "prop-types";

function TimePicker(props) {
    return null;
}

TimePicker.propTypes = {
    onChange: PropTypes.func,
    value: PropTypes.any
};

function Recreation({history}) {


    const value = useContext(GlobalContext);
    const [modal, setModal] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [modal2, setModal2] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [placeInfo, setPlaceInfo] = useState([]);
    const [comment, setComment] = useState([]);
    const [commentary, setCommentary] = useState('');
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [districts, setDistricts] = useState([]);
    const [streets, setStreets] = useState([]);
    const [buildings, setBuildings] = useState([]);
    const [houses, setHouses] = useState([]);
    const [placeId, setPlaceId] = useState('');
    const [homeId, setHomeId] = useState('');
    const [openingTime, setOpeningTime] = useState(new Date());
    const [closingTime, setClosingTime] = useState('23:30');
    const [search, setSearch] = useState('');
    const [recreationCategory, setRecreationCategory] = useState('');
    const [recreationStatus, setRecreationStatus] = useState('');
    const [deleteLink, setDeleteLink] = useState('');
    const category = [
        {value: 'PARK', label: 'Park'},
        {value: 'THEATRE', label: 'Theatre'},
        {value: 'GARDEN', label: 'Garden'},
        {value: 'MUSEUM', label: 'Museum'},
        {value: 'BAY', label: 'Bay'},
        {value: 'SWIMMING_POOL', label: 'Swimming Pool'}
    ];
    const searchCategory = [
        {value: '', label: 'All'},
        {value: 'PARK', label: 'Park'},
        {value: 'THEATRE', label: 'Theatre'},
        {value: 'GARDEN', label: 'Garden'},
        {value: 'MUSEUM', label: 'Museum'},
        {value: 'BAY', label: 'Bay'},
        {value: 'SWIMMING_POOL', label: 'Swimming Pool'}
    ];
    const status = [
        {value: 'OPEN', label: 'Open'},
        {value: 'CLOSED', label: 'Closed'},
        {value: 'RESTORATION', label: 'Restoration'}
    ]

    function onChange(e) {
        console.log(e);
        setClosingTime(e)
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getPlaceInfo(1);
                    getDistricts().then(res => {
                        setDistricts(res.data.result);
                    });
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

    async function getUser() {
        return await getRequest(urlPath.authToken);
    }

    async function getPlaceInfo(page) {
        return await getRequest(urlPath.getAllRecreation + "?page=" + (page - 1) + "&size=10").then(res => {
            setPlaceInfo(res.data.content);
            setTotalElements(res.data.totalElements);
            setPage(page);
        })
    }

    async function getComments(id) {
        return await getRequest(urlPath.getCommentary + id).then(res => {
            setComment(res.data);
        })
    }

    async function getDistricts() {
        return await axios.get(MAIN_EXTERNAL_URL + urlPath.getDistrict);
    }

    async function saveComment(commentary) {
        return await postRequest(urlPath.addCommentary, commentary)

    }

    async function saveRecreation(recreation) {
        console.log(recreation);
        return await postRequest(urlPath.addNewRecreation, recreation);
    }

    async function getStreet(event) {
        setStreets([]);
        setBuildings([])
        setHouses([])
        if (event.target.value) {
            await axios.get(MAIN_EXTERNAL_URL + urlPath.getStreet + event.target.value).then(res => {
                setStreets(res.data.result);
            });
        }
    }

    async function getBuilding(event) {
        setBuildings([])
        setHouses([])
        if (event.target.value) {
            await axios.get(MAIN_EXTERNAL_URL + urlPath.getCommercialBuilding + event.target.value).then(res => {
                setBuildings(res.data.result);
            });
        }
    }

    async function getHome(event) {
        setHouses([])
        if (event.target.value) {
            await axios.get(MAIN_EXTERNAL_URL + urlPath.getOffices + event.target.value).then(res => {
                setHouses(res.data.result);
            });
        }
    }

    async function uploadPhoto(id, data) {
        await postRequest(urlPath.addPhoto + id, data);
    }

    async function removePhoto() {
        await deleteRequest(urlPath.deletePhoto + placeId);
    }

    function getHomeId(event) {
        if (event.target.value) {
            setHomeId(event.target.value)
        }
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

    function timeFormatter(date) {
        let d = new Date(date),
            month = '' + (openingTime.getMonth() + 1),
            day = '' + openingTime.getDate(),
            year = (openingTime.getFullYear() + 1),
            hours = closingTime.substring(0, 2),
            minutes = closingTime.substring(3, 6),
            seconds = closingTime.substring(7, 8);
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
            seconds = '00';
        }
        return [year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":00"];
    }

    function toggle() {
        setModal(!modal)
    }

    function statusToggle() {
        setStatusModal(!statusModal)
    }

    function toggle2(value) {
        setPlaceId(value);
        setModal2(!modal2)
    }

    function toggle3(value) {
        setPlaceId(value);
        setStatusModal(false);
    }

    function deleteToggle(value) {
        if (value !== null) {
            setDeleteLink(value)
        } else {
            setDeleteLink('')
        }
        setModalDelete(!modalDelete)
    }

    function addRecreation(event, error, values) {
        console.log(closingTime);
        if (values.name !== "" && values.description !== "" && values.availableSits !== "") {
            let recreation = {
                "name": values.name,
                "description": values.description,
                "availableSits": values.availableSits,
                "openingTime": formatDate(openingTime), // sample -> "2021-10-18 09:00:00"
                "closingTime": timeFormatter(closingTime), // sample -> "2021-10-18 09:00:00"
                "recreationCategory": recreationCategory,
                "recreationStatus": recreationStatus,
                "price": values.price,
                "address": houses,
            }
            saveRecreation(recreation).then(res => {
                if (res.status === 201) {
                    setModal(false);
                    toast.success(res.data.message)
                    getPlaceInfo(1);
                }
            }).catch(error => {
                toast.error("Error occurred!")
            })
        }
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

    function deleteRecreation(value) {
        deleteRequest(value).then(res => {
            if (res.status === 200) {
                toast.success(res.data.message)
                getPlaceInfo(1);
                setModalDelete(false);
            }
        }).catch(error => {
            deleteToggle(null);
            toast.error(error.response.data.errorMessage)
        })
    }

    async function editEventStatus(status) {
        return await putRequest(urlPath.editRecreationStatus+ placeId, status)
    }

    function editStatus(event, error, values) {

        editEventStatus(recreationStatus).then(res => {
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
                <h3>Recreation Places</h3>
                <div>
                    <label>Search category</label>
                    <Select style={{fontSize: 16, width: 400, marginLeft: 10}} className="mb-2 col-md-12 col-offset-4"
                            options={searchCategory} onChange={e => setSearch(e)}
                            defaultValue={"All"}
                    />
                </div>
                <button className={'btn btn-success'} onClick={toggle}>Create new Recreation Place</button>
            </div>
            <br/>
            <Table bordered striped hover>
                <thead>
                <th>#</th>
                <th>Name</th>
                <th>Category</th>
                <th>Description</th>
                <th>Status</th>
                <th>Available sits</th>
                <th>Address</th>
                <th>Opening Time</th>
                <th>Closing Time</th>
                <th>Price</th>
                <th>Edit Status</th>
                <th>Delete</th>
                <th>Orders</th>
                <th>Photos</th>
                </thead>
                <tbody>
                {
                    placeInfo
                        .filter((value) => {
                            if (search === '') {
                                return value;
                            } else if (value.recreationCategory.toLowerCase().includes(search.toLowerCase())) {
                                    return value;
                                }
                            }
                        )
                        .map((res, index) =>
                            <tr>
                                <th scope={'row'}>{(page - 1) * 10 + index + 1}</th>
                                <td>{res.name}</td>
                                <td>{res.recreationCategory}</td>
                                <td>{res.description}</td>
                                <td>{res.recreationStatus}</td>
                                <td>{res.availableSits}</td>
                                <td>{res.address.building.street.district.name}, {" "}
                                    {res.address.building.street.name}, {" "}
                                    {res.address.building.buildingNumber} Building, {" "}
                                    {res.address.homeNumber} Home
                                </td>
                                <td>{res.openingTime[3] + ":" + res.openingTime[4]}</td>
                                <td>{res.closingTime[3] + ":" + res.closingTime[4]}</td>
                                <td>{res.price}$</td>
                                <td>
                                    <Button onClick={() => {
                                        toggle3(res.id);
                                        statusToggle();
                                    }} style={{backgroundColor: "#1c80b6", fontSize: 14, width: 100}}>Edit
                                        status</Button>
                                </td>
                                <th>
                                    {
                                        res.exist.toLocaleString().toLocaleUpperCase() === "TRUE" ?
                                            <Button color="danger" style={{fontSize: 14}}
                                                    onClick={() => deleteToggle(urlPath.deleteRecreation + res.id)}>Delete</Button>
                                            : <Button disabled style={{fontSize: 14}}>Deleted</Button>
                                    }
                                </th>
                                <td>
                                    <td><Button href={`/admin/Orders/${res.id}`} color="warning"
                                                style={{fontSize: 14}}>Orders</Button></td>
                                </td>
                                <td>
                                    <Button style={{fontSize: 13, backgroundColor: '#009349'}}
                                            onClick={() => toggle2(res.id)}>
                                        Watch Photos
                                    </Button>
                                </td>
                            </tr>
                        )}
                </tbody>
            </Table>
            <br/>
            <Pagination current={page}
                        showTotal={total => `Total ${total} Recreation place`}
                        total={totalElements} onChange={(page) => getPlaceInfo(page)}
            />

            {/*Modal for Adding Recreation Place*/}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Recreation</ModalHeader>
                <AvForm onSubmit={addRecreation}>
                    <ModalBody>
                        <label>Address:</label>
                        <br/>
                        <AvField onChange={getStreet} type="select" name="districtId"
                                 label="District" required>
                            <option/>
                            {
                                districts.map(dis =>
                                    <option key={dis.id}
                                            value={dis.id}>{dis.name}
                                    </option>)
                            }
                        </AvField>
                        <AvField onChange={getBuilding} type="select" name="streetId"
                                 label="Street" required>
                            <option/>
                            {
                                streets.map(street =>
                                    <option key={street.id}
                                            value={street.id}>{street.name}
                                    </option>)
                            }
                        </AvField>
                        <AvField onChange={getHome} type="select" name="buildingId"
                                 label="Building" required>
                            <option/>
                            {
                                buildings.map(build =>
                                    <option key={build.id}
                                            value={build.id}>{build.buildingNumber}
                                    </option>)
                            }
                        </AvField>

                        <AvField onChange={getHomeId} type="select" name="homeId"
                                 label="Home" required>
                            <option/>
                            {
                                houses.map(house =>
                                    <option key={house.id}
                                            value={house.id}>{house.homeNumber}
                                    </option>)
                            }
                        </AvField>
                        <label>Recreation</label>
                        <AvGroup>
                            <Label for="name">Name</Label>
                            <AvInput name="name" id="firstName" required/>
                            <AvFeedback>First name must not be empty!</AvFeedback>
                        </AvGroup>
                        <AvGroup>
                            <Label for="description">Description</Label>
                            <AvInput name="description" id="description" required/>
                            <AvFeedback>Description must not be empty!</AvFeedback>
                        </AvGroup>
                        <AvGroup>
                            <Label for="availableSits">Available sits</Label>
                            <AvInput name="availableSits" id="availableSits" required/>
                            <AvFeedback>Available sits must not be empty!</AvFeedback>
                        </AvGroup>
                        <AvGroup>
                            <Label for="price">Price for per sit</Label>
                            <AvInput name="price" id="price" required/>
                            <AvFeedback>Price must not be empty!</AvFeedback>
                        </AvGroup>
                        <label>Opening Time</label>
                        <DatePicker selected={openingTime}
                                    showTimeSelect
                                    minDate={new Date()}
                                    timeFormat="HH:mm:ss"
                                    timeIntervals={15}
                                    dateFormat="yyyy-MM-dd hh:mm:ss"
                                    withPortal
                                    onChange={(date) => setOpeningTime(date)}
                        />
                        <label>Closing Time</label>
                        <Input selected={closingTime}
                               defaultValue="23:30"
                               type="time"
                               name="time"
                               id="time"
                               onChange={time => onChange(time.target.value)}
                        />
                        <br/>
                        <label>Recreation Category</label>
                        <Select className="mb-2 col-md-12 col-offset-4"
                                options={category} onChange={e => setRecreationCategory(e)}
                                defaultValue={"PARK"}
                        />
                        <label>Recreation Status</label>
                        <Select className="col-md-12 col-offset-4"
                                options={status} onChange={e => setRecreationStatus(e)}
                                defaultValue={"OPEN"}
                        />
                        <br/>
                    </ModalBody>
                    <ModalFooter>
                        <FormGroup>
                            <Button color="primary">Add Recreation</Button>{' '}
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
                                            Written writtenTime
                                            time: {comRes.writtenTime[0] + "-" + comRes.writtenTime[1] + "-" + comRes.writtenTime[2] + " " + comRes.writtenTime[3] + ":" + comRes.writtenTime[4]}

                                        </p>
                                    </div>
                                )
                            }
                            <AvGroup>
                                <br/>
                                <input type={"text"}
                                    onChange={(e) => setCommentary(e.target.value)}
                                       name="comment"
                                       id="comment"
                                       placeholder={"Your comment(s)"}
                                />
                                <br/>
                                <Button style={{color: "white", backgroundColor: "green", marginTop: 8}}
                                        onClick={() => addComment(placeId)}>Add comment</Button>
                            </AvGroup>
                            <br/>
                            <Upload
                                action={BASE_URL + urlPath.addPhoto + placeId}
                                headers={{
                                    'Authorization': localStorage.getItem(TOKEN),
                                    'Access-Control-Allow-Origin': '*',
                                }}
                                onChange={(res) => uploadPhoto(res)}
                                onRemove={removePhoto}
                                listType="picture"
                                maxCount={1}
                            >
                                <Button icon={<UploadOutlined/>}>Upload Photo (Max: 1)</Button>
                            </Upload>
                            <p style={{color: "red", fontWeight: "bold"}}>Pleas do not upload photo if there is
                                exist</p>
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
                        <Button color="danger" type={'button'} onClick={() => deleteRecreation(deleteLink)}>
                            Yes, delete
                        </Button>
                    </FormGroup>
                    <Button onClick={deleteToggle}>Cancel</Button>{' '}
                </ModalFooter>
            </Modal>

            {/*Edit status modal*/}
            <Modal isOpen={statusModal} toggle={statusToggle}>
                <ModalHeader toggle={statusToggle}>Edit status</ModalHeader>
                <AvForm onSubmit={editStatus}>
                    <ModalBody>
                        <Select className="col-md-12"
                                options={status} onChange={e => setRecreationStatus(e)}
                                defaultValue={"Open"}
                        />
                    </ModalBody>
                    <ModalFooter>
                        <FormGroup>
                            <Button color="primary">Edit</Button>{' '}
                        </FormGroup>
                        <Button color="secondary" onClick={statusToggle}
                                type={'button'}>Cancel</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        </div>
    );
}

export default Recreation;