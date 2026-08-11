const API = "https://nia-rdc-1k3x.onrender.com";

let toutesLesAnnonces = [];
let VUE_ADMIN_ACTIVE = "flux";
let ONGLET_PROFIL_ACTIF = "standard";
let BLOCS_VIP_COMPTEUR = 0;
let editAnnonceImages = [];
const LONGUEUR_MIN_DESCRIPTION_REDUITE = 140;
const RATIO_DESCRIPTION_REDUITE = 0.5;
const SEUIL_MOT_COMPLET = 0.6;

const TEXTES_DU_DROIT = {
  securite: `Conditions de sécurité et d'utilisation de NIA RDC

Bienvenue sur NIA RDC.

Avant de créer un compte, veuillez lire les présentes conditions. En utilisant la plateforme, vous acceptez les règles suivantes.

1. Utilisation de la plateforme

NIA RDC est une plateforme destinée à faciliter la publication et la consultation d'annonces de location,  de services. Les utilisateurs s'engagent à utiliser la plateforme de manière honnête et responsable.

2. Exactitude des informations

Chaque utilisateur est responsable des informations qu'il publie. Les annonces doivent être exactes et ne pas contenir d'informations trompeuses ou mensongères.

3. Protection du compte

L'utilisateur est responsable de la confidentialité de son numéro de téléphone, de son mot de passe et des activités réalisées depuis son compte.

4. Contenus interdits

Il est interdit de publier des contenus :

- contraires aux lois en vigueur ;
- frauduleux ou trompeurs ;
- portant atteinte aux droits d'autrui ;
- contenant des informations fausses ou usurpant l'identité d'une autre personne.

NIA RDC se réserve le droit de supprimer tout contenu non conforme.

5. Photos et annonces

L'utilisateur garantit qu'il possède les droits nécessaires sur les photos et les informations publiées et autorise leur affichage sur la plateforme.

6. Protection des données

NIA RDC collecte uniquement les informations nécessaires au fonctionnement du service, notamment les informations de compte et les données liées aux annonces publiées.

7. Sécurité

NIA RDC met en œuvre des mesures techniques raisonnables pour protéger les données des utilisateurs. Toutefois, aucun système informatique ne peut garantir une sécurité absolue.

8. Responsabilité

NIA RDC agit comme plateforme de mise en relation et n'est pas partie aux accords conclus entre les utilisateurs. Chaque utilisateur est responsable des transactions et échanges qu'il réalise.

9. Modération

NIA RDC peut suspendre ou supprimer un compte ou une annonce en cas de non-respect des présentes conditions ou pour protéger la sécurité de la communauté.

10. Évolution des conditions

Ces conditions peuvent être mises à jour afin d'améliorer nia .

Acceptation

En créant un compte sur NIA RDC, je reconnais avoir lu les présentes conditions de sécurité et d'utilisation et j'accepte de les respecter.`,

  apropos: `À propos de NIA RDC

Bienvenue sur NIA RDC.

NIA RDC est une plateforme numérique conçue pour faciliter la mise en relation entre les personnes souhaitant louer, proposer ou rechercher des biens et des services en République Démocratique du Congo.

Notre objectif est de rendre les échanges plus simples, rapides et accessibles grâce à une plateforme facile à utiliser, adaptée aussi bien aux particuliers qu'aux professionnels.

Notre mission

Notre mission est de permettre à chacun de trouver ou de proposer des objets, équipements et services en toute simplicité, tout en favorisant les opportunités économiques locales.

Ce que propose NIA RDC

Les utilisateurs peuvent notamment :
- publier des annonces ;
- consulter les annonces disponibles ;
- contacter les annonceurs ;
- rechercher des biens et services selon leurs besoins.

La plateforme évolue régulièrement afin d'offrir de nouvelles fonctionnalités et une meilleure expérience utilisateur.

Nos valeurs

NIA RDC s'appuie sur plusieurs principes :
- simplicité ;
- accessibilité ;
- respect des utilisateurs ;
- innovation ;
- amélioration continue.

Notre engagement

Nous travaillons à maintenir une plateforme fiable et agréable à utiliser. Nous encourageons les utilisateurs à publier des informations exactes et à respecter les règles de la communauté.

Notre vision

Nous souhaitons contribuer au développement des échanges et des services numériques en République Démocratique du Congo en proposant une plateforme moderne et évolutive.

Contact

Pour toute question ou suggestion, les utilisateurs peuvent contacter l'équipe de NIA RDC par les moyens de communication disponibles sur la plateforme.

Merci de votre confiance et de votre participation au développement de NIA RDC.`,

  confidentialite: `Politique de confidentialité de NIA RDC

Dernière mise à jour : Juin 2026.

Bienvenue sur NIA RDC.

La protection des informations personnelles de nos utilisateurs est importante. Cette politique explique quelles informations sont collectées, pourquoi elles sont utilisées et les droits des utilisateurs.

1. Informations collectées
Lors de l'utilisation de NIA RDC, certaines informations peuvent être collectées, notamment :
- le numéro de téléphone fourni lors de l'inscription ;
- le mot de passe du compte, protégé par des mesures de sécurité ;
- les annonces publiées ;
- les photos et images ajoutées aux annonces ;
- les informations de contact renseignées dans les annonces ;
- les informations techniques nécessaires au fonctionnement de la plateforme.

2. Utilisation des informations
Les informations collectées servent à :
- créer et gérer les comptes utilisateurs ;
- publier et afficher les annonces ;
- améliorer les services proposés ;
- assurer la sécurité de la plateforme ;
- prévenir les activités frauduleuses ;
- répondre aux demandes des utilisateurs.

3. Partage des informations
NIA RDC ne vend pas les informations personnelles des utilisateurs.
Certaines informations publiées volontairement dans les annonces, comme les photos ou les numéros de contact, peuvent être visibles par les autres utilisateurs de la plateforme.
Les informations pourront être communiquées si la loi l'exige ou pour protéger les droits et la sécurité de NIA RDC et de ses utilisateurs.

4. Conservation des données
Les informations sont conservées aussi longtemps que nécessaire au fonctionnement de la plateforme et au respect des obligations légales.

5. Sécurité
NIA RDC met en œuvre des mesures raisonnables pour protéger les informations des utilisateurs contre les accès non autorisés, les pertes ou les utilisations abusives.
Toutefois, aucune technologie ne peut garantir une sécurité absolue sur Internet.

6. Cookies et technologies similaires
NIA RDC peut utiliser des cookies et des technologies similaires afin d'améliorer l'expérience utilisateur, de mesurer les performances du service et d'afficher des contenus ou publicités adaptés.

7. Publicités
NIA RDC peut afficher des annonces publicitaires afin de financer le fonctionnement de la plateforme.
Des partenaires publicitaires peuvent utiliser des technologies conformes à leurs propres politiques de confidentialité et aux lois applicables.

8. Droits des utilisateurs
Chaque utilisateur peut demander, dans les limites prévues par la loi :
- l'accès à ses informations ;
- la correction d'informations inexactes ;
- la suppression de certaines données ;
- la fermeture de son compte.

9. Modifications
Cette politique de confidentialité peut être mise à jour afin de suivre les évolutions de la plateforme ou des exigences légales.
Les modifications prendront effet dès leur publication sur NIA RDC.

10. Contact
Pour toute question concernant cette politique de confidentialité ou le traitement des données personnelles, les utilisateurs peuvent contacter l'équipe de NIA RDC par les moyens de communication mis à disposition sur la plateforme.

Acceptation
En utilisant NIA RDC et en créant un compte, l'utilisateur reconnaît avoir pris connaissance de la présente Politique de confidentialité et accepte les conditions qui y sont décrites.`
};

