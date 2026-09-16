const API = "https://nia-rdc-1k3x.onrender.com";

let toutesLesAnnonces = [];
let toutesLesAnnoncesOccasion = [];
let VUE_ADMIN_ACTIVE = "flux";
let ONGLET_PROFIL_ACTIF = "standard";
let BLOCS_VIP_COMPTEUR = 0;
let editAnnonceImages = [];
let currentUniverse = localStorage.getItem("nia_universe") || "location";

const LONGUEUR_MIN_DESCRIPTION_REDUITE = 140;
const RATIO_DESCRIPTION_REDUITE = 0.5;
const SEUIL_MOT_COMPLET = 0.6;

const TEXTES_DU_DROIT = {
  securite: `Conditions de sécurité et d'utilisation de NIA RDC

Bienvenue sur NIA RDC.

Avant de créer un compte, veuillez lire les présentes conditions. En utilisant la plateforme, vous acceptez les règles suivantes.

1. Utilisation de la plateforme

NIA RDC est une plateforme destinée à faciliter la publication et la consultation d'annonces de location, de services. Les utilisateurs s'engagent à utiliser la plateforme de manière honnête et conforme aux lois.

2. Exactitude des informations

Chaque utilisateur est responsable des informations qu'il publie. Les annonces doivent être exactes et ne pas contenir d'informations trompeuses ou mensongères.

3. Protection du compte

L'utilisateur est responsable de la confidentialité de son numéro de téléphone, de son mot de passe et des activités réalisées depuis son compte.

4. Contenus interdits

Il est interdit de publier des contenus contraires aux lois, frauduleux, trompeurs ou portant atteinte aux droits d'autrui.

5. Photos et annonces

L'utilisateur garantit qu'il possède les droits nécessaires sur les photos et les informations publiées.

6. Protection des données

NIA RDC collecte uniquement les informations nécessaires au fonctionnement du service.

7. Sécurité

NIA RDC met en œuvre des mesures techniques raisonnables pour protéger les données des utilisateurs.

8. Responsabilité

NIA RDC agit comme plateforme de mise en relation et n'est pas partie aux accords conclus entre les utilisateurs.

9. Modération

NIA RDC peut suspendre ou supprimer un compte ou une annonce en cas de non-respect des présentes conditions.

10. Évolution des conditions

Ces conditions peuvent être mises à jour afin d'améliorer la plateforme.

Acceptation

En créant un compte sur NIA RDC, je reconnais avoir lu les présentes conditions de sécurité et d'utilisation et j'accepte de les respecter.`,
  apropos: `À propos de NIA RDC

Bienvenue sur NIA RDC.

NIA RDC est une plateforme numérique conçue pour faciliter la mise en relation entre les personnes souhaitant louer, proposer ou rechercher des biens et des services en République Démocratique du Congo.

Notre mission est de permettre à chacun de trouver ou de proposer des objets, équipements et services en toute simplicité, tout en favorisant les opportunités économiques locales.

Ce que propose NIA RDC

Les utilisateurs peuvent notamment :
- publier des annonces ;
- consulter les annonces disponibles ;
- contacter les annonceurs ;
- rechercher des biens et services selon leurs besoins.

Notre vision

Nous souhaitons contribuer au développement des échanges et des services numériques en RDC.

Merci de votre confiance.`,
  confidentialite: `Politique de confidentialité de NIA RDC

Dernière mise à jour : Juin 2026.

La protection des informations personnelles de nos utilisateurs est importante. Cette politique explique quelles informations sont collectées, pourquoi elles sont utilisées et les droits des utilisateurs.`
};

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
  const texte = normaliserTexte((titre || "") + " " + (description || ""));
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
  if (chk) chk.checked = false;

  box.addEventListener("scroll", () => {
    if (box.scrollHeight - box.scrollTop <= box.clientHeight + 15) {
      if (chk && chk.hasAttribute("disabled")) {
        chk.removeAttribute("disabled");
        chk.onchange = function () {
          if (this.checked) btnReg.removeAttribute("disabled");
          else btnReg.setAttribute("disabled", "true");
        };
      }
    }
  });
}

function toggleMenuLegal() {
  const m = document.getElementById("legal-dropdown");
  if (!m) return;
  m.style.display = m.style.display === "block" ? "none" : "block";
}

function afficherDocumentJurisEtSecu(cle) {
  const titleEl = document.getElementById("legal-header-title");
  const bodyEl = document.getElementById("legal-body-content");
  if (titleEl) titleEl.textContent = cle === "securite" ? "📜 Sécurité & CGU" : cle === "apropos" ? "ℹ️ À propos de NIA RDC" : "🔒 Politique de Confidentialité";
  if (bodyEl) bodyEl.textContent = TEXTES_DU_DROIT[cle];
  const menu = document.getElementById("legal-dropdown");
  if (menu) menu.style.display = "none";
  ouvrirModal("legal-display");
}

function rafraichirHeaderVisuel() {
  const isLogged = localStorage.getItem("nia_user_id");
  const zone = document.getElementById("header-auth-zone");
  if (zone) zone.style.display = isLogged ? "none" : "flex";
}

function ouvrirSecuriseAuth(inscription = true) {
  basculerAffichageAuthentification(inscription);
  ouvrirModal("auth");
  if (inscription) {
    const scroller = document.getElementById("cgu-scroller-node");
    if (scroller) {
      scroller.innerHTML = TEXTES_DU_DROIT.securite;
      scroller.scrollTop = 0;
    }
    const chk = document.getElementById("chk-accept-rules");
    const btnReg = document.getElementById("btn-register-action");
    if (chk) chk.setAttribute("disabled", "true");
    if (btnReg) btnReg.setAttribute("disabled", "true");
    setTimeout(brancherEvenementScrollControle, 200);
  }
}

function basculerAffichageAuthentification(versInscription) {
  const title = document.getElementById("auth-main-title");
  const reg = document.getElementById("form-register-block");
  const log = document.getElementById("form-login-block");
  if (title) title.textContent = versInscription ? "Inscription" : "Connexion";
  if (reg) reg.style.display = versInscription ? "grid" : "none";
  if (log) log.style.display = versInscription ? "none" : "grid";
}

function ouvrirSecuriseModal(id) {
  if (!localStorage.getItem("nia_user_id")) ouvrirSecuriseAuth(false);
  else ouvrirModal(id);
}

