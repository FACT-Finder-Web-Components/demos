document.addEventListener("ffReady", function (event) {
    const resultDispatcher = event.resultDispatcher;
    resultDispatcher.subscribe("asn", function (resultData, event) {
        window.scrollTo(window.scrollX, 0); // or get and scroll a specific scrollbar
    });
});
