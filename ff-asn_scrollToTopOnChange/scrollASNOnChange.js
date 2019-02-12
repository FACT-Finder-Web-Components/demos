document.addEventListener("ffReady", function () {
    factfinder.communication.ResultDispatcher.subscribe("asn", function (resultData, event) {
        window.scrollTo(window.scrollX, 0); // or get and scroll a specific scrollbar
    });
});