// ─── FILTRAGE CÔTÉ CLIENT ───────────────────────────────────────────────────
const MOTS_INTERDITS_IMMOBILIER = [
  "maison", "duplex", "appartement", "villa", "terrain", "parcelle",
  "immeuble", "residence", "residentiel", "residentielle", "lotissement",
  "promoteur", "bien immobilier", "agence immobiliere", "immobilier",
  "immobiliere", "locatif", "locative", "cadastre", "foncier",
  "propriete immobiliere", "vente immobiliere"
];
const MOTS_INTERDITS_ILLEGAUX = [
  "drogue", "drogues", "cocaine", "cocaïne", "heroine", "marijuana",
  "cannabis", "crack", "mdma", "ecstasy", "fentanyl", "methamphetamine",
  "arme a feu", "pistolet", "revolver", "kalachnikov", "munitions",
  "explosif", "grenade", "prostitution", "escorte sexuelle", "call-girl",
  "faux billet", "fausse carte", "faux passeport", "faux diplome",
  "faux documents", "faux papiers", "terrorisme", "terroriste"
];

function normaliserTexte(t) {
  return (t || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function verifierContenuInterdits(titre, description) {
  const texte = normaliserTexte(titre + " " + description);
  for (const mot of MOTS_INTERDITS_IMMOBILIER) {
    const re = new RegExp(`\\b${mot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (re.test(texte)) return `Les annonces immobilières ne sont pas autorisées (mot interdit : "${mot}").`;
  }
  for (const mot of MOTS_INTERDITS_ILLEGAUX) {
    const re = new RegExp(`\\b${mot.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`);
    if (re.test(texte)) return `Contenu interdit détecté (mot : "${mot}"). Publication refusée.`;
  }
  return null;
}


function brancherEvenementScrollControle() {
  const box = document.getElementById("cgu-scroller-node");
  if (!box) return;

  const chk = document.getElementById("chk-accept-rules");
  const btnReg = document.getElementById("btn-register-action");
  if(chk) chk.checked = false;

  box.addEventListener("scroll", () => {
    if (box.scrollHeight - box.scrollTop <= box.clientHeight + 15) {
      if (chk && chk.hasAttribute("disabled")) {
        chk.removeAttribute("disabled");
        chk.onchange = function() {
          if(this.checked) btnReg.removeAttribute("disabled");
          else btnReg.setAttribute("disabled", "true");
        };
      }
    }
  });
}

function toggleMenuLegal() {
  const m = document.getElementById("legal-dropdown"); 
  m.style.display = m.style.display === "block" ? "none" : "block";
}

function afficherDocumentJurisEtSecu(cle) {
  document.getElementById("legal-header-title").textContent = 
    cle === "securite" ? "📜 Sécurité & CGU" : cle === "apropos" ? "ℹ️ À propos de NIA RDC" : "🔒 Politique de Confidentialité";

  document.getElementById("legal-body-content").textContent = TEXTES_DU_DROIT[cle];
  document.getElementById("legal-dropdown").style.display = "none";
  ouvrirModal("legal-display");
}

function rafraichirHeaderVisuel() {
  const isLogged = localStorage.getItem("nia_user_id");
  document.getElementById("header-auth-zone").style.display = isLogged ? "none" : "flex";
}

function ouvrirSecuriseAuth(inscription = true) {
  basculerAffichageAuthentification(inscription);
  ouvrirModal("auth");
  if(inscription) {
    const scroller = document.getElementById("cgu-scroller-node");
    if(scroller) {
      scroller.innerHTML = TEXTES_DU_DROIT.securite;
      scroller.scrollTop = 0;
    }
    const chk = document.getElementById("chk-accept-rules");
    const btnReg = document.getElementById("btn-register-action");
    if(chk) chk.setAttribute("disabled", "true");
    if(btnReg) btnReg.setAttribute("disabled", "true");

    setTimeout(brancherEvenementScrollControle, 200);
  }
}

function basculerAffichageAuthentification(versInscription) {
  document.getElementById("auth-main-title").textContent = versInscription ? "Inscription" : "Connexion";
  document.getElementById("form-register-block").style.display = versInscription ? "grid" : "none";
  document.getElementById("form-login-block").style.display = versInscription ? "none" : "grid";
}

function ouvrirSecuriseModal(id) {
  if(!localStorage.getItem("nia_user_id")) ouvrirSecuriseAuth(false);
  else ouvrirModal(id);
}

function ouvrirModal(id) {
  document.getElementById(`modal-${id}`).style.display = "flex";
  if(id === "vip") rafraichirVueVipFormulaire();
  if(id === "profil") {
    const nup = localStorage.getItem("nia_user_nup") || "Non assigné";
    document.getElementById("user-profile-nup-title").textContent = `Mon Numéro de Profil Unique : ${nup}`;
    basculerOngletProfil(ONGLET_PROFIL_ACTIF); 
    chargerConversationsPrivees(); 
  }
}

function fermerModal(id) { document.getElementById(`modal-${id}`).style.display = "none"; }
function deconnexion() { localStorage.clear(); window.location.reload(); }

async function actionInscription() {
  const telephone = document.getElementById("reg-tel").value.trim();
  const password = document.getElementById("reg-pass").value.trim();
  if(!telephone || !password) return alert("Remplissez tous les champs.");

  const res = await fetch(`${API}/auth/register`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telephone, password })
  });
  const data = await res.json();
  if(data.success) {
    localStorage.setItem("nia_user_id", data.user.id);
    localStorage.setItem("nia_user_tel", data.user.telephone);
    localStorage.setItem("nia_user_nup", data.user.nup);
    window.location.reload();
  } else alert(data.error);
}

async function actionConnexion() {
  const telephone = document.getElementById("log-tel").value.trim();
  const password = document.getElementById("log-pass").value.trim();
  const res = await fetch(`${API}/auth/login`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telephone, password })
  });
  const data = await res.json();
  if(data.success) {
    localStorage.setItem("nia_user_id", data.user.id);
    localStorage.setItem("nia_user_tel", data.user.telephone);
    localStorage.setItem("nia_user_nup", data.user.nup);
    window.location.reload();
  } else alert(data.error);
}

async function suppressionDefinitiveCompte() {
  if (confirm("⚠️ Voulez-vous supprimer définitivement votre compte et vos publications ?")) {
    const user_id = localStorage.getItem("nia_user_id");
    if (!user_id) return;
    const res = await fetch(`${API}/auth/delete-account`, {
      method: "DELETE", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id })
    });
    const data = await res.json();
    if (data.success) { deconnexion(); }
  }
}

function traiterFichierEnBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader(); reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image(); img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > 500) { h = Math.round((h * 500) / w); w = 500; }
        canvas.width = w; canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
    };
  });
}

async function soumettreAnnonceStandard() {
  const titre = document.getElementById("titre").value.trim();
  const prix = document.getElementById("prix").value.trim();
  const devise = document.getElementById("devise").value;
  const periode = document.getElementById("periode").value;
  const statut = document.getElementById("statut").value;
  const telephone = document.getElementById("telephone").value.trim();
  const description = document.getElementById("description").value.trim();
  const ville = document.getElementById("ville").value.trim();
  const commune = document.getElementById("commune").value.trim();
  const files = document.getElementById("photos-input").files;

  const erreurContenu = verifierContenuInterdits(titre, description);
  if (erreurContenu) return alert("⛔ " + erreurContenu);

  let images_base64 = [];
  for(let i=0; i<files.length; i++) { images_base64.push(await traiterFichierEnBase64(files[i])); }

  const res = await fetch(`${API}/annonces`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: localStorage.getItem("nia_user_id"), titre, prix, devise, periode, statut, telephone, description, ville, commune, quartier:"", is_vip: false, images_base64
    })
  });
  const data = await res.json();
  if (!data.success) return alert("⛔ " + (data.error || "Erreur lors de la publication."));
  fermerModal("publier"); chargerFluxPrincipal();
}

async function chargerFluxPrincipal() {
  try {
    const res = await fetch(`${API}/feed`); toutesLesAnnonces = await res.json();
    rendreFluxHtml(toutesLesAnnonces);
    if(document.getElementById("admin-total-count")) {
      document.getElementById("admin-total-count").textContent = toutesLesAnnonces.length;
    }
  } catch(e) { document.getElementById("feed").innerHTML = "Erreur de synchronisation..."; }
}

function echapperHtml(texte = "") {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function basculerDescriptionComplete(element) {
  if (!element || element.dataset.expanded === "true") return;
  let descriptionComplete = "";
  try {
    descriptionComplete = decodeURIComponent(element.dataset.full || "");
  } catch {
    descriptionComplete = element.dataset.full || "";
  }
  element.textContent = descriptionComplete;
  element.dataset.expanded = "true";
  element.classList.remove("is-collapsed");
}

function genererDescriptionVisible(descriptionBrute) {
  if (descriptionBrute.length <= LONGUEUR_MIN_DESCRIPTION_REDUITE) return descriptionBrute;
  const longueurReduite = Math.ceil(descriptionBrute.length * RATIO_DESCRIPTION_REDUITE);
  const brutReduit = descriptionBrute.slice(0, longueurReduite).trimEnd();
  const derniereEspace = brutReduit.lastIndexOf(" ");
  const descriptionCoupee = derniereEspace > longueurReduite * SEUIL_MOT_COMPLET ? brutReduit.slice(0, derniereEspace) : brutReduit;
  return `${descriptionCoupee.trimEnd()}…`;
}

function rendreFluxHtml(liste) {
  const container = document.getElementById("feed"); container.innerHTML = "";
  if(liste.length === 0) { container.innerHTML = "<p style='text-align:center; color:gray;'>Aucune offre disponible.</p>"; return; }

  liste.forEach(a => {
    let imagesMarkup = (a.images && a.images.length > 0) ? `<div class="gallery">${a.images.map(imgObj => `<img src="${imgObj.url}" data-lightbox="${imgObj.url}" onclick="ouvrirLightbox(this.dataset.lightbox)" alt="Photo de l'annonce">`).join("")}</div>` : "";
    const isOwner = a.user_id == localStorage.getItem("nia_user_id");
    const descriptionBrute = (a.description || "").trim();
    const descriptionLongue = descriptionBrute.length > LONGUEUR_MIN_DESCRIPTION_REDUITE;
    const descriptionVisible = genererDescriptionVisible(descriptionBrute);
    const descriptionClasses = `annonce-description${descriptionLongue ? " is-collapsed" : ""}`;
    const descriptionAttributs = descriptionLongue
      ? `data-full="${encodeURIComponent(descriptionBrute)}" data-expanded="false"`
      : "";
    const indicationVoirPlus = descriptionLongue
      ? ' <span class="annonce-description-more">Voir plus</span>'
      : "";
    const descriptionMarkup = `<div class="${descriptionClasses}" ${descriptionAttributs}>${echapperHtml(descriptionVisible)}${indicationVoirPlus}</div>`;

    let shopButtonMarkup = "";
    if (a.is_vip && a.user_id) {
      shopButtonMarkup = `<button class="btn-action shop" onclick="filtrerAnnoncesParBoutiqueProprietaire(${a.user_id}, '${a.proprietaire_nup || 'Boutique'}')">🏪 Visiter la boutique</button>`;
    }

    container.innerHTML += `
      <div class="${a.is_vip ? 'annonce-card vip-premium' : 'annonce-card'}">
        ${a.is_vip ? `<div class="badge-vip">👑 VIP EXPRESS</div>` : ""}
        <h3 style="margin:0 0 4px 0; font-size:1.1rem; font-weight:700;">${a.titre}</h3>
        <div class="price-tag">${a.prix} ${a.devise} <span style="font-size:0.8rem; font-weight:normal; color:var(--text-light)">/ ${a.periode}</span></div>
        <div style="font-size:0.8rem; color:var(--text-light); margin-bottom:8px;">📍 ${a.ville}${a.commune ? ' · ' + a.commune : ''}</div>
        ${descriptionMarkup}
        ${imagesMarkup}
        <div class="card-footer">
          <span class="${a.statut === 'occupe' ? 'status-occupe' : 'status-disponible'}">${a.statut === 'occupe' ? '🔴 Occupé' : '🟢 Disponible'}</span>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn-action report" onclick="signalerAnnonce(${a.id})">⚠️ Signaler</button>
            ${isOwner ? '' : `<button class="btn-action chat" onclick="ouvrirMessagerieDirecteInstantane(${a.id}, '${a.titre.replace(/'/g, "\\'")}')">💬 Message</button>`}
            ${shopButtonMarkup}
            <button class="btn-action call" onclick="window.location.href='tel:${a.telephone}'">📞 Appeler</button>
          </div>
        </div>
      </div>`;
  });

  if (!container.dataset.descriptionListenerBound) {
    container.addEventListener("click", event => {
      const blocDescription = event.target.closest(".annonce-description.is-collapsed");
      if (!blocDescription) return;
      basculerDescriptionComplete(blocDescription);
    });
    container.dataset.descriptionListenerBound = "true";
  }
}

function filtrerAnnoncesParBoutiqueProprietaire(ownerId, nupName) {
  let filtered = toutesLesAnnonces.filter(a => a.user_id == ownerId && a.is_vip === true);
  document.getElementById("feed-current-title").textContent = `Vitrine VIP de ${nupName}`;
  document.getElementById("btn-clear-search").style.display = "block";
  rendreFluxHtml(filtered);
}

async function ouvrirMessagerieDirecteInstantane(annonceId, titreAnnonce) {
  if(!localStorage.getItem("nia_user_id")) return ouvrirSecuriseAuth(false);
  const text = prompt(`Votre message pour : "${titreAnnonce}"`);
  if(!text || !text.trim()) return;

  await fetch(`${API}/chat/send`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ annonce_id: annonceId, expediteur_id: localStorage.getItem("nia_user_id"), contenu: text, provenance_contexte: 'normal' })
  });
  alert("Message transmis avec succès !");
}

async function chargerConversationsPrivees() {
  const uid = localStorage.getItem("nia_user_id"); if(!uid) return;
  const res = await fetch(`${API}/chat/conversations/${uid}`);
  const data = await res.json();
  const box = document.getElementById("chat-conversations-list");
  if(data.length === 0) { box.innerHTML = "<p style='color:gray; font-size:0.8rem; margin:0;'>Aucun message.</p>"; return; }

  box.innerHTML = data.map(c => {
    const estAdmin = c.expediteur_nup === "NUP-ADMIN";
    const estBroadcast = c.provenance_contexte === "broadcast";

    return `
    <div style="background:${estAdmin ? '#fef2f2' : 'white'}; padding:10px; border-radius:8px; border:1px solid ${estAdmin ? 'var(--danger)' : 'var(--border)'}; font-size:0.85rem; display:flex; flex-direction:column; gap:4px;">
      <div style="font-weight:700; color:${estAdmin ? 'var(--danger)' : 'var(--primary)'};">
        ${estBroadcast ? '📢 ALERTE GÉNÉRALE INFO (Réponse impossible)' : estAdmin ? '🚨 MODÉRATION ADMINISTRATIVE' : `Sujet : ${c.annonce_titre || 'Général'}`}
      </div>
      <div style="color:var(--text-light); font-size:0.75rem;">De : ${c.expediteur_nup} ➔ À : ${c.destinataire_nup}</div>
      <div style="background:#f1f5f9; padding:8px; border-radius:6px; font-style:italic; margin-top:4px; color:var(--text)">"${c.contenu}"</div>
      
      ${c.reponse_utilisateur ? `<div style="color:var(--success); font-weight:700; margin-top:4px;">✓ Justification : "${c.reponse_utilisateur}"</div>` : 
        (estAdmin && !estBroadcast) ? `<div style="margin-top:6px; display:flex; gap:6px;"><input id="justif-reply-to-${c.id}" placeholder="Entrez votre explication..." style="flex:1; padding:8px; border:1px solid var(--border); border-radius:6px; font-size:0.8rem;"><button class="btn-auth" style="font-size:0.75rem; padding:8px 12px;" onclick="soumettreJustificationVersAdmin(${c.id})">Envoyer</button></div>` : ''}
    </div>`;
  }).join("");
}

async function soumettreJustificationVersAdmin(msgId) {
  const text = document.getElementById(`justif-reply-to-${msgId}`).value.trim(); if(!text) return;
  await fetch(`${API}/chat/reply-justification/${msgId}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ reponse: text })
  });
  alert("Justification envoyée !"); chargerConversationsPrivees();
}

async function signalerAnnonce(id) {
  const raison = prompt("Indiquez le motif de l'alerte :"); if(!raison) return;
  await fetch(`${API}/annonces/${id}/signaler`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ raison })
  });
  alert("Signalement enregistré.");
}

