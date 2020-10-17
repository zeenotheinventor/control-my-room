const LIGHTS_API = "https://zeenotheinventor.ngrok.io/lights";
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
            console.log(e)
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
            $(".light-switch").prop('checked', status);
        });
    });

    $(function () {
        $(".light-switch ").on("click", function (event) {
            setDeskLights(event.target.checked);
        });
    });
})(jQuery);
