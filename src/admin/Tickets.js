import React, {useContext, useEffect, useState} from 'react';
import {Button, FormGroup, Modal, ModalBody, ModalFooter, ModalHeader, Table} from "reactstrap";
import {TOKEN} from "../resources/Const";
import {getRequest, postRequest} from "../resources/Request";
import {urlPath} from "../apiPath/urlPath";
import {GlobalContext} from "../App";
import {useParams} from "react-router";
import {AvField, AvForm} from "availity-reactstrap-validation";
import {toast, ToastContainer} from "react-toastify";

function Tickets({history}) {

    const value = useContext(GlobalContext);
    const {event_id} = useParams();

    const [modal, setModal] = useState(false);
    const [allTickets, setAllTickets] = useState(0);
    const [unsoldTickets, setUnsoldTickets] = useState(0);
    const [price, setPrice] = useState(0);
    const [event, setEvent] = useState([]);

    useEffect(() => {

        if (localStorage.getItem(TOKEN)) {
            getEvent().then(res => {
                setEvent(res.data);
            });
            getUnsoldTickets().then(res => {
                setUnsoldTickets(res.data.object.length);
                if (res.data.object.length > 0)
                    setPrice(res.data.object[0].price);
            });
            getAllTicket().then(res => {
                value.setLogged(true);
                setAllTickets(res.data);
            })
            getEvent().then(res => {
                setEvent(res.data.object);
            })
        }else {
            value.setLogged(false);
            value.setUser('');
            history.push("/");
        }
    }, []);

    async function getEvent() {
        return await getRequest(urlPath.getEvent + event_id);
    }

    async function getAllTicket() {
        return await getRequest(urlPath.getAllTicketsByEventId + event_id);
    }

    async function getUnsoldTickets() {
        return await getRequest(urlPath.getUnsoldTickets + event_id);
    }

    function toggle() {
        setModal(!modal)
    }

    async function saveTicket(ticket) {
        return await postRequest(urlPath.addTicket, ticket)
    }

    function addTicket(event, error, values) {

        let tickets = {
            "price": values.price,
            "quantities": values.quantities,
            "eventId": event_id,
        }
        saveTicket(tickets).then(res => {
            if (res.status === 201) {
                toggle();
                toast.success("Tickets savedS")
            }
        }).catch(error => {
            toast.error("Error occurred!")
        })
    }

    return (
        <div>
            <ToastContainer/>
            <br/>
            <div className={'d-flex justify-content-between align-items-center'}>
                <h3>Add Ticket</h3>
                {
                    allTickets !== 0
                        ?<Button disabled>Ticket added</Button>
                        :<Button style={{backgroundColor:"#00a454"}} onClick={toggle}>Add Ticket</Button>
                }
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
                <th>
                    {
                    event.name === null ? <p>Event deleted</p>:
                        <p>{event.name}</p>
                }
                </th>
                <th>{event.eventType}</th>
                <td>{allTickets}</td>
                <td>{unsoldTickets}</td>
                <td>{allTickets - unsoldTickets}</td>
                <th>{price + " $"}</th>
                <th>{allTickets * price} {" $"}</th>
                </tbody>
            </Table>

            {/*Add Ticket Modal*/}
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>Add Ticket</ModalHeader>
                <AvForm onSubmit={addTicket}>
                    <ModalBody>
                        <AvField name="price" label="Ticket price ($)" type="number"
                                 placeholder="Ticket price ..."
                                 validate={{
                                     pattern: {value: '[0-9]', errorMessage: 'You must enter positive numbers'},
                                     min: 0,
                                     number: true,
                                     required: true
                                 }}
                                 min={"0"}/>
                        <AvField name="quantities" label="Ticket quantity" type="number"
                                 placeholder="Ticket quantities ..."
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
                            <Button color="primary">Add Ticket</Button>{' '}
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
