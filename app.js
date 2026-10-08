(function () {
  "use strict";
  var main = document.getElementById("contenu");

  function el(tag, text, cls) {
    var e = document.createElement(tag);
    if (text) e.textContent = text;
    if (cls) e.className = cls;
    return e;
  }

  function afficher(d) {
    var titre = d.titre ? String(d.titre) : "";
    if (titre) {
      document.getElementById("titre").textContent = titre;
      document.title = titre;
    }
    document.getElementById("sous-titre").textContent = d.sous_titre ? String(d.sous_titre) : "";
    document.getElementById("maj").textContent = d.maj ? "Dernière mise à jour : " + d.maj : "";
    main.textContent = "";
    (d.sections || []).forEach(function (s) {
      var sec = el("section");
      sec.appendChild(el("h2", String(s.titre || "")));
      var items = s.items || [];
      if (!items.length) {
        sec.appendChild(el("p", "Aucune information pour le moment.", "vide"));
      } else {
        var ul = el("ul");
        items.forEach(function (i) {
          var li = el("li");
          li.appendChild(el("span", String(i.label || ""), "label"));
          if ("valeur" in i) {
            li.appendChild(el("span", i.valeur === "" || i.valeur === null ? "—" : String(i.valeur), "valeur"));
          }
          if (i.statut) {
            var b = el("span", String(i.statut), "badge");
            b.dataset.s = String(i.statut).toLowerCase();
            li.appendChild(b);
          }
          ul.appendChild(li);
        });
        sec.appendChild(ul);
      }
      main.appendChild(sec);
    });
  }

  fetch("data.json", { cache: "no-store" })
    .then(function (r) {
      if (!r.ok) throw new Error("introuvable");
      return r.json();
    })
    .then(afficher)
    .catch(function () {
      main.textContent = "";
      main.appendChild(el("p", "Impossible de lire data.json : vérifiez les virgules et les guillemets.", "erreur"));
    });
})();
