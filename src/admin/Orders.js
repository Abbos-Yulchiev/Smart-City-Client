import React, {useEffect, useState} from 'react';
import {useParams} from "react-router";
import {getRequest} from "../resources/Request";
import {TOKEN} from "../resources/Const";
import {urlPath} from "../apiPath/urlPath";
import {Table} from "reactstrap";

function Orders() {

    const {recreation_id} = useParams()
    const [order, setOrder] = useState([]);

    useEffect(() => {
        console.log((recreation_id))
        if (localStorage.getItem(TOKEN)) {
            ordersByRecreationId().then(res => {
                console.log(res)
                if (res.status === 200) {
                    setOrder(res.data.object)
                }
            })
        }
    }, []);

    async function ordersByRecreationId() {
        return await getRequest(urlPath.ordersByRecreationId + recreation_id);
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
                                        <td>{res[0]}</td>
                                        <td>
                                            {
                                                res[1].toString() === "true" ? <p>Paid</p> : <p>Not Paid</p>
                                            }
                                        </td>
                                        <th>{res[2]}$</th>
                                        <td>{res[3].substring(0, 10) + " " + res[3].substring(11, 16)}</td>
                                        <td>{res[4]}</td>
                                        <td>{res[5]}</td>
                                        <td>{res[6].substring(0, 10) + " " + res[6].substring(11, 16)}</td>
                                        <td>{res[7].substring(0, 10) + " " + res[7].substring(11, 16)}</td>
                                        <td>{res[9]}</td>
                                        <td>{res[8]}$</td>
                                        <td>{res[10] + " " + res[11]}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </Table>
                    </div>
                    : <h4>No Orders yet ...</h4>

            }
        </div>
    );
}

export default Orders;