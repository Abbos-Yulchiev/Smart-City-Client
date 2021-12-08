import React, {useContext, useEffect, useState} from 'react';
import {TOKEN} from "../resources/Const";
import {deleteRequest, getRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {toast, ToastContainer} from "react-toastify";


function MyOrders({history}) {

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
            })/*.catch((error) => {
                localStorage.removeItem(TOKEN);
                toast.error(error);
                value.setLogged(false);
                value.setUser('');
                history.push("/");
            });*/
            getRecreation().then(res => {
                console.log(res);
                if (res.status === 200)
                    value.setLogged(true);
                setRecreationList(res.data.object);
            })/*.catch((error) => {
                localStorage.removeItem(TOKEN);
                toast.error(error);
                value.setLogged(false);
                value.setUser('');
                history.push("/");
            })*/
        }else {
            value.setLogged(false);
            value.setUser('');
            history.push("/");
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
            if (res.status === 202) {
                toast.success("Order canceled!")
                setModalCancel(false);
                cancelToggle(null);
            }
        }).catch(error => {
            toast.error("Error occurred!")
            cancelToggle(null);
            setModalCancel(false)
        })
    }
    return (
        <div>
            <ToastContainer/>
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
                                        <td>{res.id}</td>
                                        <td>{res.name}</td>
                                        {
                                            res.bookingDate !== null
                                                ?
                                                <td>{res.bookingDate[0] + "-" + res.bookingDate[1] + "-" + res.bookingDate[2] + " " + res.bookingDate[3] + ":" + res.bookingDate[4]}</td>
                                                : <td>not booking time</td>
                                        }
                                        <td>{res.creationDate[0] + "-" + res.creationDate[1] + "-" + res.creationDate[2] + " " + res.creationDate[3] + ":" + res.creationDate[4]}</td>
                                        <td>{res.price + "$"} </td>
                                        <td>
                                            {
                                                res.paid.toString() === "true"
                                                    ? <p>Paid</p>
                                                    : <div>
                                                        <p>Not Paid</p>
                                                        <Button style={{backgroundColor: "#ff3116"}}
                                                                onClick={() => cancelToggle(urlPath.cancelOrder + res.id)}
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
                                        <td>{res.id}</td>
                                        <td>{res.name}</td>
                                        {
                                            res.bookingDate !== null
                                                ?
                                                <td>{res.bookingDate[0] + "-" + res.bookingDate[1] + "-" + res.bookingDate[2] + " " + res.bookingDate[3] + ":" + res.bookingDate[4]}</td>
                                                : <td>not booking time</td>
                                        }
                                        <td>{res.creationDate[0] + "-" + res.creationDate[1] + "-" + res.creationDate[2] + " " + res.creationDate[3] + ":" + res.creationDate[4]}</td>
                                        <td>{res.visitingTime[0] + "-" + res.visitingTime[1] + "-" + res.visitingTime[2] + " " + res.visitingTime[3] + ":" + res.visitingTime[4]}</td>
                                        <td>{res.leavingTime[0] + "-" + res.leavingTime[1] + "-" + res.leavingTime[2] + " " + res.leavingTime[3] + ":" + res.leavingTime[4]}</td>
                                        <td>{res.visitorsNumber}</td>
                                        <td>{res.price + "$"}</td>
                                        <td>
                                            {
                                                res.paid.toString() === "true"
                                                    ? <p>Paid</p>
                                                    : <div>
                                                        <p>Not Paid</p>
                                                        <Button style={{backgroundColor: "#ff3116"}}
                                                                onClick={() => cancelToggle(urlPath.cancelOrder + res.id)}
                                                        >
                                                            Cancel order
                                                        </Button>
                                                    </div>
                                            }
                                        </td>
                                        <th>{res.totalPrice + "$"}</th>
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