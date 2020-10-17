(function ($) {
  const LIGHTS_API = "http://zeenotheinventor.ngrok.io/lights";
  function turnOnLights() {
    axios
      .get(`${LIGHTS_API}/on`)
      .then(function (response) {
        // handle success
        console.log(response.data);
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

  $(function () {
    $("#desk-light-switch").on("click", function (event) {
      console.log(event.target.checked);
      if (event.target.checked) {
        turnOnLights();
      } else {
        turnOffLights();
      }
    });
  });
  function onToggleLightSwitch(event) {}
})(jQuery);