function ouvrirModal(id) {
  const element = document.getElementById(`modal-${id}`);
  if (element) element.style.display = "flex";
  if (id === "vip") rafraichirVueVipFormulaire();
  if (id === "profil") {
    const nup = localStorage.getItem("nia_user_nup") || "Non assigné";
    const nupEl = document.getElementById("user-profile-nup-title");
    if (nupEl) nupEl.textContent = `Mon Numéro de Profil Unique : ${nup}`;
    basculerOngletProfil(ONGLET_PROFIL_ACTIF);
    chargerConversationsPrivees();
  }
}

function fermerModal(id) {
  const element = document.getElementById(`modal-${id}`);
  if (element) element.style.display = "none";
}

function deconnexion() {
  localStorage.clear();
  window.location.reload();
}

async function actionInscription() {
  const telephone = document.getElementById("reg-tel").value.trim();
  const password = document.getElementById("reg-pass").value.trim();
  if (!telephone || !password) return alert("Remplissez tous les champs.");

  const res = await fetch(`${API}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telephone, password })
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem("nia_user_id", data.user.id);
    localStorage.setItem("nia_user_tel", data.user.telephone);
    localStorage.setItem("nia_user_nup", data.user.nup);
    localStorage.removeItem("nia_universe");
    window.location.reload();
  } else alert(data.error);
}

async function actionConnexion() {
  const telephone = document.getElementById("log-tel").value.trim();
  const password = document.getElementById("log-pass").value.trim();
  const res = await fetch(`${API}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ telephone, password })
  });
  const data = await res.json();

  if (data.success) {
    localStorage.setItem("nia_user_id", data.user.id);
    localStorage.setItem("nia_user_tel", data.user.telephone);
    localStorage.setItem("nia_user_nup", data.user.nup);
    localStorage.removeItem("nia_universe");
    window.location.reload();
  } else alert(data.error);
}

async function suppressionDefinitiveCompte() {
  if (confirm("⚠️ Voulez-vous supprimer définitivement votre compte et vos publications ?")) {
    const user_id = localStorage.getItem("nia_user_id");
    if (!user_id) return;
    const res = await fetch(`${API}/auth/delete-account`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id })
    });
    const data = await res.json();
    if (data.success) deconnexion();
  }
}

function traiterFichierEnBase64(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let w = img.width, h = img.height;
        if (w > 500) { h = Math.round((h * 500) / w); w = 500; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL("image/jpeg", 0.6));
      };
    };
  });
}

function renderUniverseNavigation() {
  const vipBtn = document.getElementById("nav-vip-location");
  if (vipBtn) vipBtn.style.display = currentUniverse === "location" ? "flex" : "none";

  const switchBtn = document.getElementById("btn-switch-universe");
  if (switchBtn) switchBtn.textContent = currentUniverse === "location" ? "Changer d’univers ⤴️" : "Retour vers les univers ⤴️";

  const publishBtn = document.getElementById("btn-publish-market");
  if (publishBtn) {
    publishBtn.style.display = currentUniverse === "occasion" ? "flex" : "none";
  }
}

function switchUniverse(universe) {
  currentUniverse = universe;
  localStorage.setItem("nia_universe", universe);
  renderUniverseNavigation();
  fermerModal("univers-choix");
  if (universe === "occasion") {
    document.getElementById("feed-current-title").textContent = "Marché d'occasion";
    chargerFluxOccasion();
  } else {
    document.getElementById("feed-current-title").textContent = "Annonces récentes";
    chargerFluxPrincipal();
  }
}

function ouvrirChoixUnivers() {
  ouvrirModal("univers-choix");
}