function inviterAmisWhatsApp() {
  const message = encodeURIComponent(`🌟 Découvre NIA RDC, la meilleure plateforme de services et d'annonces à Lubumbashi !\nTrouve facilement ce dont tu as besoin.\n👉 ${API}`);
  window.open(`https://wa.me/?text=${message}`, "_blank");
}

function basculerOngletProfil(mode) {
  ONGLET_PROFIL_ACTIF = mode;
  document.getElementById("btn-tab-std").className = mode === "standard" ? "btn-auth" : "btn-auth sec";
  document.getElementById("btn-tab-vip").className = mode === "vip" ? "btn-auth" : "btn-auth sec";

  const currentUserId = localStorage.getItem("nia_user_id");
  const listDiv = document.getElementById("profil-annonces-list");
  listDiv.innerHTML = "";

  let userList = toutesLesAnnonces.filter(a => a.user_id == currentUserId && a.is_vip === (mode === "vip"));

  if(userList.length === 0) { listDiv.innerHTML = "<p style='color:gray; text-align:center; font-size:0.85rem;'>Aucun bien.</p>"; return; }

  listDiv.innerHTML = userList.map(a => `
    <div style="background:#f8fafc; padding:14px; border-radius:10px; border:1px solid var(--border); margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
      <div style="font-weight:600; font-size:0.85rem;">${a.titre} <span style="color:var(--primary); font-weight:700;">(${a.prix} ${a.devise})</span></div>
      <div style="display:flex; gap:4px;">
        <button class="btn-auth" style="background:#f59e0b; font-size:0.75rem; padding:6px 10px;" onclick="executerProcessusInterstitielBoost(${a.id})">🚀 Booster</button>
        <button class="btn-auth sec" style="font-size:0.75rem; padding:6px 10px;" onclick='ouvrirFenetreModificationAnnonce(${JSON.stringify(a).replace(/"/g, '&quot;')})'>✏️ Éditer</button>
        <button class="btn-auth" style="background:var(--danger); font-size:0.75rem; padding:6px 10px;" onclick="supprimerAnnonceProfil(${a.id})">🗑️</button>
      </div>
    </div>`).join("");
}

