document.addEventListener('ffCoreReady', ({factfinder}) => {
    factfinder.response.transformSearch(addRatingInfo);
});

function addRatingInfo(searchResult) {
    const {facets = []} = searchResult;

    facets.filter(facet => facet.name === "Rating")
        .forEach(({elements, selectedElements}) => {
            elements.concat(selectedElements).forEach(el => {
                const offset = el.text.match(/^< \d/) ? -1 : 0;
                const rating = parseInt(el.text.match(/\d+(\.\d+)?/g)[0]) + offset;
                el._stars = ratingToStars(rating);
            });
        });

    return searchResult;
}

function ratingToStars(rating) {
    return Array.from({length: 5}, (_, i) => ({
        class: i < rating ? "star-bright" : "star-dim",
    }));
}