function setCurrentUniverseFromPreference() {
  const saved = localStorage.getItem("nia_universe");
  if (saved === "occasion" || saved === "location") currentUniverse = saved;
  else if (!localStorage.getItem("nia_user_id")) currentUniverse = "location";
  renderUniverseNavigation();
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
  for (let i = 0; i < files.length; i++) images_base64.push(await traiterFichierEnBase64(files[i]));

  const res = await fetch(`${API}/annonces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: localStorage.getItem("nia_user_id"),
      titre,
      prix,
      devise,
      periode,
      statut,
      telephone,
      description,
      ville,
      commune,
      quartier: "",
      is_vip: false,
      images_base64
    })
  });

  const data = await res.json();
  if (!data.success) return alert("⛔ " + (data.error || "Erreur lors de la publication."));
  fermerModal("publier");
  chargerFluxPrincipal();
}

async function soumettreAnnonceOccasion() {
  const titre = document.getElementById("occasion-titre").value.trim();
  const prix = document.getElementById("occasion-prix").value.trim();
  const devise = document.getElementById("occasion-devise").value;
  const etatObjet = document.getElementById("occasion-etat").value;
  const statut = document.getElementById("occasion-disponibilite").value;
  const telephone = document.getElementById("occasion-telephone").value.trim();
  const description = document.getElementById("occasion-description").value.trim();
  const ville = document.getElementById("occasion-ville").value.trim();
  const commune = document.getElementById("occasion-commune").value.trim();
  const quartier = document.getElementById("occasion-quartier").value.trim();
  const avenue = document.getElementById("occasion-avenue").value.trim();
  const numeroParcelle = document.getElementById("occasion-numero-parcelle").value.trim();
  const files = document.getElementById("occasion-photos").files;

  if (!titre || !prix || !telephone) return alert("Titre, prix et numéro de contact sont obligatoires.");

  const erreurContenu = verifierContenuInterdits(titre, description);
  if (erreurContenu) return alert("⛔ " + erreurContenu);

  let images_base64 = [];
  for (let i = 0; i < Math.min(files.length, 5); i++) images_base64.push(await traiterFichierEnBase64(files[i]));

  const res = await fetch(`${API}/marketplace/annonces`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: localStorage.getItem("nia_user_id"),
      titre,
      prix: Number(prix),
      devise,
      etat_objet: etatObjet,
      statut,
      telephone,
      description,
      ville,
      commune,
      quartier,
      avenue,
      numero_parcelle: numeroParcelle,
      images_base64
    })
  });

  const data = await res.json();
  if (!data.success) return alert("⛔ " + (data.error || "Erreur lors de la publication."));
  fermerModal("publier-occasion");
  chargerFluxOccasion();
}

async function chargerFluxPrincipal() {
  try {
    const res = await fetch(`${API}/feed`);
    toutesLesAnnonces = await res.json();
    if (currentUniverse === "location") renduFluxActif();
    if (document.getElementById("admin-total-count")) document.getElementById("admin-total-count").textContent = toutesLesAnnonces.length;
  } catch (e) {
    document.getElementById("feed").innerHTML = "Erreur de synchronisation...";
  }
}

async function chargerFluxOccasion() {
  try {
    const res = await fetch(`${API}/marketplace/feed`);
    toutesLesAnnoncesOccasion = await res.json();
    if (currentUniverse === "occasion") renduFluxActif();
  } catch (e) {
    if (document.getElementById("feed")) document.getElementById("feed").innerHTML = "Erreur de synchronisation du marché d'occasion...";
  }
}

function renduFluxActif() {
  const feed = document.getElementById("feed");
  if (!feed) return;
  if (currentUniverse === "occasion") {
    document.getElementById("feed-current-title").textContent = "Marché d'occasion";
    rendreFluxOccasionHtml(toutesLesAnnoncesOccasion);
  } else {
    document.getElementById("feed-current-title").textContent = "Annonces récentes";
    rendreFluxHtml(toutesLesAnnonces);
  }
}

function echapperHtml(texte = "") {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
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
  if (!descriptionBrute) return "";
  if (descriptionBrute.length <= LONGUEUR_MIN_DESCRIPTION_REDUITE) return descriptionBrute;
  const longueurReduite = Math.ceil(descriptionBrute.length * RATIO_DESCRIPTION_REDUITE);
  const brutReduit = descriptionBrute.slice(0, longueurReduite).trimEnd();
  const derniereEspace = brutReduit.lastIndexOf(" ");
  const descriptionCoupee = derniereEspace > longueurReduite * SEUIL_MOT_COMPLET ? brutReduit.slice(0, derniereEspace) : brutReduit;
  return `${descriptionCoupee.trimEnd()}…`;
}

function rendreFluxHtml(liste) {
  const container = document.getElementById("feed");
  if (!container) return;
  container.innerHTML = "";
  if (liste.length === 0) {
    container.innerHTML = "<p style='text-align:center; color:gray;'>Aucune offre disponible.</p>";
    return;
  }

  liste.forEach(a => {
    const images = Array.isArray(a.images) ? a.images : [];
    let imagesMarkup = images.length > 0 ? `<div class="gallery">${images.map(img => `<img src="${img.url}" data-lightbox="${img.url}" onclick="ouvrirLightbox(this.dataset.lightbox)" />`).join("")}</div>` : "";
    const descriptionBrute = (a.description || "").trim();
    const descriptionLongue = descriptionBrute.length > LONGUEUR_MIN_DESCRIPTION_REDUITE;
    const descriptionVisible = genererDescriptionVisible(descriptionBrute);
    const descriptionMarkup = `<div class="annonce-description${descriptionLongue ? " is-collapsed" : ""}" ${descriptionLongue ? `data-full="${encodeURIComponent(descriptionBrute)}" data-expanded="false"` : ""}>${echapperHtml(descriptionVisible)}${descriptionLongue ? ' <span class="annonce-description-more">Voir plus</span>' : ""}</div>`;
    const isOwner = a.user_id == localStorage.getItem("nia_user_id");

    container.innerHTML += `
      <div class="${a.is_vip ? "annonce-card vip-premium" : "annonce-card"}">
        ${a.is_vip ? `<div class="badge-vip">👑 VIP EXPRESS</div>` : ""}
        <h3>${echapperHtml(a.titre || "")}</h3>
        <div class="price-tag">${Number(a.prix || 0)} ${echapperHtml(a.devise || "$")} <span style="font-size:0.8rem; font-weight:normal; color:var(--text-light)">/ ${echapperHtml(a.periode || "jour")}</span></div>
        <div style="font-size:0.8rem; color:var(--text-light); margin-bottom:8px;">📍 ${echapperHtml(a.ville || "")} ${a.commune ? '· ' + echapperHtml(a.commune) : ''}</div>
        ${descriptionMarkup}
        ${imagesMarkup}
        <div class="card-footer">
          <span class="${a.statut === 'occupe' ? 'status-occupe' : 'status-disponible'}">${a.statut === 'occupe' ? '🔴 Occupé' : '🟢 Disponible'}</span>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn-action report" onclick="signalerAnnonce(${a.id})">⚠️ Signaler</button>
            ${!isOwner ? `<button class="btn-action chat" onclick="ouvrirMessagerieDirecteInstantane(${a.id}, '${String(a.titre || '').replace(/'/g, "\\'")}' )">💬 Message</button>` : ""}
            <button class="btn-action call" onclick="window.location.href='tel:${a.telephone || ''}'">📞 Appeler</button>
          </div>
        </div>
      </div>
    `;
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

function rendreFluxOccasionHtml(liste) {
  const container = document.getElementById("feed");
  if (!container) return;
  container.innerHTML = "";
  if (liste.length === 0) {
    container.innerHTML = "<p style='text-align:center; color:gray;'>Aucune annonce d'occasion disponible.</p>";
    return;
  }

  liste.forEach(a => {
    const images = Array.isArray(a.images) ? a.images : [];
    const imageMarkup = images.length > 0 ? `<div class="gallery">${images.map(img => `<img src="${img.url}" data-lightbox="${img.url}" onclick="ouvrirLightbox(this.dataset.lightbox)" />`).join("")}</div>` : "";
    const locationText = [a.ville, a.commune, a.quartier, a.avenue, a.numero_parcelle].filter(Boolean).join(" • ");
    const description = (a.description || "").trim();
    const infoText = `État : ${echapperHtml(a.etat_objet || "Bon état")}`;

    container.innerHTML += `
      <div class="annonce-card market-card">
        <div class="market-tag">♻️ Occasion</div>
        <h3>${echapperHtml(a.titre || "")}</h3>
        <div class="price-tag">${Number(a.prix || 0)} ${echapperHtml(a.devise || "$")}</div>
        <div class="market-meta">📍 ${echapperHtml(locationText || "Adresse non précisée")}</div>
        <div class="market-meta">${infoText}</div>
        <div class="market-meta">Disponibilité : ${echapperHtml(a.statut || "Disponible")}</div>
        <div class="annonce-description">${echapperHtml(description || "Aucune description.")}</div>
        ${imageMarkup}
        <div class="card-footer">
          <span class="${a.statut === 'vendu' ? 'status-occupe' : 'status-disponible'}">${a.statut === 'vendu' ? '🔴 Vendu' : a.statut === 'reserve' ? '🟡 Réservé' : '🟢 Disponible'}</span>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn-action report" onclick="signalerAnnonce(${a.id})">⚠️ Signaler</button>
            <button class="btn-action chat" onclick="ouvrirDetailsAnnonceOccasion(${a.id})">🔎 Détails</button>
            <button class="btn-action call" onclick="window.location.href='tel:${a.telephone || ''}'">📞 Appeler</button>
          </div>
        </div>
      </div>
    `;
  });
}

function filtrerAnnoncesParBoutiqueProprietaire(ownerId, nupName) {
  let filtered = toutesLesAnnonces.filter(a => a.user_id == ownerId && a.is_vip === true);
  document.getElementById("feed-current-title").textContent = `Vitrine VIP de ${nupName}`;
  document.getElementById("btn-clear-search").style.display = "block";
  rendreFluxHtml(filtered);
}

async function ouvrirMessagerieDirecteInstantane(annonceId, titreAnnonce) {
  if (!localStorage.getItem("nia_user_id")) return ouvrirSecuriseAuth(false);
  const text = prompt(`Votre message pour : "${titreAnnonce}"`);
  if (!text || !text.trim()) return;

  await fetch(`${API}/chat/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ annonce_id: annonceId, expediteur_id: localStorage.getItem("nia_user_id"), contenu: text, provenance_contexte: 'normal' })
  });
  alert("Message transmis avec succès !");
}

