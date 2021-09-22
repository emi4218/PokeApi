let arrow = '<i class="fas fa-arrow-left"></i><i class="fas fa-arrow-right"></i>'
$('.next').html("");

window.addEventListener('load', () => {

    let contain = $('#contain')
    let details = $('#detail')

    $('nav div').click(event => {
        contain.html("") // efface le contain
        console.log(event.target)
        $.get("https://pokeapi.co/api/v2/" + event.target.id, data => { // requête sur l'api en lui passant l'id du bouton
            console.log(data);

            let nb = 0
            for (let nom of data.results) {
                console.log(nom.name);
                $('<div class="ligne">' + '<div class= "classement">' + ++nb + " - " + '</div>' + '<div class="name">' + (nom.name || (+nb)) + '</div>' + '</div>').appendTo(contain).click(event => {
                    console.log(event.target)
                    details.html("") // efface contenu de détail
                    $.get(nom.url, data => {
                        console.log(data)
                        parse(data)
                    })
                }) // appendTo pour ajouter la div au contain
            }
            $('.next').html(arrow)
        });
    })

    /**
     * Sert à parser un objet en String (à créer un tableau html)
     * @param {Object} data 
     * @param {String} parentKey 
     */
    function parse(data, parentKey = "") {
        for (let key in data) {
            if (Array.isArray(data[key])) { // si data[key] est un array on foreach et on reparse les objets
                data[key].forEach((d, index) => parse(d, parentKey + " " + key + " " + index))
            } else if (data[key] instanceof Object) { // si data[key] est un object on reparse l'objet
                parse(data[key], parentKey + " " + key)
            } else { // sinon on créé l'élément html
                $('<div class="ligne">' + '<div class="clef">' + parentKey + " " + key + '</div><div class="value">' + data[key] + '</div></div>').appendTo(details)
            }
        }

    }

})