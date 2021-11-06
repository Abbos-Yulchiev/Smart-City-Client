import React, {useContext, useEffect, useState} from 'react';
import {getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {BASE_URL, TOKEN} from "../resources/Const";
import {toast} from "react-toastify";
import 'antd/dist/antd.css'
import 'bootstrap/dist/css/bootstrap.css';
import {AvForm, AvGroup} from "availity-reactstrap-validation";
import {Button, Pagination, Select} from 'antd';
import "react-datepicker/dist/react-datepicker.css";
import {Label, Modal, ModalBody, ModalHeader, Table} from "reactstrap";

function UserRecreation({history}) {


    const value = useContext(GlobalContext);
    const [modal, setModal] = useState(false);
    const [placeInfo, setPlaceInfo] = useState([]);
    const [commentary, setCommentary] = useState('');
    const [comment, setComment] = useState([]);
    const [page, setPage] = useState(1);
    const [totalElements, setTotalElements] = useState(0);
    const [placeId, setPlaceId] = useState('');
    const [search, setSearch] = useState('');

    const searchCategory = [
        {value: '', label: 'All'},
        {value: 'PARK', label: 'Park'},
        {value: 'THEATRE', label: 'Theatre'},
        {value: 'SPORT', label: 'Sport'},
        {value: 'GARDEN', label: 'Garden'},
        {value: 'MUSEUM', label: 'Museum'},
        {value: 'BAY', label: 'Bay'},
        {value: 'SWIMMING_POOL', label: 'Swimming Pool'}
    ];

    async function getUser() {
        return await getRequest(urlPath.authToken);
    }

    async function getPlaceInfo(page) {
        return await getRequest(urlPath.getAllRecreationByExist + "?page=" + (page - 1) + "&size=10").then(res => {
            setPlaceInfo(res.data.object.content);
            setTotalElements(res.data.object.totalElements);
            setPage(page);
        })
    }

    async function getComments(id) {
        return await getRequest(urlPath.getCommentary + id).then(res => {
            setComment(res.data);
        })
    }


    function toggle(value) {
        setPlaceId(value);
        setModal(!modal)
    }

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getUser().then(res => {
                if (res.data && res.status === 200) {
                    value.setLogged(true);
                    value.setUser(res.data.result);
                    getPlaceInfo(1);
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


    function addComment(id) {
        if (commentary.length !== 0) {
            let comment = {
                "commentText": commentary,
                "recreationId": id
            }
            saveComment(comment).then(res => {
                if (res.status === 201) {
                    toggle();
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
            <div className={'d-flex justify-content-around align-items-center'}>
                <h3>Recreation Places</h3>
                <div>
                    <label>Search category</label>
                    <Select style={{fontSize: 16, width: 400, marginLeft: 10}} className="mb-2 col-md-6 col-offset-4"
                            options={searchCategory} onChange={e => setSearch(e)}
                            defaultValue={"All"}
                    />
                </div>
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
                <th>Photos</th>
                </thead>
                <tbody>
                {
                    placeInfo.filter((value) => {
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
                                <td>{res.openingTime.substring(11, 16)}</td>
                                <td>{res.closingTime.substring(11, 16)}</td>
                                <td>
                                    <button style={{fontSize: 13}} className={'btn btn-success'}
                                            onClick={() => toggle(res.id)}>
                                        Watch Photos
                                    </button>
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

            {/*Modal For watching photo and comments*/}
            <Modal isOpen={modal} toggle={toggle} style={{content: "inherit"}} transparent={true}>
                <ModalHeader toggle={toggle}>Watch Photo and Commentary</ModalHeader>
                <AvForm>
                    <ModalBody>
                        <AvGroup>
                            <Label for="photo" placeholder="chose photo">Photo</Label>
                            <img style={{width: 470}} src={BASE_URL + urlPath.getPhoto + placeId} alt={"Photo"}/>
                            <br/>
                            <br/>
                            <Button color="secondary"
                                    onClick={() => getComments(placeId)}>Comments</Button>
                            {
                                comment.map((comRes, index) =>
                                    <div style={{backgroundColor: "wheat"}}>
                                        {
                                            comRes.createdBy === null ?
                                                <p style={{fontWeight: 'bold'}}
                                                   className={"d-flex flex-row mx-2 my-1"}>By:
                                                    Unknown</p>
                                                : <p style={{fontWeight: 'bold'}}
                                                     className={"d-flex flex-row mx-2 my-0"}>By
                                                    : {comRes.createdBy}
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
                                <input onChange={(e) => setCommentary(e.target.value)}
                                       name="comment"
                                       id="comment"
                                       placeholder={"Your comment(s)"}
                                />
                                <br/>
                                <Button style={{color: "white", backgroundColor: "green", marginTop: 8}}
                                        onClick={() => addComment(placeId)}>Add comment</Button>
                            </AvGroup>
                        </AvGroup>
                    </ModalBody>
                </AvForm>
            </Modal>
        </div>
    );
}

export default UserRecreation;