async function chargerConversationsPrivees() {
  const uid = localStorage.getItem("nia_user_id");
  if (!uid) return;
  const res = await fetch(`${API}/chat/conversations/${uid}`);
  const data = await res.json();
  const box = document.getElementById("chat-conversations-list");
  if (!box) return;
  if (data.length === 0) {
    box.innerHTML = "<p style='color:gray; font-size:0.8rem; margin:0;'>Aucun message.</p>";
    return;
  }

  box.innerHTML = data.map(c => {
    const estAdmin = c.expediteur_nup === "NUP-ADMIN";
    const estBroadcast = c.provenance_contexte === "broadcast";

    return `
      <div style="background:${estAdmin ? '#fef2f2' : 'white'}; padding:10px; border-radius:8px; border:1px solid ${estAdmin ? 'var(--danger)' : 'var(--border)'}; font-size:0.85rem; display:flex; flex-direction:column; gap:6px;">
        <div style="font-weight:700; color:${estAdmin ? 'var(--danger)' : 'var(--primary)'};">
          ${estBroadcast ? '📢 ALERTE GÉNÉRALE INFO (Réponse impossible)' : estAdmin ? '🚨 MODÉRATION ADMINISTRATIVE' : `Sujet : ${c.annonce_titre || 'Général'}`}
        </div>
        <div style="color:var(--text-light); font-size:0.75rem;">De : ${c.expediteur_nup} ➔ À : ${c.destinataire_nup}</div>
        <div style="background:#f1f5f9; padding:8px; border-radius:6px; font-style:italic; margin-top:4px; color:var(--text)">"${c.contenu}"</div>
        ${c.reponse_utilisateur ? `<div style="color:var(--success); font-weight:700; margin-top:4px;">✓ Justification : "${c.reponse_utilisateur}"</div>` : estAdmin && !estBroadcast ? `<div style="margin-top:6px; display:flex; gap:6px;"><input id="justif-reply-to-${c.id}" placeholder="Entrez votre explication..." style="flex:1; padding:8px; border-radius:8px; border:1px solid var(--border); color:black;"><button class="btn-auth sec" onclick="soumettreJustificationVersAdmin(${c.id})">Envoyer</button></div>` : ""}
      </div>
    `;
  }).join("");
}

