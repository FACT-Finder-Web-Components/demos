/**
 * !!! CAUTION !!!
 * This will feed a full Search.ff request into the suggest instead of a cheaper Suggest.ff request.
 * Hence your server will have to deal with more load, which might increase server response time, server cost and license cost.
 * So we recommend to consult with us before applying this code snippet.
 * */
document.addEventListener("ffReady", function (event) {
    const eventAggregator = event.eventAggregator;
    const resultDispatcher = event.resultDispatcher;

    eventAggregator.addBeforeDispatchingCallback(function (evt) {
        if (evt.type === "suggest") {
            console.log(evt);
            /**
             * Execute a search
             */
            eventAggregator.addFFEvent({
                type: "search",
                query: evt.query,
                channel: evt.channel,
                "log-internal": "true",
                topics: function () {
                    /**
                     * used below for subscribing
                     */
                    return ["searchToSuggest"];
                },
                /**
                 * if not needed within suggest, disabling asn and campaign make the search leaner / faster in the FACT-Finder backend
                 */
                useAsn: "false",
                useCampaigns: "false",
            });

            /**
             * dont execute the suggest request
             */
            delete evt["type"];
        }
    });

    resultDispatcher.subscribe("searchToSuggest", function (result, evt) {
        /**
         * Transform search -> suggest
         */
        const suggestions = searchResultToSuggestions(result.searchResult);
        /**
         * Dispatch it to the ff-suggest element
         */
        resultDispatcher.dispatchSuggest(suggestions, evt);
    });

    function searchResultToSuggestions(result) {
        const suggestions = [];
        result.records.forEach(function (product) {
            suggestions.push({
                attributes: {
                    deeplink: product.record[result.fieldRoles.deeplink],
                    price: product.record[result.fieldRoles.price]
                },
                name: product.record[result.fieldRoles.productName],
                hitCount: 0,
                image: product.record[result.fieldRoles.imageUrl],
                type: "productName"
            });
        });

        return suggestions;
    }
});
