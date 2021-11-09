import React, {useContext, useEffect, useState} from 'react';
import {Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {TOKEN} from "../resources/Const";
import {getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {useParams} from "react-router";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {toast} from "react-toastify";

function Tickets() {

    const value = useContext(GlobalContext);
    const {res} = useParams();

    const [modal, setModal] = useState(false);
    const [allTickets, setAllTickets] = useState([]);
    const [unsoldTickets, setUnsoldTickets] = useState([]);
    const [price, setPrice] = useState(0);
    const [event, setEvent] = useState([]);

    useEffect(() => {

        if (localStorage.getItem(TOKEN)) {
            getEvent().then((response) => {
                setEvent(response.data);
            });
            getUnsoldTickets().then(res => {
                setUnsoldTickets(res.data.body.length);
                setPrice(res.data.body[0].price)
            });
            getAllTicket().then(resp => {
                value.setLogged(true);
                setAllTickets(resp.data);
            })
            getEvent().then(res => {
                setEvent(res.data.object);
            })
        }
    }, []);

    async function getEvent() {
        return await getRequest(urlPath.getEvent + 1);
    }

    async function getAllTicket() {
        return await getRequest(urlPath.getAllTicketsByEventId + 1);
    }

    async function getUnsoldTickets() {
        return await getRequest(urlPath.getUnsoldTickets + 1);
    }

    function toggle() {
        setModal(!modal)
    }

    async function saveTicket(ticket) {
        return await postRequest(urlPath.addTicket, ticket)
    }

    function addTicket(event, error, values) {
        if (values.price !== '' &&
            values.quantities !== '' &&
            values.price > 0
            && values.quantities > 0) {
            let tickets = {
                "price": values.price,
                "quantities": values.quantities,
                "eventId": 0,

            }
            console.log(tickets);
            saveTicket(tickets).then(res => {
                if (res.status === 201) {
                    toggle();
                    toast.success(res.data.message)
                }
            }).catch(error => {
                toast.error(error.response.data.message)
            })
        }
    }

    return (
        <div>
            <br/>
            <div className={'d-flex justify-content-between align-items-center'}>
                <h3>Add Ticket</h3>
                {/*{
                    allTickets.length > 0
                        ?*/}
                <button className={'btn btn-success'} onClick={toggle}>Add Ticket</button>
                {/*: <p/>
                }*/}
            </div>
            <br/>
            <Table striped bordered>
                <thead style={{backgroundColor: "#00a454", height: 40, color: "white"}}>
                <th>#</th>
                <th>Event Name</th>
                <th>Event Type</th>
                <th>All tickets</th>
                <th>Unsold tickets</th>
                <th>Sold tickets</th>
                <th>Price</th>
                <th>Overall Price</th>
                </thead>
                <tbody style={{height: 40}}>
                <th>ID</th>
                <th>{event.name}</th>
                <th>{event.eventType}</th>
                <td>{allTickets}</td>
                <td>{unsoldTickets}</td>
                <td>{allTickets - unsoldTickets}</td>
                <th>{price + " $"}</th>
                <th>{allTickets * price} {" $"}</th>
                </tbody>
            </Table>

            {/*Add Event Modal*/}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Ticket</ModalHeader>
                <AvForm onSubmit={addTicket}>
                    <ModalBody>
                        <AvField name="price" label="Ticket price ($)" type="number"
                                 placeholder = "Ticket price ..."
                                 validate={{
                                     pattern: {value: '[0-9]', errorMessage: 'You must enter positive numbers'},
                                     min: 0,
                                     number: true,
                                     required: true
                                 }}
                                 min={"0"}/>
                        <AvField name="quantities" label="Ticket quantity" type="number"
                                 placeholder = "Ticket quantities ..."
                                 validate={{
                                     pattern: {value: '[0-9]', errorMessage: 'You must enter positive numbers'},
                                     min: 0,
                                     number: true,
                                     required: true
                                 }}
                                 min={"0"}/>
                        <br/>
                    </ModalBody>
                    <ModalFooter>
                        <FormGroup>
                            <Button color="primary">Add Event</Button>{' '}
                        </FormGroup>
                        <Button color="secondary" onClick={toggle}
                                type={'button'}>Cancel</Button>
                    </ModalFooter>
                </AvForm>
            </Modal>
        </div>
    )
}

export default Tickets;