async function soumettreJustificationVersAdmin(msgId) {
  const text = document.getElementById(`justif-reply-to-${msgId}`).value.trim();
  if (!text) return;
  await fetch(`${API}/chat/reply-justification/${msgId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reponse: text })
  });
  alert("Justification envoyée !");
  chargerConversationsPrivees();
}

async function signalerAnnonce(id) {
  const raison = prompt("Indiquez le motif de l'alerte :");
  if (!raison) return;
  await fetch(`${API}/annonces/${id}/signaler`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ raison })
  });
  alert("Signalement enregistré.");
}

function inviterAmisWhatsApp() {
  const message = encodeURIComponent(`🌟 Découvre NIA RDC, la meilleure plateforme de services et d'annonces à Lubumbashi !\nTrouve facilement ce dont tu as besoin.\n👉 ${API}`);
  window.open(`https://wa.me/?text=${message}`, "_blank");
}

function basculerOngletProfil(mode) {
  ONGLET_PROFIL_ACTIF = mode;
  const stdBtn = document.getElementById("btn-tab-std");
  const vipBtn = document.getElementById("btn-tab-vip");
  const occasionBtn = document.getElementById("btn-tab-occasion");
  if (stdBtn) stdBtn.className = mode === "standard" ? "btn-auth" : "btn-auth sec";
  if (vipBtn) vipBtn.className = mode === "vip" ? "btn-auth" : "btn-auth sec";
  if (occasionBtn) occasionBtn.className = mode === "occasion" ? "btn-auth" : "btn-auth sec";

  const currentUserId = localStorage.getItem("nia_user_id");
  const listDiv = document.getElementById("profil-annonces-list");
  if (!listDiv) return;
  listDiv.innerHTML = "";

  let userList = [];
  if (mode === "occasion") {
    userList = toutesLesAnnoncesOccasion.filter(a => a.user_id == currentUserId);
  } else {
    userList = toutesLesAnnonces.filter(a => a.user_id == currentUserId && a.is_vip === (mode === "vip"));
  }

  if (userList.length === 0) {
    listDiv.innerHTML = "<p style='color:gray; text-align:center; font-size:0.85rem;'>Aucune annonce.</p>";
    return;
  }

  if (mode === "occasion") {
    listDiv.innerHTML = userList.map(a => `
      <div style="background:#f8fafc; padding:14px; border-radius:10px; border:1px solid var(--border); margin-bottom:8px;">
        <div style="font-weight:600; font-size:0.85rem; margin-bottom:8px;">${echapperHtml(a.titre)} <span style="color:var(--primary); font-weight:700;">(${Number(a.prix || 0)} ${echapperHtml(a.devise || '$')})</span></div>
        <div style="display:flex; gap:8px; flex-wrap:wrap; margin-bottom:8px;">
          <select id="status-occasion-${a.id}" style="flex:1; min-width:120px;">
            <option value="disponible" ${a.statut === 'disponible' ? 'selected' : ''}>Disponible</option>
            <option value="reserve" ${a.statut === 'reserve' ? 'selected' : ''}>Réservé</option>
            <option value="vendu" ${a.statut === 'vendu' ? 'selected' : ''}>Vendu</option>
          </select>
          <button class="btn-auth sec" style="width:auto; font-size:0.75rem; padding:8px 10px;" onclick="changerDisponibiliteOccasion(${a.id})">OK</button>
        </div>
        <div style="display:flex; gap:4px; flex-wrap:wrap;">
          <button class="btn-auth sec" style="width:auto; font-size:0.75rem; padding:6px 10px;" onclick="ouvrirFenetreModificationAnnonceOccasion(${JSON.stringify(a).replace(/"/g, '&quot;')})">✏️ Modifier</button>
          <button class="btn-auth" style="background:var(--danger); width:auto; font-size:0.75rem; padding:6px 10px;" onclick="supprimerAnnonceOccasion(${a.id})">🗑️ Supprimer</button>
        </div>
      </div>
    `).join("");
    return;
  }

  listDiv.innerHTML = userList.map(a => `
    <div style="background:#f8fafc; padding:14px; border-radius:10px; border:1px solid var(--border); margin-bottom:8px; display:flex; justify-content:space-between; align-items:center;">
      <div style="font-weight:600; font-size:0.85rem;">${echapperHtml(a.titre)} <span style="color:var(--primary); font-weight:700;">(${Number(a.prix || 0)} ${echapperHtml(a.devise || '$')})</span></div>
      <div style="display:flex; gap:4px;">
        <button class="btn-auth" style="background:#f59e0b; font-size:0.75rem; padding:6px 10px; width:auto;" onclick="executerProcessusInterstitielBoost(${a.id})">🚀 Booster</button>
        <button class="btn-auth sec" style="font-size:0.75rem; padding:6px 10px; width:auto;" onclick='ouvrirFenetreModificationAnnonce(${JSON.stringify(a).replace(/"/g, '&quot;')})'>✏️ Éditer</button>
        <button class="btn-auth" style="background:var(--danger); font-size:0.75rem; padding:6px 10px; width:auto;" onclick="supprimerAnnonceProfil(${a.id})">🗑️</button>
      </div>
    </div>
  `).join("");
}

function executerProcessusInterstitielBoost(id) {
  const m = document.getElementById("modal-adsense-interstitiel");
  if (m) m.style.display = "flex";
  setTimeout(async () => {
    if (m) m.style.display = "none";
    await fetch(`${API}/annonces/${id}/boost`, { method: "POST" });
    alert("Annonce boostée !");
    fermerModal("profil");
    chargerFluxPrincipal();
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
  document.getElementById("edit-new-photos").value = "";
  ouvrirModal("modifier");
}

function ouvrirFenetreModificationAnnonceOccasion(a) {
  document.getElementById("occasion-edit-id").value = a.id;
  document.getElementById("occasion-edit-titre").value = a.titre || "";
  document.getElementById("occasion-edit-prix").value = a.prix || 0;
  document.getElementById("occasion-edit-devise").value = a.devise || '$';
  document.getElementById("occasion-edit-etat").value = a.etat_objet || 'Bon état';
  document.getElementById("occasion-edit-disponibilite").value = a.statut || 'disponible';
  document.getElementById("occasion-edit-telephone").value = a.telephone || "";
  document.getElementById("occasion-edit-description").value = a.description || "";
  document.getElementById("occasion-edit-ville").value = a.ville || "";
  document.getElementById("occasion-edit-commune").value = a.commune || "";
  document.getElementById("occasion-edit-quartier").value = a.quartier || "";
  document.getElementById("occasion-edit-avenue").value = a.avenue || "";
  document.getElementById("occasion-edit-numero-parcelle").value = a.numero_parcelle || "";
  document.getElementById("occasion-edit-new-photos").value = "";
  ouvrirModal("modifier-occasion");
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
      <img src="${img.url}" data-lightbox="${img.url}" onclick="ouvrirLightbox(this.dataset.lightbox)" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #e2e8f0;" />
      <button onclick="supprimerPhotoEdit(${img.id})" aria-label="Supprimer la photo" style="position:absolute; top:-6px; right:-6px; width:22px; height:22px; border-radius:50%; background:#ef4444; color:white; border:none; cursor:pointer;">×</button>
    </div>
  `).join("");
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
  } catch (e) {
    alert("Erreur lors de la suppression de la photo.");
  }
}

function ouvrirLightbox(url) {
  const imgEl = document.getElementById("lightbox-img");
  if (imgEl) imgEl.src = url;
  const modal = document.getElementById("modal-lightbox");
  if (modal) modal.style.display = "flex";
}

async function sauvegarderChangementsAnnonce() {
  const id = document.getElementById("edit-id").value;
  const titre = document.getElementById("edit-titre").value;
  const description = document.getElementById("edit-description").value;

  const erreurContenu = verifierContenuInterdits(titre, description);
  if (erreurContenu) return alert("⛔ " + erreurContenu);

  const newFiles = document.getElementById("edit-new-photos").files;
  let nouvelles_images_base64 = [];
  for (let i = 0; i < newFiles.length; i++) nouvelles_images_base64.push(await traiterFichierEnBase64(newFiles[i]));

  const res = await fetch(`${API}/annonces/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titre,
      prix: document.getElementById("edit-prix").value,
      devise: document.getElementById("edit-devise").value,
      periode: document.getElementById("edit-periode").value,
      statut: document.getElementById("edit-statut").value,
      telephone: document.getElementById("edit-telephone").value,
      description,
      ville: "Lubumbashi",
      nouvelles_images_base64
    })
  });

  fermerModal("modifier");
  fermerModal("profil");
  chargerFluxPrincipal();
}

