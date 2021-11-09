import React, {useContext, useEffect, useState} from 'react';
import {TOKEN} from "../resources/Const";
import {deleteRequest, getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {Button, Table} from "reactstrap";
import {toast} from "react-toastify";


function Order() {

    const value = useContext(GlobalContext);

    const [modal, setModal] = useState(false);
    const [unsoldTickets, setUnsoldTickets] = useState([]);
    const [price, setPrice] = useState('');
    const [event, setEvent] = useState([]);
    const [count, setCount] = useState(0);
    const [tickets, setTickets] = useState([]);
    const [order, setOrder] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');

    useEffect(() => {

        if (localStorage.getItem(TOKEN)) {
            getEvent().then((response) => {
                setEvent(response.data);
            });
            getUnsoldTickets().then(res => {
                setUnsoldTickets(res.data.object);
                if (res.data.object.length > 0)
                    setPrice(res.data.object[0].price);
            });
            getEvent().then(res => {
                setEvent(res.data.object);
            })
        }
    }, []);

    async function getEvent() {
        return await getRequest(urlPath.getEvent + 1);
    }

    async function getUnsoldTickets() {
        return await getRequest(urlPath.getUnsoldTickets + 1);
    }

    function addCount() {
        let a = count;
        if (a < unsoldTickets.length) {
            a++;
            setCount(a);
        }
        else {
            alert("All tickets are ordered. Sorry for inconvenience!")
        }
    }

    function reduction() {
        let b = count;
        if (count > 0) {
            b--;
            setCount(b);
        }
    }

    function makeOrder() {
        if (count > 0) {
            let slice = unsoldTickets.slice(0, count);
            // eslint-disable-next-line array-callback-return
            slice.map(res => {
                tickets.push(res.id)
            })
            let ticketList = {"ticketsId": tickets}
            postRequest(urlPath.createNewOrder, ticketList).then(res => {
                console.log(res)
                if (res.status === 202) {
                    toast.success(res.data.message);
                    setOrder(true);
                    setTickets([]);
                    setOrderId(res.data.object);
                }
            })
        }
    }

    function cancelOrder() {
        deleteRequest(urlPath.cancelOrder + orderId).then(res => {
            console.log(value)
            if (res.status === 202) {
                setOrder(false);
            }
        })
    }

    function pay() {
        let pay =
            {
                "orderId": orderId,
                "redirectUrl": "http://localhost:3000/user/Event"
            };
        postRequest(urlPath.payForOrder, pay).then(res => {
            if (res.status === 200) {
                setPaymentUrl(res.data.object);
            }
        })
    }


    return (
        <div>
            <div>
                <br/>
                <Table striped bordered>
                    <thead style={{backgroundColor: "#02b45a", height: 40, color: "white"}}>
                    <th>#</th>
                    <th>Event Name</th>
                    <th>Event Type</th>
                    <th>Price</th>
                    <th>Add Ticket</th>
                    <th>Overall Price</th>
                    <th>Make order</th>
                    </thead>
                    <tbody style={{height: 50}}>
                    <th>ID</th>
                    <th>{event.name}</th>
                    <th>{event.eventType}</th>
                    <th> {
                        unsoldTickets.length === 0 ?
                            <p style={{color:"red", fontSize:18}}>All tickets sold</p>
                            : price + " $"
                    }
                    </th>
                    <th>
                        <div>
                            <Button style={{width: 60}} onClick={reduction}>-</Button>
                            <Button disabled>{count}</Button>
                            <Button style={{width: 60}} onClick={addCount}>+</Button>
                        </div>
                    </th>
                    <th>{price * count + " $"}</th>
                    <th>
                        {
                            order
                                ? <>
                                    {
                                        paymentUrl === ''
                                            ?
                                            <>
                                                <Button href={paymentUrl}
                                                        style={{backgroundColor: "#02b45a", margin: 5}}
                                                        onClick={pay}
                                                >
                                                    Confirm Order
                                                </Button>
                                                <Button style={{backgroundColor: "#ec151c", margin: 5}}
                                                        onClick={cancelOrder}
                                                >
                                                    Cancel Order
                                                </Button>
                                            </>
                                            : <Button href={paymentUrl}
                                                      style={{backgroundColor: "#02b45a", width: 100, margin: 5}}
                                            >
                                                Pay
                                            </Button>
                                    }
                                </>
                                : <Button style={{backgroundColor: "#ecb915", width: 70, margin: 5}}
                                          onClick={makeOrder}
                                >
                                    Order
                                </Button>

                        }
                    </th>
                    </tbody>
                </Table>
            </div>
        </div>
    );

}

export default Order;