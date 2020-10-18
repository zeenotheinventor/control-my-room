const LIGHTS_API = "https://zeenotheinventor.ngrok.io/lights";
const WS_URI = "wss://zeenotheinventor.ngrok.io/:10010/";

const LIGHTS_ON = 0b1;
const LIGHTS_OFF = 0b0;

function setDeskLights(status) {

    const resource = status ? "on" : "off"
    axios
        .get(`${LIGHTS_API}/${resource}`)
        .then(function (response) {
            // handle success
            $(".light-switch").prop('checked', status);
            updateSocket(status ? LIGHTS_ON : LIGHTS_OFF)

        })
        .catch(function (error) {
            // handle error
            $(".light-switch").prop('checked', !status);
            console.log(error)
        });
}

async function getLightStatus() {

    try {
        const status = await axios.get(`${LIGHTS_API}/status`);

        return status.data;
    } catch (e) {
        console.log(e);
    }
}

function onOpen(evt) {
    console.log("CONNECTED");
}

function onClose(evt) {
    console.log("DISCONNECTED");
}



function onMessage(evt) {
    let message = evt.data;

    if (evt.data instanceof Blob) {
        message = blobToUint8Array(evt.data);
    }

    console.log("Message Received: " + message);
}

function onError(evt) {
    console.log(evt);
}

function updateSocket(message) {
    console.log("SENDING: " + message);

    const buffer = new ArrayBuffer(1);

    // set the value to first flag on and second flag off
    let view = new Uint8Array(buffer);
    view[0] = message;

    websocket.send(buffer);
}

function blobToUint8Array(b) {
    var uri = URL.createObjectURL(b),
        xhr = new XMLHttpRequest(),
        i,
        ui8;

    xhr.open("GET", uri, false);
    xhr.send();

    URL.revokeObjectURL(uri);

    ui8 = new Uint8Array(xhr.response.length);

    let binary = "";

    for (i = 0; i < xhr.response.length; ++i) {
        ui8[i] = xhr.response.charCodeAt(i);
        binary = xhr.response.charCodeAt(i);
    }

    return (binary >>> 0).toString(2);
}

(function ($) {

    $(function () {
        getLightStatus().then((status) => {
            $(".light-switch").prop('checked', status);
        });
    });

    $(function () {
        $(".light-switch ").on("click", function (event) {
            setDeskLights(event.target.checked);
        });
    });

    $(function () {
        websocket = new WebSocket(WS_URI, "echo-protocol");
        websocket.onopen = function (evt) {
            onOpen(evt);
        };
        websocket.onclose = function (evt) {
            onClose(evt);
        };
        websocket.onmessage = function (evt) {
            onMessage(evt);
        };
        websocket.onerror = function (evt) {
            onError(evt);
        };

    });


})(jQuery);