async function sauvegarderChangementsAnnonceOccasion() {
  const id = document.getElementById("occasion-edit-id").value;
  const titre = document.getElementById("occasion-edit-titre").value.trim();
  const description = document.getElementById("occasion-edit-description").value.trim();
  const erreurContenu = verifierContenuInterdits(titre, description);
  if (erreurContenu) return alert("⛔ " + erreurContenu);

  const files = document.getElementById("occasion-edit-new-photos").files;
  let nouvelles_images_base64 = [];
  for (let i = 0; i < files.length; i++) nouvelles_images_base64.push(await traiterFichierEnBase64(files[i]));

  const res = await fetch(`${API}/marketplace/annonces/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titre,
      prix: Number(document.getElementById("occasion-edit-prix").value || 0),
      devise: document.getElementById("occasion-edit-devise").value,
      etat_objet: document.getElementById("occasion-edit-etat").value,
      statut: document.getElementById("occasion-edit-disponibilite").value,
      telephone: document.getElementById("occasion-edit-telephone").value,
      description,
      ville: document.getElementById("occasion-edit-ville").value,
      commune: document.getElementById("occasion-edit-commune").value,
      quartier: document.getElementById("occasion-edit-quartier").value,
      avenue: document.getElementById("occasion-edit-avenue").value,
      numero_parcelle: document.getElementById("occasion-edit-numero-parcelle").value,
      nouvelles_images_base64
    })
  });

  const data = await res.json();
  if (!data.success) return alert(data.error || "Erreur de modification.");
  fermerModal("modifier-occasion");
  fermerModal("profil");
  chargerFluxOccasion();
}

async function supprimerAnnonceProfil(id) {
  if (confirm("Confirmer la suppression complète ?")) {
    await fetch(`${API}/annonces/${id}/delete`, { method: "DELETE" });
    fermerModal("profil");
    chargerFluxPrincipal();
  }
}

async function supprimerAnnonceOccasion(id) {
  if (confirm("Supprimer cette annonce d'occasion ?")) {
    const res = await fetch(`${API}/marketplace/annonces/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) {
      fermerModal("profil");
      chargerFluxOccasion();
    }
  }
}

