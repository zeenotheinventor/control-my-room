const LIGHTS_API = "https://zeenotheinventor.ngrok.io/lights";
const WS_URI = "wss://zeenotheinventor.ngrok.io/:10010/";

const LIGHTS_ON = 0b1;
const LIGHTS_OFF = 0b0;

let debug = false;

function setDeskLights(status) {

    const resource = status ? "on" : "off"
    axios
        .get(`${LIGHTS_API}/${resource}`)
        .then(function (response) {
            // handle success
            $(".light-switch").prop('checked', status);

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

function blobToUint8Array(b) {
    var uri = URL.createObjectURL(b);
    let xhr = new XMLHttpRequest();
    let i;
    let ui8;

    xhr.open("GET", uri, false);
    xhr.send();

    URL.revokeObjectURL(uri);

    ui8 = new Uint8Array(xhr.response.length);

    let binary = "";

    for (i = 0; i < xhr.response.length; ++i) {
        ui8[i] = xhr.response.charCodeAt(i);
        binary = xhr.response.charCodeAt(i);
    }

    return binary >>> 0;
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
            if (debug)
                console.log("CONNECTED");
        };
        websocket.onclose = function (evt) {
            if (debug)
                console.log("DISCONNECTED");
        };

        websocket.onmessage = function (evt) {
            let message = evt.data;

            if (evt.data instanceof Blob) {
                message = blobToUint8Array(evt.data);
            }

            switch (message) {

                case 0:
                    $(".light-switch").prop('checked', false);
                    break;
                case 1:
                    $(".light-switch").prop('checked', true);
                    break;
                default:
                    console.log('No logic for case: ' + message);
                    break;
            }

            if (debug) {
                console.log("Message Received: " + (message === 1 ? "on" : "off"));
            }
        };
        websocket.onerror = function (evt) {
            console.log(evt);
        };

    });


})(jQuery);