function executerProcessusInterstitielBoost(id) {
  const m = document.getElementById("modal-adsense-interstitiel");
  m.style.display = "flex";
  setTimeout(async () => {
    m.style.display = "none";
    await fetch(`${API}/annonces/${id}/boost`, { method: "POST" });
    alert("Annonce boostée !"); fermerModal("profil"); chargerFluxPrincipal();
  }, 2500);
}

function ouvrirFenetreModificationAnnonce(a) {
  document.getElementById("edit-id").value = a.id;
  document.getElementById("edit-titre").value = a.titre;
  document.getElementById("edit-prix").value = a.prix;
  document.getElementById("edit-devise").value = a.devise;
  document.getElementById("edit-periode").value = a.periode;
  document.getElementById("edit-statut").value = a.statut;
  document.getElementById("edit-telephone").value = a.telephone;
  document.getElementById("edit-description").value = a.description || "";
  editAnnonceImages = a.images ? [...a.images] : [];
  renderEditPhotos();
  const newInput = document.getElementById("edit-new-photos");
  if (newInput) newInput.value = "";
  ouvrirModal("modifier");
}

function renderEditPhotos() {
  const container = document.getElementById("edit-photos-preview");
  if (!container) return;
  if (editAnnonceImages.length === 0) {
    container.innerHTML = "<span style='color:#94a3b8; font-size:0.8rem;'>Aucune photo</span>";
    return;
  }
  container.innerHTML = editAnnonceImages.map(img => `
    <div style="position:relative; display:inline-block;">
      <img src="${img.url}" data-lightbox="${img.url}" onclick="ouvrirLightbox(this.dataset.lightbox)" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0; cursor:pointer;" alt="Photo de l'annonce">
      <button onclick="supprimerPhotoEdit(${img.id})" aria-label="Supprimer la photo" style="position:absolute; top:-6px; right:-6px; width:22px; height:22px; border-radius:50%; background:#ef4444; color:white; border:none; cursor:pointer; font-size:0.7rem; display:flex; align-items:center; justify-content:center;">✕</button>
    </div>`).join("");
}

