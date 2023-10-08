function loadFatoorahForm(SessionID, CountryCode) {
    var config = {
        countryCode: CountryCode, // Here, add your Country Code you receive from InitiateSession Endpoint.
        sessionId: SessionID, // Here you add the "SessionId" you receive from InitiateSession Endpoint.
        cardViewId: "card-element",
    };
    myFatoorah.init(config);
}

function loadAPForm(SessionID, CountryCode, amount, currency, onPayment, onSessionStart, onSessionCancel) {
    var config = {
        sessionId: SessionID, // Here you add the "SessionId" you receive from InitiateSession Endpoint.
        countryCode: CountryCode, // Here, add your Country Code. 
        currencyCode: currency, // Here, add your Currency Code.
        amount: amount, // Add the invoice amount.
        cardViewId: "fatoorah-ap",
        callback: onPayment,
        sessionStarted: onSessionStart,
        sessionCanceled: onSessionCancel   
    };
    
    myFatoorahAP.init(config);
}