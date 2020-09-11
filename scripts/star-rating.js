document.addEventListener('ffReady', ({resultDispatcher}) => {
    resultDispatcher.addCallback('asn', addRatingInfo);
});

function addRatingInfo(groups) {
    if (!groups) return;

    groups.filter(group => group.name === "Rating").forEach(group => {
        group.elements.concat(group.selectedElements).forEach(el => {
            const offset = el.name.match(/^< \d/) ? -1 : 0;
            const rating = parseInt(el.name.match(/\d+(\.\d+)?/g)[0]) + offset;
            el._stars = ratingToStars(rating);
        });
    });

    function ratingToStars(rating) {
        return Array.from({length: 5}, (_, i) => ({
            class: i < rating ? "star-bright" : "star-dim"
        }));
    }
}
