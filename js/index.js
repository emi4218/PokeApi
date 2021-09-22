let arrowleft = '<i class="fas fa-arrow-left"></i>'
let arrowright = '<i class="fas fa-arrow-right"></i>'


window.addEventListener('load', () => {

    let contain = $('#contain')
    let details = $('#detail')
    /**
     * gestion de la navigation (menu)
     */
    $('nav div').click(event => {
        contain.html("") // efface le contain
        console.log(event.target)
        afficherPage("https://pokeapi.co/api/v2/" + event.target.id)
    })
    /**
     * Permet d'afficher le contenu d'une url
     * @param {String} url - url à appeler en ajax
     */
    function afficherPage(url) {
        let monUrl = new URL(url)
        console.log(monUrl)
        monUrl.searchParams.set('limit', 20)

        $.get(monUrl, data => { // requête sur l'api en lui passant l'id du bouton
            console.log(data);
            contain.html("")
            let nb = monUrl.searchParams.get('offset') || 0 // offset décalage de la position

            for (let nom of data.results) {
                console.log(nom.name);
                $('<div class="ligne">' + '<div class= "classement">' + ++nb + " - " + '</div>' + '<div class="name">' + (nom.name || (+nb)) + '</div>' + '</div>').appendTo(contain).click(event => { // Le || en JS permet de remplacer la première valeur par la deuxième si la première valeur est nulle ou indefinie
                    console.log(event.target)
                    details.html("") // efface contenu de détail
                    $.get(nom.url, data => {
                        console.log(data)
                        parse(data)
                    })
                }) // appendTo pour ajouter la div au contain
            }
            if (data.previous != null || data.next != null) { // data.previous/next est l'url des pages suivantes et précédentes
                let ligne = $('<div class="ligne"></div>').appendTo(contain)
                if (data.previous != null) {
                    $(arrowleft).appendTo(ligne).click(event => {
                        afficherPage(data.previous)
                    })
                } else {
                    $('<div></div>').appendTo(ligne)
                }
                if (data.next != null) {
                    $(arrowright).appendTo(ligne).click(event => {
                        afficherPage(data.next)
                    })
                } else {
                    $('<div></div>').appendTo(ligne)
                }
            }
        });
    }

    /**
     * Sert à parser un objet en String (à créer un tableau html) la mise en page, c'est de la merde !
     * @param {Object} data - objet de données récupérées depuis une url de l'api
     * @param {number|undefined} decalage - permet de mettre une marge à gauche 
     */
    function parse(data, decalage = 0) {
        for (let key in data) {
            if (Array.isArray(data[key])) { // si data[key] est un array, on foreach et on reparse les objets
                $('<div class="ligne" style="margin-left:' + decalage + 'px" > ' + '<div class="clef">' + key + '</div></div > ').appendTo(details)
                decalage += 25
                data[key].forEach((d, index) => {
                    $('<div class="ligne" style="margin-left:' + decalage + 'px">' + '<div class="clef">' + index + '</div></div>').appendTo(details)
                    parse(d, decalage + 25)
                })
            } else if (data[key] instanceof Object) { // si data[key] est un object, on reparse l'objet
                $('<div class="ligne" style="margin-left:' + decalage + 'px">' + '<div class="clef">' + key + '</div></div>').appendTo(details)
                parse(data[key], decalage + 25)

            } else { // sinon on créé l'élément html
                $('<div class="ligne" style="margin-left:' + decalage + 'px">' + '<div class="clef">' + key + '</div><div class="value">' + data[key] + '</div></div>').appendTo(details)
            }
        }

    }

})