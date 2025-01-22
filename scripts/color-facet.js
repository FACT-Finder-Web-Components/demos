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

document.addEventListener('ffCoreReady', ({factfinder}) => {
    factfinder.response.transformSearch(asnColors);
});

function asnColors(searchResult) {
    const {facets = []} = searchResult;

    facets.filter(facet => facet.associatedFieldName === "BaseColor")
        .forEach(({elements, selectedElements}) => {
            elements.concat(selectedElements).forEach(el => {
                el._color = colorToCSS(el.text);
            });
        });

    return searchResult;
}

function colorToCSS(color) {
    return ColorMaps[(color ?? ``).toLowerCase()] ?? color;
}
