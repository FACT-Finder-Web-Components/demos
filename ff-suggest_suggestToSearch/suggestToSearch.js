/**
 * !!! CAUTION !!!
 * This will feed a full Search.ff request into the suggest instead of a cheaper Suggest.ff request.
 * Hence your server will have to deal with more load, which might increase server response time, server cost and license cost.
 * So we recommend to consult with us before applying this code snippet.
 * */
document.addEventListener("ffReady", function () {
    var eventAggregator = factfinder.communication.FFCommunicationEventAggregator;
    var resultDispatcher = factfinder.communication.ResultDispatcher;

    eventAggregator.addBeforeDispatchingCallback(function (event) {
        if (event.type === "suggest") {
            console.log(event);
            /**
             * Execute a search
             */
            eventAggregator.addFFEvent({
                type: "search",
                query: event.query,
                channel: event.channel,
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
            delete event["type"];
        }
    });

    resultDispatcher.subscribe("searchToSuggest", function (result, event) {
        /**
         * Transform search -> suggest
         */
        var suggestions = searchResultToSuggestions(result.searchResult);
        /**
         * Dispatch it to the ff-suggest element
         */
        resultDispatcher.dispatchSuggest(suggestions, event);
    });

    function searchResultToSuggestions(result) {
        var suggestions = [];
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