async function changerDisponibiliteOccasion(id) {
  const select = document.getElementById(`status-occasion-${id}`);
  const status = select ? select.value : 'disponible';
  await fetch(`${API}/marketplace/annonces/${id}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ statut: status })
  });
  alert("Disponibilité mise à jour.");
  chargerFluxOccasion();
}

async function ouvrirDetailsAnnonceOccasion(id) {
  const annonce = toutesLesAnnoncesOccasion.find(a => a.id == id);
  if (!annonce) return;

  const content = document.getElementById("occasion-detail-content");
  const images = Array.isArray(annonce.images) ? annonce.images : [];
  const imageMarkup = images.length > 0 ? images.map(img => `<img src="${img.url}" alt="${echapperHtml(annonce.titre || '')}" style="width:100%; max-height:220px; object-fit:cover; border-radius:10px;" />`).join("") : "<p style='color:gray;'>Aucune image.</p>";
  const adresse = [annonce.ville, annonce.commune, annonce.quartier, annonce.avenue, annonce.numero_parcelle].filter(Boolean).join(" • ");

  content.innerHTML = `
    <div class="market-detail">
      <h3 style="margin:0 0 12px;">${echapperHtml(annonce.titre || "")}</h3>
      <div class="price-tag">${Number(annonce.prix || 0)} ${echapperHtml(annonce.devise || '$')}</div>
      <div class="market-meta">État : ${echapperHtml(annonce.etat_objet || "Bon état")}</div>
      <div class="market-meta">Disponibilité : ${echapperHtml(annonce.statut || "Disponible")}</div>
      <div class="market-meta">Contact : ${echapperHtml(annonce.telephone || "")}</div>
      <div class="market-meta">Adresse : ${echapperHtml(adresse || "Non précisée")}</div>
      <div class="annonce-description" style="margin-top:12px;">${echapperHtml(annonce.description || "Aucune description.")}</div>
      <div class="gallery" style="display:grid; grid-template-columns:repeat(auto-fit, minmax(120px, 1fr)); gap:10px; margin-top:12px;">${imageMarkup}</div>
    </div>
  `;

  ouvrirModal("occasion-detail");
}

function rafraichirVueVipFormulaire() {
  const s = document.getElementById("vip-setup-zone");
  if (!s) return;
  s.innerHTML = `
    <div id="vip-multi-blocks" style="display:flex; flex-direction:column; gap:14px;"></div>
    <div style="display:flex; flex-direction:column; gap:8px; margin-top:14px; border-top:1px solid #fde68a; padding-top:14px;">
      <button class="btn-auth sec" style="width:100%;" onclick="ajouterBlocObjetAuCatalogueVip()">➕ Ajouter un logement</button>
      <button class="btn-auth" style="width:100%; background:linear-gradient(135deg,#f59e0b,#ec4899); font-size:1rem; padding:14px; letter-spacing:0.5px;" onclick="sauvegarderEtPublierToutLeCatalogueVip()">Publier le catalogue</button>
    </div>`;
  BLOCS_VIP_COMPTEUR = 0;
  ajouterBlocObjetAuCatalogueVip();
}

function ajouterBlocObjetAuCatalogueVip() {
  BLOCS_VIP_COMPTEUR++;
  const container = document.getElementById("vip-multi-blocks");
  if (!container) return;
  const row = document.createElement("div");
  row.className = "vip-pure-block";
  row.id = `vip-b-${BLOCS_VIP_COMPTEUR}`;
  row.style = "background:#fffdf5; border:2px solid #f59e0b; padding:14px; border-radius:12px; display:flex; flex-direction:column; gap:8px;";
  row.innerHTML = `
    <div style="font-weight:800; font-size:0.85rem; color:#f59e0b; border-bottom:1px solid #fde68a; padding-bottom:6px; margin-bottom:2px;">🏠 Logement VIP #${BLOCS_VIP_COMPTEUR}</div>
    <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Titre *</label><input class="vip-in-titre" placeholder="Ex : Studio lumineux près du centre"></div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Prix</label><input class="vip-in-prix" type="number" placeholder="150"></div>
      <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Période</label><select class="vip-in-periode"><option value="jour">/ Jour</option><option value="semaine">/ Semaine</option><option value="mois">/ Mois</option></select></div>
    </div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:8px;">
      <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Ville</label><input class="vip-in-ville" value="Lubumbashi"></div>
      <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Commune</label><input class="vip-in-commune" placeholder="Ex: Kenya"></div>
    </div>
    <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Disponibilité</label><select class="vip-in-statut"><option value="disponible">🟢 Disponible</option><option value="occupe">🔴 Occupé</option></select></div>
    <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">Description</label><textarea class="vip-in-desc" rows="2" placeholder="Décrire le logement..."></textarea></div>
    <div class="form-box" style="display:flex; flex-direction:column; gap:4px;"><label style="font-size:0.78rem; font-weight:600; color:#64748b;">📷 Photos du bien (Max 5)</label><input type="file" class="vip-in-photos" multiple accept="image/*"></div>
  `;
  container.appendChild(row);
}

async function sauvegarderEtPublierToutLeCatalogueVip() {
  const nodes = document.querySelectorAll(".vip-pure-block");
  for (let n of nodes) {
    const titre = n.querySelector(".vip-in-titre").value.trim();
    if (!titre) continue;

    const descVal = n.querySelector(".vip-in-desc").value;
    const erreurContenu = verifierContenuInterdits(titre, descVal);
    if (erreurContenu) { alert("⛔ " + erreurContenu); return; }

    const photoFiles = n.querySelector(".vip-in-photos").files;
    let images_base64 = [];
    for (let i = 0; i < photoFiles.length; i++) images_base64.push(await traiterFichierEnBase64(photoFiles[i]));

    const res = await fetch(`${API}/annonces`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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

  fermerModal("vip");
  chargerFluxPrincipal();
}

async function envoyerMessageGlobalBroadcast() {
  const msg = document.getElementById("admin-broadcast-text").value.trim();
  if (!msg) return alert("Veuillez saisir un message.");

  const res = await fetch(`${API}/admin/broadcast`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contenu: msg })
  });
  const data = await res.json();
  if (data.success) {
    alert("Message collectif envoyé à tous les utilisateurs !");
    document.getElementById("admin-broadcast-text").value = "";
  }
}

function appliquerFiltresAdmin() {
  definirVueAdmin(VUE_ADMIN_ACTIVE);
}

async function definirVueAdmin(mode) {
  VUE_ADMIN_ACTIVE = mode;
  const box = document.getElementById("admin-main-render-box");
  if (!box) return;
  box.innerHTML = "Chargement...";

  const fVille = document.getElementById("admin-filter-ville").value.toLowerCase().trim();
  const fType = document.getElementById("admin-filter-type").value;

  let listeFiltree = toutesLesAnnonces.filter(a => {
    if (fVille && (!a.ville || !a.ville.toLowerCase().includes(fVille))) return false;
    if (fType === "standard" && a.is_vip) return false;
    if (fType === "vip" && !a.is_vip) return false;
    return true;
  });

  if (mode === "flux") {
    box.innerHTML = listeFiltree.map(a => `
      <div style="background:#1e293b; padding:10px; border-radius:8px; font-size:0.8rem; display:flex; flex-direction:column; gap:6px;">
        <div><span style="color:#38bdf8; font-weight:700;">[${a.proprietaire_nup || 'SANS NUP'}]</span> <b>${echapperHtml(a.titre || '')}</b> (${a.is_vip ? '👑 VIP' : '📜 Stand.'}) à <i>${echapperHtml(a.ville || '')}</i></div>
        <div style="display:flex; gap:6px;">
          <input id="adm-input-${a.id}" placeholder="Message de modération..." style="flex:1; color:black; border-radius:6px; padding:6px; border:none; font-size:0.8rem;">
          <button onclick="envoyerMessageDepuisAdminAuNup(${a.id}, 'signale')" style="background:var(--success); color:white; border:none; border-radius:6px; padding:0 10px; font-weight:600;">Envoyer</button>
          <button onclick="supprimerAnnonceParAdmin(${a.id})" style="background:var(--danger); color:white; border:none; border-radius:6px; padding:0 8px;">🗑️</button>
        </div>
      </div>
    `).join("");
  } else if (mode === "signaux") {
    const res = await fetch(`${API}/admin/reports`);
    const data = await res.json();
    if (data.length === 0) { box.innerHTML = "<p style='color:gray; font-size:0.8rem;'>Aucun signalement.</p>"; return; }
    box.innerHTML = data.map(r => `
      <div style="background:#1e293b; padding:10px; border-radius:8px; border-left:4px solid var(--danger); font-size:0.8rem; display:flex; flex-direction:column; gap:6px;">
        <div style="color:#f87171; font-weight:700;">⚠️ MOTIF : "${r.raison}"</div>
        <div style="color:#cbd5e1;">Cible : ${echapperHtml(r.titre)} | Propriétaire : <b>${r.proprietaire_nup || 'Inconnu'}</b></div>
        <div style="display:flex; gap:6px;">
          <input id="adm-input-${r.id}" placeholder="Explication requise..." style="flex:1; color:black; border-radius:6px; padding:6px; border:none; font-size:0.8rem;">
          <button onclick="envoyerMessageDepuisAdminAuNup(${r.id}, 'signale')" style="background:#f59e0b; color:white; border:none; border-radius:6px; padding:0 10px; font-weight:600;">Exiger Justification</button>
        </div>
      </div>
    `).join("");
  } else if (mode === "justifications") {
    const res = await fetch(`${API}/admin/all-justifications/signale`);
    const data = await res.json();
    if (data.length === 0) { box.innerHTML = "<p style='color:gray; font-size:0.8rem;'>Aucune justification disponible.</p>"; return; }
    box.innerHTML = data.map(m => `
      <div style="background:#1e293b; padding:10px; border-radius:8px; font-size:0.8rem; display:flex; flex-direction:column; gap:4px;">
        <div style="color:#94a3b8;"><b>Alerte envoyée :</b> ${echapperHtml(m.contenu)}</div>
        <div style="color:#34d399; font-weight:700;"><b>↩️ Réponse du profil [${m.user_nup}] :</b> "${echapperHtml(m.reponse_utilisateur)}"</div>
      </div>
    `).join("");
  } else if (mode === "messages") {
    const res = await fetch(`${API}/admin/messages`);
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) { box.innerHTML = "<p style='color:gray; font-size:0.8rem;'>Aucun message.</p>"; return; }
    box.innerHTML = data.map(m => `
      <div style="background:#1e293b; padding:10px; border-radius:8px; font-size:0.8rem; display:flex; flex-direction:column; gap:4px; border-left:3px solid #6366f1;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:4px;">
          <div style="color:#a5b4fc; font-weight:700;">${echapperHtml(m.expediteur_nup)} ➔ ${echapperHtml(m.destinataire_nup)}</div>
          <div style="color:#64748b; font-size:0.72rem;">${new Date(m.created_at).toLocaleString('fr-FR')}</div>
        </div>
        ${m.annonce_titre ? `<div style="color:#94a3b8; font-size:0.75rem;">📋 ${echapperHtml(m.annonce_titre)}</div>` : ""}
        <div style="background:#0f172a; padding:8px; border-radius:6px; color:#e2e8f0; font-style:italic;">"${echapperHtml(m.contenu)}"</div>
        ${m.reponse_utilisateur ? `<div style="color:#34d399; font-size:0.75rem;">↩️ Réponse : "${echapperHtml(m.reponse_utilisateur)}"</div>` : ""}
        <button onclick="supprimerMessageParAdmin(${m.id})" style="align-self:flex-end; background:var(--danger); color:white; border:none; border-radius:6px; padding:4px 12px; font-size:0.75rem; margin-top:4px; cursor:pointer;">Supprimer</button>
      </div>
    `).join("");
  }
}

async function envoyerMessageDepuisAdminAuNup(annonceId, ctx) {
  const msg = document.getElementById(`adm-input-${annonceId}`).value.trim();
  if (!msg) return;
  await fetch(`${API}/admin/send-to-nup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ annonce_id: annonceId, contenu: msg, provenance_contexte: ctx })
  });
  alert("Message envoyé !");
  document.getElementById(`adm-input-${annonceId}`).value = "";
  definirVueAdmin(VUE_ADMIN_ACTIVE);
}

