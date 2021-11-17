import React, {useContext, useEffect, useState} from 'react';
import {TOKEN} from "../resources/Const";
import {deleteRequest, getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {Button, Table} from "reactstrap";
import {useParams} from "react-router";
import DatePicker from "react-datepicker";
import {Select} from "antd";
import {toast} from "react-toastify";

function OrderRecreation() {
    const value = useContext(GlobalContext);

    const {recreation_id} = useParams();
    const [modal, setModal] = useState(false);
    const [price, setPrice] = useState('');
    const [recreation, setRecreation] = useState([]);
    const [count, setCount] = useState(0);
    const [sits, setSits] = useState([]);
    const [order, setOrder] = useState(false);
    const [orderId, setOrderId] = useState('');
    const [paymentUrl, setPaymentUrl] = useState('');
    const [visitingTime, setVisitingTime] = useState(new Date());
    const [duration, setDuration] = useState('0.5');
    const durationOption = [
        {value: '0.5', label: '30 minutes'},
        {value: '1.0', label: '1 hour'},
        {value: '1.5', label: '1 hour 30 minutes'},
        {value: '2.0', label: '2 hours'},
        {value: '2.5', label: '2 hours 30 minutes'},
        {value: '3.0', label: '3 hours '},

    ];

    useEffect(() => {
        if (localStorage.getItem(TOKEN)) {
            getRecreation().then(res => {
                setRecreation(res.data.object);
                setSits(res.data.object.availableSits);
                setPrice(res.data.object.price);
            })
        }
    }, []);

    async function getRecreation() {
        return await getRequest(urlPath.getRecreationById + recreation_id);
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

    function addCount() {
        let a = count;
        if (a < sits) {
            a++;
            setCount(a);
        } else {
            alert("All available place ordered!")
        }
    }

    function reduction() {
        let b = count;
        if (count > 0) {
            b--;
            setCount(b);
        }
    }

    function pay() {
        let pay =
            {
                "orderId": orderId,
                "redirectUrl": "http://localhost:3000/user/Recreation"
            };
        postRequest(urlPath.payForOrder, pay).then(res => {
            if (res.status === 200) {
                setPaymentUrl(res.data.object);
            }
        })
    }

    function makeOrder() {
        if (count > 0) {
            let order = {
                "recreationId": recreation_id,
                "visitorsNumber": count,
                "visitingDuration": duration,
                "visitingTime": formatDate(visitingTime),
            }
            postRequest(urlPath.orderRecreation, order).then(res => {
                if (res.status === 202) {
                    toast.success(res.data.message);
                    setOrderId(res.data.object);
                    setOrder(true);
                }
            })
        }
    }

    function cancelOrder() {
        deleteRequest(urlPath.cancelOrder + orderId).then(res => {
            if (res.status === 202) {
                setOrder(false);
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
                    <th>Recreation Name</th>
                    <th>Recreation Description</th>
                    <th>Price (hourly)</th>
                    <th>Visiting time</th>
                    <th>Visiting Duration</th>
                    <th>Visitors number</th>
                    <th>Overall Price</th>
                    <th>Make order</th>
                    </thead>
                    <tbody style={{height: 50}}>
                    <th>ID</th>
                    <th>{recreation.name}</th>
                    <td>{recreation.description}</td>
                    <td>{recreation.price}$</td>
                    <td>
                        <DatePicker style={{width: 60, backgroundColor: "#02b45a", fontWeight: "bold"}}
                                    selected={visitingTime}
                                    showTimeSelect
                                    minDate={new Date()}
                                    timeFormat="p"
                                    timeIntervals={30}
                                    dateFormat="Pp"
                                    onChange={(date) => {
                                        setVisitingTime(date);
                                    }}
                        />
                    </td>
                    <td><Select style={{fontSize: 14, width: 200, marginLeft: 10}}
                                className="mb-2 col-md-12 col-offset-4"
                                options={durationOption} onChange={e => setDuration(e)}
                                defaultValue={"30 minutes"}
                    /></td>
                    <td><Button style={{fontSize: 14, width: 60, backgroundColor: "#02b45a", fontWeight: "bold"}}
                                onClick={reduction}>-</Button>
                        <Button disabled
                                style={{
                                    fontSize: 14,
                                    width: 60,
                                    backgroundColor: "#0093b4",
                                    fontWeight: "bold"
                                }}>{count}</Button>
                        <Button style={{fontSize: 14, width: 60, backgroundColor: "#02b45a", fontWeight: "bold"}}
                                onClick={addCount}>+</Button></td>
                    <th>{price * count * duration + " $"}</th>
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

export default OrderRecreation;