async function supprimerPhotoEdit(imageId) {
  try {
    const res = await fetch(`${API}/images/${imageId}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      editAnnonceImages = editAnnonceImages.filter(img => img.id !== imageId);
      renderEditPhotos();
    } else {
      alert("Impossible de supprimer la photo.");
    }
  } catch(e) { alert("Erreur lors de la suppression de la photo."); }
}

function ouvrirLightbox(url) {
  document.getElementById("lightbox-img").src = url;
  document.getElementById("modal-lightbox").style.display = "flex";
}

async function sauvegarderChangementsAnnonce() {
  const id = document.getElementById("edit-id").value;
  const titre = document.getElementById("edit-titre").value;
  const description = document.getElementById("edit-description").value;

  const erreurContenu = verifierContenuInterdits(titre, description);
  if (erreurContenu) return alert("⛔ " + erreurContenu);

  const newFiles = document.getElementById("edit-new-photos").files;
  let nouvelles_images_base64 = [];
  for (let i = 0; i < newFiles.length; i++) {
    nouvelles_images_base64.push(await traiterFichierEnBase64(newFiles[i]));
  }
  const res = await fetch(`${API}/annonces/${id}`, {
    method: "PUT", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titre, prix: document.getElementById("edit-prix").value,
      devise: document.getElementById("edit-devise").value, periode: document.getElementById("edit-periode").value,
      statut: document.getElementById("edit-statut").value, telephone: document.getElementById("edit-telephone").value,
      description, ville: "Lubumbashi",
      nouvelles_images_base64
    })
  });
  fermerModal("modifier"); fermerModal("profil"); chargerFluxPrincipal();
}

async function supprimerAnnonceProfil(id) {
  if(confirm("Confirmer la suppression complète ?")) {
    await fetch(`${API}/annonces/${id}/delete`, { method: "DELETE" });
    fermerModal("profil"); chargerFluxPrincipal();
  }
}

function rafraichirVueVipFormulaire() {
  const s = document.getElementById("vip-setup-zone");
  s.innerHTML = `
    <div id="vip-multi-blocks" style="display:flex; flex-direction:column; gap:14px;"></div>
    <div style="display:flex; flex-direction:column; gap:8px; margin-top:14px; border-top:1px solid #fde68a; padding-top:14px;">
      <button class="btn-auth sec" style="width:100%;" onclick="ajouterBlocObjetAuCatalogueVip()">➕ Ajouter un logement</button>
      <button class="btn-auth" style="width:100%; background:linear-gradient(135deg,#f59e0b,#ec4899); font-size:1rem; padding:14px; letter-spacing:0.5px;" onclick="sauvegarderEtPublierToutLeCatalogueVip()">🚀 Publier la Vitrine VIP</button>
    </div>`;
  BLOCS_VIP_COMPTEUR = 0; ajouterBlocObjetAuCatalogueVip();
}

function ajouterBlocObjetAuCatalogueVip() {
  BLOCS_VIP_COMPTEUR++;
  const container = document.getElementById("vip-multi-blocks");
  const row = document.createElement("div");
  row.className = "vip-pure-block"; row.id = `vip-b-${BLOCS_VIP_COMPTEUR}`;
  row.style = "background:#fffdf5; border:2px solid #f59e0b; padding:14px; border-radius:12px; display:flex; flex-direction:column; gap:8px;";
  row.innerHTML = `
    <div style="font-weight:800; font-size:0.85rem; color:#f59e0b; border-bottom:1px solid #fde68a; padding-bottom:6px; margin-bottom:2px;">🏠 Logement VIP #${BLOCS_VIP_COMPTEUR}</div>
    <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Titre *</label><input class="vip-in-titre" placeholder="Ex: Studio meublé bien aménagé"></div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Prix</label><input class="vip-in-prix" type="number" placeholder="150"></div>
      <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Période</label><select class="vip-in-periode"><option value="jour">/ Jour</option><option value="heure">/ Heure</option></select></div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Ville</label><input class="vip-in-ville" value="Lubumbashi"></div>
      <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Commune</label><input class="vip-in-commune" placeholder="Ex: Kenya"></div>
    </div>
    <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Disponibilité</label><select class="vip-in-statut"><option value="disponible">🟢 Disponible</option><option value="occupe">🔴 Occupé</option></select></div>
    <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Description</label><textarea class="vip-in-desc" placeholder="Caractéristiques, équipements..." rows="2"></textarea></div>
    <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">📷 Photos du bien (Max 5)</label><input type="file" class="vip-in-photos" multiple accept="image/*" style="border:none; background:transparent; padding:0;"></div>`;
  container.appendChild(row);
}

async function sauvegarderEtPublierToutLeCatalogueVip() {
  const nodes = document.querySelectorAll(".vip-pure-block");
  for(let n of nodes) {
    const titre = n.querySelector(".vip-in-titre").value.trim();
    if(!titre) continue;

    const descVal = n.querySelector(".vip-in-desc").value;
    const erreurContenu = verifierContenuInterdits(titre, descVal);
    if (erreurContenu) { alert("⛔ " + erreurContenu); return; }

    const photoFiles = n.querySelector(".vip-in-photos").files;
    let images_base64 = [];
    for(let i = 0; i < photoFiles.length; i++){
      images_base64.push(await traiterFichierEnBase64(photoFiles[i]));
    }

    const res = await fetch(`${API}/annonces`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: localStorage.getItem("nia_user_id"), 
        titre, 
        prix: n.querySelector(".vip-in-prix").value || 0,
        devise: "$", 
        periode: n.querySelector(".vip-in-periode").value, 
        statut: n.querySelector(".vip-in-statut").value,
        telephone: localStorage.getItem("nia_user_tel"), 
        description: descVal, 
        ville: n.querySelector(".vip-in-ville").value || "Lubumbashi", 
        commune: n.querySelector(".vip-in-commune").value || "",
        quartier: "", 
        is_vip: true, 
        images_base64
      })
    });
    const data = await res.json();
    if (!data.success) { alert("⛔ " + (data.error || "Erreur lors de la publication.")); return; }
  }
  fermerModal("vip"); chargerFluxPrincipal();
}

async function envoyerMessageGlobalBroadcast() {
  const msg = document.getElementById("admin-broadcast-text").value.trim();
  if(!msg) return alert("Veuillez saisir un message.");

  const res = await fetch(`${API}/admin/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenu: msg })
  });
  const data = await res.json();
  if(data.success) {
    alert("Message collectif envoyé à tous les utilisateurs !");
    document.getElementById("admin-broadcast-text").value = "";
  }
}

function appliquerFiltresAdmin() {
  definirVueAdmin(VUE_ADMIN_ACTIVE);
}

async function definirVueAdmin(mode) {
  VUE_ADMIN_ACTIVE = mode; const box = document.getElementById("admin-main-render-box"); box.innerHTML = "Chargement...";

  const fVille = document.getElementById("admin-filter-ville").value.toLowerCase().trim();
  const fType = document.getElementById("admin-filter-type").value;

  let listeFiltree = toutesLesAnnonces.filter(a => {
    if(fVille && (!a.ville || !a.ville.toLowerCase().includes(fVille))) return false;
    if(fType === "standard" && a.is_vip) return false;
    if(fType === "vip" && !a.is_vip) return false;
    return true;
  });

  if(mode === "flux") {
    box.innerHTML = listeFiltree.map(a => `
      <div style="background:#1e293b; padding:10px; border-radius:8px; font-size:0.8rem; display:flex; flex-direction:column; gap:6px;">
        <div><span style="color:#38bdf8; font-weight:700;">[${a.proprietaire_nup || 'SANS NUP'}]</span> <b>${a.titre}</b> (${a.is_vip ? '👑 VIP' : '📜 Stand.'}) à <i>${a.ville}</i></div>
        <div style="display:flex; gap:6px;">
          <input id="adm-input-${a.id}" placeholder="Message de modération..." style="flex:1; color:black; border-radius:6px; padding:6px; border:none; font-size:0.8rem;">
          <button onclick="envoyerMessageDepuisAdminAuNup(${a.id}, 'signale')" style="background:var(--success); color:white; border:none; border-radius:6px; padding:0 10px; font-weight:600;">Contacter</button>
          <button onclick="supprimerAnnonceParAdmin(${a.id})" style="background:var(--danger); color:white; border:none; border-radius:6px; padding:0 8px;">🗑️</button>
        </div>
      </div>`).join("");
  }
  else if(mode === "signaux") {
    const res = await fetch(`${API}/admin/reports`); const data = await res.json();
    if(data.length === 0) { box.innerHTML = "<p style='color:gray; font-size:0.8rem;'>Aucun signalement.</p>"; return; }
    box.innerHTML = data.map(r => `
      <div style="background:#1e293b; padding:10px; border-radius:8px; border-left:4px solid var(--danger); font-size:0.8rem; display:flex; flex-direction:column; gap:6px;">
        <div style="color:#f87171; font-weight:700;">⚠️ MOTIF : "${r.raison}"</div>
        <div style="color:#cbd5e1;">Cible : ${r.titre} | Propriétaire : <b>${r.proprietaire_nup || 'Inconnu'}</b></div>
        <div style="display:flex; gap:6px;">
          <input id="adm-input-${r.id}" placeholder="Explication requise..." style="flex:1; color:black; border-radius:6px; padding:6px; border:none; font-size:0.8rem;">
          <button onclick="envoyerMessageDepuisAdminAuNup(${r.id}, 'signale')" style="background:#f59e0b; color:white; border:none; border-radius:6px; padding:0 10px; font-weight:600;">Exiger Justif</button>
        </div>
      </div>`).join("");
  }
  else if(mode === "justifications") {
    const res = await fetch(`${API}/admin/all-justifications/signale`); const data = await res.json();
    if(data.length === 0) { box.innerHTML = "<p style='color:gray; font-size:0.8rem;'>Aucune justification disponible.</p>"; return; }
    box.innerHTML = data.map(m => `
      <div style="background:#1e293b; padding:10px; border-radius:8px; font-size:0.8rem; display:flex; flex-direction:column; gap:4px;">
        <div style="color:#94a3b8;"><b>Alerte envoyée :</b> ${m.contenu}</div>
        <div style="color:#34d399; font-weight:700;"><b>↩️ Réponse du profil [${m.user_nup}] :</b> "${m.reponse_utilisateur}"</div>
      </div>`).join("");
  }
  else if(mode === "messages") {
    const res = await fetch(`${API}/admin/messages`); const data = await res.json();
    if(!Array.isArray(data) || data.length === 0) { box.innerHTML = "<p style='color:gray; font-size:0.8rem;'>Aucun message.</p>"; return; }
    box.innerHTML = data.map(m => `
      <div style="background:#1e293b; padding:10px; border-radius:8px; font-size:0.8rem; display:flex; flex-direction:column; gap:4px; border-left:3px solid #6366f1;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
          <div style="color:#a5b4fc; font-weight:700;">${echapperHtml(m.expediteur_nup)} ➔ ${echapperHtml(m.destinataire_nup)}</div>
          <div style="color:#64748b; font-size:0.72rem;">${new Date(m.created_at).toLocaleString('fr-FR')}</div>
        </div>
        ${m.annonce_titre ? `<div style="color:#94a3b8; font-size:0.75rem;">📋 ${echapperHtml(m.annonce_titre)}</div>` : ""}
        <div style="background:#0f172a; padding:8px; border-radius:6px; color:#e2e8f0; font-style:italic;">"${echapperHtml(m.contenu)}"</div>
        ${m.reponse_utilisateur ? `<div style="color:#34d399; font-size:0.75rem;">↩️ Réponse : "${echapperHtml(m.reponse_utilisateur)}"</div>` : ""}
        <button onclick="supprimerMessageParAdmin(${m.id})" style="align-self:flex-end; background:var(--danger); color:white; border:none; border-radius:6px; padding:4px 12px; font-size:0.75rem; font-weight:700; cursor:pointer;">🗑️ Supprimer</button>
      </div>`).join("");
  }
}

async function envoyerMessageDepuisAdminAuNup(annonceId, ctx) {
  const msg = document.getElementById(`adm-input-${annonceId}`).value.trim(); if(!msg) return;
  await fetch(`${API}/admin/send-to-nup`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ annonce_id: annonceId, contenu: msg, provenance_contexte: ctx })
  });
  alert("Message envoyé !");
  document.getElementById(`adm-input-${annonceId}`).value = "";
  definirVueAdmin(VUE_ADMIN_ACTIVE);
}

async function supprimerAnnonceParAdmin(id) { 
  if(confirm("Retirer cette annonce du serveur ?")) { 
    await fetch(`${API}/annonces/${id}/delete`, { method: "DELETE" }); 
    chargerFluxPrincipal(); 
    setTimeout(() => definirVueAdmin(VUE_ADMIN_ACTIVE), 400); 
  } 
}

async function supprimerMessageParAdmin(id) {
  if(confirm("Supprimer ce message définitivement ? Il disparaîtra pour tous les utilisateurs.")) {
    const res = await fetch(`${API}/admin/messages/${id}`, { method: "DELETE" });
    const data = await res.json();
    if(data.success) {
      definirVueAdmin("messages");
    } else {
      alert("Erreur lors de la suppression du message.");
    }
  }
}

let _adminLongPressTimer = null;
let _adminCountdownInterval = null;
let _adminPressing = false;
let _adminSwipePending = false;
let _adminSwipeStartY = null;
let _adminSwipeStartX = null;

function demarrerClicLongAdmin(e) {
  e.preventDefault();
  if (_adminPressing) return;
  _adminPressing = true;
  _adminSwipePending = false;
  let secondesRestantes = 10;
  const countdownEl = document.getElementById("admin-press-countdown");
  const progressEl = document.getElementById("admin-press-progress");
  if (countdownEl) countdownEl.textContent = secondesRestantes;
  if (progressEl) progressEl.style.display = "block";

  _adminCountdownInterval = setInterval(() => {
    secondesRestantes--;
    if (countdownEl) countdownEl.textContent = secondesRestantes;
    if (secondesRestantes <= 0) {
      clearInterval(_adminCountdownInterval);
      _adminCountdownInterval = null;
      _adminPressing = false;
      if (progressEl) progressEl.style.display = "none";
      _adminSwipePending = true;
      if (navigator.vibrate) navigator.vibrate([100, 50, 100]);
      _afficherOverlayBalayage();
    }
  }, 1000);
}

function arreterClicLongAdmin(e) {
  if (_adminCountdownInterval) {
    clearInterval(_adminCountdownInterval);
    _adminCountdownInterval = null;
  }
  _adminPressing = false;
  const progressEl = document.getElementById("admin-press-progress");
  if (progressEl && !_adminSwipePending) progressEl.style.display = "none";
}

function _afficherOverlayBalayage() {
  const overlay = document.getElementById("admin-swipe-overlay");
  if (!overlay) return;
  overlay.style.display = "flex";

  function onTouchStart(ev) {
    _adminSwipeStartY = ev.touches[0].clientY;
    _adminSwipeStartX = ev.touches[0].clientX;
  }
  function onTouchEnd(ev) {
    if (_adminSwipeStartY === null) return;
    const dy = _adminSwipeStartY - ev.changedTouches[0].clientY;
    const dx = Math.abs(_adminSwipeStartX - ev.changedTouches[0].clientX);
    if (dy > 60 && dy > dx) { _cacherOverlayBalayage(); ouvrirAccesAdmin(); }
  }
  function onMouseDown(ev) {
    _adminSwipeStartY = ev.clientY;
    _adminSwipeStartX = ev.clientX;
  }
  function onMouseUp(ev) {
    if (_adminSwipeStartY !== null) {
      const dy = _adminSwipeStartY - ev.clientY;
      const dx = Math.abs(_adminSwipeStartX - ev.clientX);
      if (dy > 60 && dy > dx) { _cacherOverlayBalayage(); ouvrirAccesAdmin(); }
    }
    _adminSwipeStartY = null;
    _adminSwipeStartX = null;
  }

  overlay._touchStart = onTouchStart;
  overlay._touchEnd = onTouchEnd;
  overlay._mouseDown = onMouseDown;
  overlay._mouseUp = onMouseUp;
  overlay.addEventListener("touchstart", onTouchStart, { passive: true });
  overlay.addEventListener("touchend", onTouchEnd, { passive: true });
  overlay.addEventListener("mousedown", onMouseDown);
  overlay.addEventListener("mouseup", onMouseUp);
}

function _cacherOverlayBalayage() {
  const overlay = document.getElementById("admin-swipe-overlay");
  if (!overlay) return;
  overlay.style.display = "none";
  _adminSwipePending = false;
  if (overlay._touchStart) overlay.removeEventListener("touchstart", overlay._touchStart);
  if (overlay._touchEnd) overlay.removeEventListener("touchend", overlay._touchEnd);
  if (overlay._mouseDown) overlay.removeEventListener("mousedown", overlay._mouseDown);
  if (overlay._mouseUp) overlay.removeEventListener("mouseup", overlay._mouseUp);
}

function validerAccesAdmin() {
  const code = document.getElementById("admin-access-code").value.trim();
  const feedback = document.getElementById("admin-access-feedback");
  if (!code) {
    if (feedback) feedback.textContent = "Veuillez saisir un code d'accès.";
    return;
  }
  if (code === "BEN4002ET4200") {
    if (feedback) feedback.textContent = "";
    fermerModal("admin-access");
    document.getElementById("admin-access-code").value = "";
    ouvrirModal("admin");
    definirVueAdmin("flux");
  } else {
    if (feedback) feedback.textContent = "Code superviseur incorrect.";
  }
}

function ouvrirAccesAdmin() {
  const feedback = document.getElementById("admin-access-feedback");
  if (feedback) feedback.textContent = "";
  document.getElementById("admin-access-code").value = "";
  ouvrirModal("admin-access");
  requestAnimationFrame(() => document.getElementById("admin-access-code").focus());
}

function executerRecherche() {
  const kw = document.getElementById("search-keyword").value.toLowerCase();
  const v = document.getElementById("search-ville").value.toLowerCase();
  let matches = toutesLesAnnonces.filter(a => {
    let matchKw = kw === "" || a.titre.toLowerCase().includes(kw);
    let matchVille = v === "" || (a.ville && a.ville.toLowerCase().includes(v));
    return matchKw && matchVille;
  });
  document.getElementById("feed-current-title").textContent = "Résultats du filtrage";
  document.getElementById("btn-clear-search").style.display = "block";
  rendreFluxHtml(matches); fermerModal("rechercher");
}

function reinitialiserFluxGeneral() {
  document.getElementById("feed-current-title").textContent = "Annonces récentes";
  document.getElementById("btn-clear-search").style.display = "none";
  rendreFluxHtml(toutesLesAnnonces);
}

setInterval(chargerFluxPrincipal, 20000);
document.addEventListener("DOMContentLoaded", () => { rafraichirHeaderVisuel(); chargerFluxPrincipal(); });