async function supprimerAnnonceParAdmin(id) {
  if (confirm("Retirer cette annonce du serveur ?")) {
    await fetch(`${API}/annonces/${id}/delete`, { method: "DELETE" });
    chargerFluxPrincipal();
    setTimeout(() => definirVueAdmin(VUE_ADMIN_ACTIVE), 400);
  }
}

async function supprimerMessageParAdmin(id) {
  if (confirm("Supprimer ce message définitivement ? Il disparaîtra pour tous les utilisateurs.")) {
    const res = await fetch(`${API}/admin/messages/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (data.success) definirVueAdmin("messages");
    else alert("Erreur lors de la suppression du message.");
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
    let matchKw = kw === "" || (a.titre || "").toLowerCase().includes(kw);
    let matchVille = v === "" || ((a.ville || "").toLowerCase().includes(v));
    return matchKw && matchVille;
  });
  document.getElementById("feed-current-title").textContent = "Résultats du filtrage";
  document.getElementById("btn-clear-search").style.display = "block";
  rendreFluxHtml(matches);
  fermerModal("rechercher");
}

function executerRechercheOccasion() {
  const kw = document.getElementById("market-search-keyword").value.toLowerCase();
  const ville = document.getElementById("market-search-ville").value.toLowerCase();
  const commune = document.getElementById("market-search-commune").value.toLowerCase();
  const etat = document.getElementById("market-search-etat").value;
  const statut = document.getElementById("market-search-statut").value;

  const matches = toutesLesAnnoncesOccasion.filter(a => {
    const txt = `${a.titre || ""} ${a.description || ""} ${a.ville || ""} ${a.commune || ""} ${a.quartier || ""} ${a.avenue || ""}`.toLowerCase();
    const matchKw = !kw || txt.includes(kw);
    const matchVille = !ville || (a.ville || "").toLowerCase().includes(ville);
    const matchCommune = !commune || (a.commune || "").toLowerCase().includes(commune);
    const matchEtat = !etat || (a.etat_objet || "") === etat;
    const matchStatut = !statut || (a.statut || "disponible") === statut;
    return matchKw && matchVille && matchCommune && matchEtat && matchStatut;
  });

  document.getElementById("feed-current-title").textContent = "Résultats Marché d'occasion";
  document.getElementById("btn-clear-search").style.display = "block";
  rendreFluxOccasionHtml(matches);
  fermerModal("rechercher");
}

function reinitialiserFluxGeneral() {
  document.getElementById("feed-current-title").textContent = currentUniverse === "occasion" ? "Marché d'occasion" : "Annonces récentes";
  document.getElementById("btn-clear-search").style.display = "none";
  if (currentUniverse === "occasion") rendreFluxOccasionHtml(toutesLesAnnoncesOccasion);
  else rendreFluxHtml(toutesLesAnnonces);
}

setInterval(() => {
  chargerFluxPrincipal();
  chargerFluxOccasion();
}, 20000);

document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("nia_user_id") && !localStorage.getItem("nia_universe")) {
    ouvrirChoixUnivers();
  } else {
    setCurrentUniverseFromPreference();
  }
  renderUniverseNavigation();
  rafraichirHeaderVisuel();
  chargerFluxPrincipal();
  chargerFluxOccasion();
  if (currentUniverse === "occasion") {
    document.getElementById("feed-current-title").textContent = "Marché d'occasion";
  }
});

window.addEventListener("click", (event) => {
  const menu = document.getElementById("legal-dropdown");
  if (menu && menu.style.display === "block" && !event.target.closest(".btn-burger") && !event.target.closest("#legal-dropdown")) {
    menu.style.display = "none";
  }
});

window.ouvrirChoixUnivers = ouvrirChoixUnivers;
window.switchUniverse = switchUniverse;
window.ouvrirDetailsAnnonceOccasion = ouvrirDetailsAnnonceOccasion;
window.soumettreAnnonceOccasion = soumettreAnnonceOccasion;
window.executerRechercheOccasion = executerRechercheOccasion;
window.changerDisponibiliteOccasion = changerDisponibiliteOccasion;
window.supprimerAnnonceOccasion = supprimerAnnonceOccasion;
window.ouvrirFenetreModificationAnnonceOccasion = ouvrirFenetreModificationAnnonceOccasion;
window.sauvegarderChangementsAnnonceOccasion = sauvegarderChangementsAnnonceOccasion;
window.setCurrentUniverseFromPreference = setCurrentUniverseFromPreference;










































































