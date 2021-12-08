import React, {useContext, useEffect, useState} from 'react';
import {REDIRECT_URL, TOKEN} from "../resources/Const";
import {deleteRequest, getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {Button, Table} from "reactstrap";
import {toast} from "react-toastify";
import {useParams} from "react-router";


function OrderTicket({history}) {

    const value = useContext(GlobalContext);
    const {event_id} = useParams();
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
            getUnsoldTickets().then(res => {
                value.setLogged(true);
                setUnsoldTickets(res.data.object);
                if (res.data.object.length > 0)
                    setPrice(res.data.object[0].price);
            })/*.catch((error) => {
                localStorage.removeItem(TOKEN);
                toast.error(error);
                value.setLogged(false);
                value.setUser('');
                history.push("/");
            });*/
            getEvent().then(res => {
                setEvent(res.data.object);
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

    async function getEvent() {
        return await getRequest(urlPath.getEvent + event_id);
    }

    async function getUnsoldTickets() {
        return await getRequest(urlPath.getUnsoldTickets + event_id);
    }

    function addCount() {
        let a = count;
        if (a < unsoldTickets.length) {
            a++;
            setCount(a);
        } else {
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
            postRequest(urlPath.orderTicket, ticketList).then(res => {
                if (res.status === 202) {
                    console.log(res.data);
                    toast.success("Order successfully  confirmed. Now you can pay for order.");
                    setOrder(true);
                    setTickets([]);
                    setOrderId(res.data);
                }
            })
        }
    }

    function cancelOrder() {
        deleteRequest(urlPath.cancelOrder + orderId).then(res => {
            if (res.status === 202) {
                toast.success("Order canceled!")
                setOrder(false);
            }
        })
    }

    function pay() {
        let pay =
            {
                "orderId": orderId,
                "redirectUrl": REDIRECT_URL + "user/Event"
            };
        postRequest(urlPath.payForOrder, pay).then(res => {
            if (res.status === 200) {
                setPaymentUrl(res.data.object);
            }
        })
    }

    //TODO URL should be edited

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
                            <p style={{color: "red", fontSize: 18}}>All tickets sold</p>
                            : price + " $"
                    }
                    </th>
                    <th>
                        <div>
                            <Button style={{width: 60, backgroundColor: "#02b45a", fontWeight: "bold"}}
                                    onClick={reduction}>-</Button>
                            <Button disabled
                                    style={{width: 60, backgroundColor: "#0093b4", fontWeight: "bold"}}>{count}</Button>
                            <Button style={{width: 60, backgroundColor: "#02b45a", fontWeight: "bold"}}
                                    onClick={addCount}>+</Button>
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
                                : <Button style={{
                                    backgroundColor: "rgba(241,160,45,0.91)",
                                    width: 90,
                                    marginTop: 5,
                                    fontWeight: "bold"
                                }}
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

export default OrderTicket;