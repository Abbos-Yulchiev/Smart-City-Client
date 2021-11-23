import React, {useContext, useEffect, useState} from 'react';
import {GlobalContext} from "../App";
import {getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {BASE_URL, TOKEN} from "../resources/Const";
import {toast} from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'
import {Pagination, Select} from "antd";
import {Button, Label, Modal, ModalBody, ModalHeader, Table} from "reactstrap";
import {AvForm, AvGroup} from "availity-reactstrap-validation";

function Event(history) {

    const value = useContext(GlobalContext);
    const [totalElements, setTotalElements] = useState(0);
    const [eventInfo, setEventInfo] = useState([]);
    const [page, setPage] = useState(1);
    const [modal, setModal] = useState(false);
    const [placeId, setPlaceId] = useState('');
    const [recreation, setRecreation] = useState([]);
    const [comment, setComment] = useState([]);
    const [commentary, setCommentary] = useState('');
    const [search, setSearch] = useState('');
    const searchType = [
        {value: '', label: 'All'},
        {value: 'CONCERT', label: 'Concert'},
        {value: 'FESTIVAL', label: 'Festival'},
        {value: 'SPORT_COMPETITION', label: 'Sport Competition'},
        {value: 'PARTY', label: 'Party'}
    ];

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
        return await getRequest(urlPath.getAllEventNotDelete + "?page=" + (page - 1) + "&size=10").then(res => {
            setEventInfo(res.data.content);
            setTotalElements(res.data.totalElements);
            setPage(page);
        })
    }

    function toggle(value) {
        setPlaceId(value);
        setModal(!modal)
    }

    async function getRecreation(e) {
        return await getRequest(urlPath.getAllRecreationByExist + "?page=0&size=20");
    }

    async function watchPhoto(event, error, values) {
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

    return (
        <div>
            <br/>
            <div className={'d-flex justify-content-between align-items-center'}>
                <h3>Events</h3>
                <div>
                    <label>Search category</label>
                    <Select style={{fontSize: 16, width: 400, marginLeft: 10}} className="mb-2 col-md-12 col-offset-4"
                            options={searchType} onChange={e => setSearch(e)}
                            defaultValue={"All"}
                    />
                </div>
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
                <th>Ticket</th>
                <th>Recreation</th>
                </thead>
                <tbody>
                {
                    eventInfo
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
                                <td><Button href={`/user/OrderTicket/${res.id}`} color="warning">Buy ticket</Button></td>
                                <td style={{width: 300}}>Name: {" "}{res.recreations[0].name}
                                    {" "}
                                    Address: {" "} {res.recreations[0].address.building.street.district.name}
                                    {res.recreations[0].address.building.street.name}, {" "}
                                    Building: {res.recreations[0].address.building.buildingNumber} , {" "}
                                    Home: {res.recreations[0].address.homeNumber}
                                    <br/>
                                    <Button color={"success"}
                                            onClick={() => toggle(res.recreations[0].id)}>
                                        Watch Photos
                                    </Button>
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

            {/*Modal For watching photo and comments*/}
            <Modal isOpen={modal} toggle={toggle} style={{content: "inherit"}} transparent={true}>
                <ModalHeader toggle={toggle}>Watch Photo and Commentary</ModalHeader>
                <AvForm onSubmit={watchPhoto}>
                    <ModalBody>
                        <AvGroup>
                            <Label for="photo" placeholder="chose photo">Photo</Label>
                            <img style={{width: 470}} src={BASE_URL + urlPath.getPhoto + placeId}/>
                            <br/>
                            <br/>
                            <Button color="secondary"
                                    onClick={() => getComments(placeId)}>Comments</Button>
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
                                                    By : {comRes[1]} {comRes[2]}
                                                </p>
                                        }
                                        <p className={"d-flex flex-row mx-2 my-0"}
                                           style={{margin: "5"}}>Comment: {comRes[0]}</p>
                                        <p className={"d-flex flex-row mx-2 my-0"}>
                                            Written
                                            time: {comRes[3].substring(0, 10)} {" "} {comRes[3].substring(11, 16)}
                                        </p>
                                    </div>
                                )
                            }
                            <AvGroup>
                                <br/>
                                <input onChange={(e) => setCommentary(e.target.value)}
                                       name="comment"
                                       id="comment" placeholder={"Your comment(s)"}/>
                                <br/>
                                <Button style={{color: "white", backgroundColor: "green", marginTop: 8}}
                                        onClick={() => addComment(placeId)}
                                >
                                    Add comment
                                </Button>
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