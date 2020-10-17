const LIGHTS_API = "http://zeenotheinventor.ngrok.io/lights";
function turnOnLights() {
    axios
        .get(`${LIGHTS_API}/on`)
        .then(function (response) {
            // handle success
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        });
}

function turnOffLights() {
    axios
        .get(`${LIGHTS_API}/off`)
        .then(function (response) {
            // handle success
        })
        .catch(function (error) {
            // handle error
            console.log(error);
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

(function ($) {

    $(function () {
        getLightStatus().then((status) => {
            $("#desk-light-switch").prop('checked', status);
        });
    });

    $(function () {
        $("#desk-light-switch").on("click", function (event) {
            if (event.target.checked) {
                turnOnLights();
            } else {
                turnOffLights();
            }
        });
    });
})(jQuery);
