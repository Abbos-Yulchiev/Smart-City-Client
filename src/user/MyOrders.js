import React, {useContext, useEffect, useState} from 'react';
import {TOKEN} from "../resources/Const";
import {deleteRequest, getRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {toast} from "react-toastify";


function MyOrders() {

    const value = useContext(GlobalContext);
    const [orderedTicketList, setTicketList] = useState([]);
    const [orderedRecreationList, setRecreationList] = useState([]);
    const [recreation, setRecreation] = useState(false);
    const [order, setOrder] = useState(false);
    const [modalCancel, setModalCancel] = useState(false);
    const [cancelId, setCancelId] = useState('');

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getTickets().then(res => {
                console.log(res);
                if (res.status === 200) {
                    value.setLogged(true);
                    setTicketList(res.data.object);
                }
            });
            getRecreation().then(res => {
                console.log(res);
                if (res.status === 200)
                    value.setLogged(true);
                setRecreationList(res.data.object);
            })
        }
    }, []);

    async function getTickets() {
        return await getRequest(urlPath.myTickets);
    }

    async function getRecreation() {
        return await getRequest(urlPath.myRecreations)
    }

    function orderedRecreation() {
        setRecreation(true);
        setOrder(false);
    }

    function orderedTickets() {
        setOrder(true);
        setRecreation(false);
    }

    function cancelToggle(value) {
        if (value !== null) {
            setCancelId(value)
        } else {
            setCancelId('')
        }
        setModalCancel(!modalCancel)
    }

    function cancelOrder(value) {
        deleteRequest(value).then(res => {
            if (res.status === 200) {
                toast.success(res.data.message)
                setModalCancel(false);
            }
        }).catch(error => {
            cancelToggle(null);
            setModalCancel(false)
            toast.error(error.response.data.errorMessage)
        })
    }

    return (
        <div>
            <br/>
            <div className={'d-flex justify-content-around align-items-center'}>
                {
                    order
                        ?
                        <h3>Ordered Tickets</h3>
                        :
                        <h3>Ordered Recreation</h3>
                }
                <div>
                    <Button onClick={orderedRecreation}
                            style={{width: 200, height: 40, fontSize: 18, backgroundColor: '#009349', color: '#fff'}}>Ordered
                        Recreation</Button>
                    <Button onClick={orderedTickets} style={{
                        marginLeft: 5,
                        width: 200,
                        height: 40,
                        fontSize: 18,
                        backgroundColor: '#009349',
                        color: '#fff'
                    }}>Ordered
                        Tickets</Button>
                </div>
            </div>
            {
                order
                    ?
                    <div>
                        <Table striped bordered hover>
                            <thead style={{backgroundColor: '#009349', height: 40, color: "white"}}>
                            <th>Order ID</th>
                            <th>Event Name</th>
                            <th>Booked Time</th>
                            <th>Created Time</th>
                            <th>Ticket Price</th>
                            <th>Paid</th>
                            </thead>
                            <tbody style={{height: 50}}>
                            {
                                orderedTicketList.map(res =>
                                    <tr>
                                        <td>{res[0]}</td>
                                        <td>{res[4]}</td>
                                        {
                                            res[1] !== null
                                                ? <td>{res[1].substring(0, 10) + " " + res[1].substring(11, 16)}</td>
                                                : <td>not booking time</td>
                                        }
                                        <td>{res[2].substring(0, 10) + " " + res[2].substring(11, 16)}</td>
                                        <td>{res[5] + "$"} </td>
                                        <td>
                                            {
                                                res[3].toString() === "true"
                                                    ? <p>Paid</p>
                                                    : <div>
                                                        <p>Not Paid</p>
                                                        <Button style={{backgroundColor: "#ff3116"}}
                                                                onClick={() => cancelToggle(urlPath.cancelOrder + res[0])}
                                                        >
                                                            Cancel order
                                                        </Button>
                                                    </div>
                                            }
                                        </td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                    </div>
                    :
                    <div>
                        <Table striped bordered hover>
                            <thead style={{backgroundColor: '#009349', height: 40, color: "white"}}>
                            <th>Order ID</th>
                            <th>Recreation Name</th>
                            <th>Booked Time</th>
                            <th>Created Time</th>
                            <th>Visited Time</th>
                            <th>Left Time</th>
                            <th>Visitors</th>
                            <th>Price</th>
                            <th>Paid</th>
                            <th>Total Price</th>
                            </thead>
                            <tbody style={{height: 50}}>
                            {
                                orderedRecreationList.map(res =>
                                    <tr>
                                        <td>{res[0]}</td>
                                        <td>{res[5]}</td>
                                        {
                                            res[1] !== null
                                                ? <td>{res[1].substring(0, 10) + " " + res[1].substring(11, 16)}</td>
                                                : <td>not booking time</td>
                                        }
                                        <td>{res[2].substring(0, 10) + " " + res[2].substring(11, 16)}</td>
                                        <td>{res[7].substring(0, 10) + " " + res[7].substring(11, 16)}</td>
                                        <td>{res[8].substring(0, 10) + " " + res[8].substring(11, 16)}</td>
                                        <td>{res[9]}</td>
                                        <td>{res[6] + "$"}</td>
                                        <td>
                                            {
                                                res[3].toString() === "true"
                                                    ? <p>Paid</p>
                                                    : <div>
                                                        <p>Not Paid</p>
                                                        <Button style={{backgroundColor: "#ff3116"}}
                                                                onClick={() => cancelToggle(urlPath.cancelOrder + res[0])}
                                                        >
                                                            Cancel order
                                                        </Button>
                                                    </div>
                                            }
                                        </td>
                                        <th>{res[4] + "$"}</th>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                    </div>
            }

            {/*Modal Cancel order*/}
            <Modal isOpen={modalCancel} toggle={cancelToggle}>
                <ModalHeader>Cancel order!</ModalHeader>
                <ModalBody>
                    <p>Are you sure for Canceling order ?</p>
                    <h5 style={{color: "red"}}>After canceling the order's information can't be recovered!</h5>
                </ModalBody>
                <ModalFooter>
                    <FormGroup>
                        <Button color="success" onClick={cancelToggle}>No</Button>{' '}
                    </FormGroup>
                    <Button color="danger" type={'button'} onClick={() => cancelOrder(cancelId)}>
                        Yes, cancel</Button>
                </ModalFooter>
            </Modal>

        </div>
    );
}

export default MyOrders;