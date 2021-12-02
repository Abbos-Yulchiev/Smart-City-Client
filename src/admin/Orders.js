import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {deleteRequest, getRequest} from "../resources/Request";
import {TOKEN} from "../resources/Const";
import {urlPath} from "../apiPath/urlPath";
import {Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {toast} from "react-toastify";
import {GlobalContext} from "../App";

function Orders({history}) {

    const value = useContext(GlobalContext);
    const {recreation_id} = useParams()
    const [order, setOrder] = useState([]);
    const [modalCancel, setModalCancel] = useState(false);
    const [cancelId, setCancelId] = useState('');

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            ordersByRecreationId().then(res => {
                if (res.status === 200) {
                    setOrder(res.data.object)
                }
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

    async function ordersByRecreationId() {
        return await getRequest(urlPath.ordersByRecreationId + recreation_id);
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
            <h1 className={'d-flex justify-content-start align-items-center'}>Recreation Orders</h1>
            {
                order.length > 0 ?
                    <div>
                        <Table striped bordered hover>
                            <thead style={{backgroundColor: '#009349', height: 40, color: "white"}}>
                            <th>Order ID</th>
                            <th>Paid</th>
                            <th>Total Price</th>
                            <th>Created Time</th>
                            <th>Booking Time</th>
                            <th>Visitor Number</th>
                            <th>Visiting Time</th>
                            <th>Leaving Time</th>
                            <th>Recreation Name</th>
                            <th>Recreation Price</th>
                            <th>Ordered by</th>
                            </thead>
                            <tbody style={{height: 50}}>
                            {
                                order.map(res =>
                                    <tr>
                                        <td>{res.id}</td>
                                        <td>
                                            {
                                                res.paid.toString() === "true"
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
                                        <th>{res.totalPrice}$</th>
                                        <td>{res.creationDate.substring(0, 10) + " " + res.creationDate.substring(11, 16)}</td>
                                        <td>
                                            {
                                                res.bookingDate === null
                                                    ? <p>no booking time</p>
                                                    : res.bookingDate.substring(0, 10) + " " + res.bookingDate.substring(11, 16)
                                            }
                                        </td>
                                        <td>{res.visitorsNumber}</td>
                                        <td>{res.visitingTime.substring(0, 10) + " " + res.visitingTime.substring(11, 16)}</td>
                                        <td>{res.leavingTime.substring(0, 10) + " " + res.leavingTime.substring(11, 16)}</td>
                                        <td>{res.name}</td>
                                        <td>{res.price}$</td>
                                        <td>{res.firstName + " " + res.lastName}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                    </div>
                    : <h4>No Orders yet ...</h4>
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

export default Orders;