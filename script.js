// Déclaration des constantes

const form = document.querySelector('.form');
const formTitre = document.querySelector('.titre');
const formAuteur = document.querySelector('.auteur');
const formGenre = document.querySelector('.genre');
const formAnnee = document.querySelector('.annee');
const listLivres = document.querySelector('.list-livres');


// Déclaration de la liste des livres

let livresList = {
 
}

// Boucler sur l'objet
function loadHTML(){
    if (!window.localStorage.getItem('data')) return;
    const data = JSON.parse(window.localStorage.getItem('data'));
    livresList = data;
    Object.keys(livresList).map(key => createHTML(livresList[key], key));
}


window.addEventListener('load' , loadHTML);

// Fonction pour créer un item ( ici un livre )
form.addEventListener('submit' , createItem);
function createItem(e) {
    e.preventDefault(); // Empêche la page de s'actualiser
    const timestamp = Date.now(); 
    // console.log(timestamp)
    // console.log(formInput.value);
    // Objet livresList avec timestamp , on retrouve à l'intérieur le titre , l'auteur , le genre et l'année.
    livresList[timestamp] = {
        titre : formTitre.value,
        auteur : formAuteur.value,
        genre : formGenre.value,
        annee : formAnnee.value,
        lu : false
    }
    createHTML(livresList[timestamp], timestamp);
    saveObj(); // Sauvegarde dans le local Storage
    this.reset(); // Reset les inputs
}

// Fonction pour créer la liste des livres
function createHTML(objet, key){
    if(!objet.titre) return;
    if(!objet.auteur) return;
    if(!objet.genre) return;
    if(!objet.annee) return;
    // Ici on ajoute du HTML avec les objets pour que ça puisse afficher les données 
    const html = `<span>${objet.titre} de ${objet.auteur} | ${objet.genre} | ${objet.annee}</span>
    <button name="check" class="check">${objet.lu ? '✔️' : 'Lu'}</button>
    <button name="edit" class="edit">⭕</button>
    <button name="trash" class="trash">❌</button>`
    // Créé la liste à puces
    const li = document.createElement('li');
    // Ajoute la class 'livres' à la liste à puces
    li.classList.add('livres');
    li.setAttribute('data-key' , key);
    li.innerHTML = html;
    listLivres.insertBefore(li, listLivres.firstChild);

    // Ici nous avons les boutons affichés dans la liste à puces , les boutons ont chacunes une fonction attribuée
    li.children.trash.onclick = toBin;
    li.children.check.onclick = check;
    li.children.edit.onclick = createForm;
}

// On crée un formulaire ( qui servira à update )
function createForm(){
    const newHtml = `
    <style>
    .formupdate{
        background-color : lightblue;
        padding-top : 10px;
        padding-bottom : 10px;
        padding-left : 10px;
    }
    </style>
    <form class=formupdate>
        <input type="text" id="tUpdate" class="titreUpdate" placeholder="Modifier le titre"/>
        <input type="text" id="aUpdate" class="auteurUpdate" placeholder="Modifier l'auteur"/>
        <input type="text" id="gUpdate" class="genreUpdate" placeholder="Modifier le genre"/>
        <input type="number" id="annee" class="anneeUpdate" min="1600" max="2099" step="1" placeholder="Année"/>
        <button type="submit">➕</button>
        <button onclick="this.parentNode.parentNode.remove();">X</button>
    </form>`
    const li = document.createElement('li');
    const key = this.parentNode.getAttribute('data-key');
    li.classList.add('livres');
    li.setAttribute('data-key' , key);
    li.innerHTML = newHtml;
    listLivres.insertBefore(li, listLivres.firstChild);
    const newForm = document.querySelector('.formupdate');
    newForm.addEventListener('submit' , edit);

}

// La fonction edit , qui permet d'update le titre , l'auteur , le genre et l'année d'un ou plusieurs livres existants
function edit(e){
    e.preventDefault();
    const titreUpdate = document.querySelector('.titreUpdate');
    const auteurUpdate = document.querySelector('.auteurUpdate');
    const genreUpdate = document.querySelector('.genreUpdate');
    const anneeUpdate = document.querySelector('.anneeUpdate');
    const key = this.parentNode.getAttribute('data-key');
    if(!titreUpdate.value){
        titreUpdate.value = livresList[key].titre;
    }else if (!auteurUpdate.value){
        auteurUpdate.value = livresList[key].auteur;
    }else if (!genreUpdate.value){
        genreUpdate.value = livresList[key].genre;
    }else if (!anneeUpdate.value){
        anneeUpdate.value = livresList[key].annee;
    }
    else{
    livresList[key] = {
        titre : titreUpdate.value,
        auteur : auteurUpdate.value,
        genre : genreUpdate.value,
        annee : anneeUpdate.value
    }

    // Ici on enregistre les valeurs modifiées dans le local storage , ensuite on supprime les anciennes valeurs , on charge les nouvelles valeurs et pour finir on rafraîchit la page pour que les valeurs modifiées puissent apparaître dans la page
    saveObj();
    delete livresList[key];
    window.addEventListener('load' , loadHTML);
    location.reload();
    this.reset();
    }
}


// Supprime le ou les livre(s) et supprime aussi dans le local storage
function toBin(){
    this.parentNode.remove();
    const key = this.parentNode.getAttribute('data-key');
    delete livresList[key];
    saveObj();
}

// fonction check , avec une animation , utilisée pour marquer un livre ou plusieurs livres comme lu
function check(){
    this.parentNode.classList.toggle('anim');
    this.innerHTML = this.innerHTML === 'Lu' ? "✔️" : "Lu"
    const key = this.parentNode.getAttribute('data-key');
    livresList[key].lu = !livresList[key].lu;
    console.log(livresList[key].lu);
    saveObj();
}

// fonction pour sauvegarder la liste des livres dans le local storage
function saveObj(){
    window.localStorage.setItem('data', JSON.stringify(livresList))
}