export const ColorMaps = {
    "black": "black",
    "schwarz": "black",
    "blue": "blue",
    "blau": "blue",
    "brown": "brown",
    "braun": "brown",
    "green": "green",
    "grün": "green",
    "grey": "grey",
    "grau": "grey",
    "olive": "olive",
    "oliv": "olive",
    "orange": "orange",
    "pink": "pink",
    "rosa": "pink",
    "purple": "purple",
    "lila": "purple",
    "red": "red",
    "rot": "red",
    "sand": "sandybrown",
    "beige": "beige",
    "turquoise": "turquoise",
    "türkis": "turquoise",
    "white": "white",
    "weiß": "white",
    "yellow": "yellow",
    "gelb": "yellow",
};

document.addEventListener('ffReady', ({resultDispatcher}) => {
    resultDispatcher.addCallback('asn', asnColors);
});

function asnColors(groups) {
    if (!groups) return;

    groups.filter(group => group.name === "Color").forEach(group => {
        group.elements.concat(group.selectedElements).forEach(el => {
            el._color = colorToCSS(el.name);
        });
    });
}
function colorToCSS(color) {
    return ColorMaps[(color || ``).toLowerCase()] || color;
}
