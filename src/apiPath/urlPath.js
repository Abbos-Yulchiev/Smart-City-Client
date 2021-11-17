export const urlPath = {


    /* User urls */
    authToken: 'authorization/authToken',
    login: 'authorization/login',
    getUser: 'user/',
    getUsers: 'user/all',
    addUser: 'user/register',
    deactivateUser: 'user/deactivateUser/',
    deleteUser: 'user/delete/',

    /* Event urls */
    getEvent: 'event/get/',
    getAllEvent: 'event/all',
    getAllEventNotDelete: 'event/allNotDelete',
    addEvent: 'event/add',
    editEvent: 'event/edit',
    deleteEvent: 'event/delete/',

    /* Recreation urls */
    getRecreationById: 'recreation/',
    getRecreationByCategory: 'recreation/byCategory',
    getRecreationByCategoryAndConfirmed: 'recreation/byCategoryAndConfirmed',
    getAllRecreation: 'recreation/all',
    getAllRecreationByExist: 'recreation/allByExist',
    addNewRecreation: 'recreation/add',
    editRecreation: 'recreation/edit/',
    deleteRecreation: 'recreation/delete/',
    editRecreationStatus:'recreation/editStatus/',

    /* Commentary urls */
    getCommentary: 'commentary/all?recreationId=', //should add commentary Id
    addCommentary: 'commentary/add',
    editCommentary: 'commentary/edit/',
    deleteCommentary: 'commentary/delete/',

    /*Order urls */
    myTickets: 'order/tickets',
    myRecreations: 'order/recreation',
    orderTicket: 'order/orderTicket',
    orderRecreation: 'order/orderRecreation',
    cancelOrder: 'order/cancel/',
    payForOrder: 'order/pay',
    ordersByRecreationId: 'order/ordersByRecreationId/',

    /*Ticket urls */
    getAllTicketsByEventId: 'ticket/allByEventId/',
    editTicket: 'ticket/edit',
    getUnsoldTickets: 'ticket/getUnsoldTickets/',
    addTicket: 'ticket/create',

    /*Photo urls */
    getPhoto: 'photo/get/',
    addPhoto: 'photo/add/',
    editPhoto: 'photo/edit/',
    deletePhoto: 'photo/delete/',

    /*External APIs*/
    getDistrict: "district",
    getStreet: "street?districtId=", //{distId}
    getCommercialBuilding: "commercialBuildings?streetId=", //{strId}
    getOffices: "offices?buildingId=",  //{buildingId}
}