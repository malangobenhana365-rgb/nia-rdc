// app.js
document.addEventListener('DOMContentLoaded', () => {
    console.log('Application nia-rdc chargée');

    // Exemple d'appel vers votre serveur
    fetch('/api/test')
        .then(response => response.json())
        .then(data => {
            console.log('Réponse du serveur :', data);
        })
        .catch(err => console.error('Erreur :', err));
});
