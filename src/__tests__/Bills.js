/**
 * @jest-environment jsdom
 */

import { fireEvent, screen, waitFor } from "@testing-library/dom";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { bills } from "../fixtures/bills.js";
import BillsUI from "../views/BillsUI.js";

import mockStore from "../__mocks__/store";
import store from "../__mocks__/store.js";
import router from "../app/Router.js";
import Bills from "../containers/Bills.js";

describe("Given I am connected as an employee", () => {
  // beforeEach: Configure l'environnement de test avant chaque test Il espionne l'objet store.bills, configure localStorage pour simuler un utilisateur connecté en tant qu'employé, et initialise l'interface utilisateur.
  beforeEach(() => {
    // crée un espion sur la méthode bills de l'objet store.
    jest.spyOn(store, "bills");
    // Ces lignes créent un mock de localStorage pour le test et y stockent un objet utilisateur avec le type "Employee".
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });
// Simuler les données utilisateur dans localStorage
    window.localStorage.setItem(
      "user",
      JSON.stringify({
        type: "Employee",
        email: "a@a.fr",
      })
    );

    //
    // Préparation du DOM: C'est souvent nécessaire pour simuler l'environnement dans lequel le code s'exécute.
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.appendChild(root);
    // / Navigation vers la Page des Factures:
    // Ces lignes initialisent le routeur de l'application et naviguent vers la route des factures
    router();
    //
  });

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
     
      window.onNavigate(ROUTES_PATH.Bills);
      // Attente de l'Icône de Facture:
      // La première ligne attend que l'élément avec l'attribut data-testid="icon-window" soit rendu dans le DOM. La deuxième ligne stocke cet élément dans la variable windowIcon.
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      // console.log('Bills __test__');
      // console.log(windowIcon);
      // Condition for pass the test
      // SB expect
      // vérifier que l'élément windowIcon contient la classe active-icon, indiquant qu'il est mis en surbrillance.
      // Le résultat de cette vérification est stocké dans la variable activeIcon
      const activeIcon = windowIcon.classList.contains("active-icon");
      // oBeTruthy() vérifie si activeIcon est true, ce qui signifie que windowIcon possède bien la classe "active-icon"
      expect(activeIcon).toBeTruthy();
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
  });
  // SB
  //  icon.addEventListener("click", () => this.handleClickIconEye(icon)); ligne 18
  describe("When I am on Bills Page and I click on the icon eye", () => {
    test("Then it should open the modal", () => {
      // Créer Page Bills
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      // On initialise la classe Bill avec les paramètres nécessaires.
      const billsList = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      // Cette ligne de code remplace la méthode modal de jQuery par un mock créé par jest.fn(). Cela signifie que toutes les fois où votre code appelle $.fn.modal, elle n'appelle pas la vraie fonction de jQuery, mais plutôt le mock créé par Jest.
      // créer la modal
      $.fn.modal = jest.fn();
      const icon = screen.getAllByTestId("icon-eye")[0];

      const handleClickIconEye = jest.fn(() =>
        billsList.handleClickIconEye(icon)
      );
      icon.addEventListener("click", handleClickIconEye);
      // simule un click
      fireEvent.click(icon);
      // On vérifie que handleChangeFile a bien été appelée lors lors du click.
      expect(handleClickIconEye).toHaveBeenCalled();
      // On vérifie que la modal est ouverte
      const modale = document.getElementById("modaleFile");
      expect(modale).toBeTruthy();
    });
  });

  // SB
  describe("When I click on 'Send a new bill' page", () => {
    test("Then I should be sent to 'New bill page'", () => {
      window.onNavigate(ROUTES_PATH.Bills);
      const store = null;
      const billsList = new Bills({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });

      const newBill = jest.fn(() => billsList.handleClickNewBill);
      const navigationButton = screen.getByTestId("btn-new-bill");
      navigationButton.addEventListener("click", newBill);
      fireEvent.click(navigationButton);
      expect(screen.getAllByText("Envoyer une note de frais")).toBeTruthy();
    });
  });
});

// SB test d'intégration
// ajouter un test d'intégration GET Bills.
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    // beforeEach: Configure l'environnement de test avant chaque test Il espionne l'objet store.bills, configure localStorage pour simuler un utilisateur connecté en tant qu'employé, et initialise l'interface utilisateur.
    beforeEach(() => {
      // jest.spyOn permet de surveiller les appels à la méthode 'bills' du store.
      jest.spyOn(store, "bills");
      // On redéfinit localStorage pour utiliser une version simulée (mockée).
      Object.defineProperty(window, "localStorage", {
        value: localStorageMock,
      });
      // On configure localStorage pour simuler qu'un utilisateur de type "Employee" est connecté.
      window.localStorage.setItem(
        "user",
        JSON.stringify({
          type: "Employee",
          email: "a@a.fr",
        })
      );

      // On crée un élément div avec l'id "root" et on l'ajoute au body du document.
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      // On appelle une fonction router pour initialiser la navigation (déclarée ailleurs).
      router();
      //
    });
    // Test pour vérifier si la récupération des factures fonctionne correctement (GET request).
    test("fetch bills GET", () => {
      // On crée une instance de la classe Bills avec les paramètres nécessaires.
      const bills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage,
      });
      // On appelle la méthode getBills de l'instance bills et on vérifie que les données sont bien insérées dans le DOM.
      bills.getBills().then((data) => {
        root.innerHTML = BillsUI({ data });
        // On s'attend à ce que le tableau dans le DOM contienne au moins une ligne.
        expect(document.querySelector("tbody").rows.length).toBeGreaterThan(0);
      });
    });
    
    // Test pour vérifier la gestion des erreurs lorsque la récupération des factures échoue avec une erreur 404.
    test("fetches bills from an API and fails with 404 message error", async () => {
      // On génère le HTML pour afficher une erreur 404.
      const html = BillsUI({ error: "Erreur 404" });
      // On injecte le HTML généré dans le corps du document simulé.
      document.body.innerHTML = html;
      // On vérifie que le message d'erreur "Erreur 404" est bien présent dans le DOM.
      const message = screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });
    // Test pour vérifier la gestion des erreurs lorsque la récupération des factures échoue avec une erreur 500.
    test("fetches messages from an API and fails with 500 message error", async () => {
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });
  });
});


// L'erreur 404 signifie que le serveur n'a pas trouvé la ressource demandée. Cela indique que l'URL saisie ne correspond à aucune ressource disponible sur le serveur.
// L'erreur 500 indique un problème interne au serveur. Cela signifie qu'il y a une défaillance dans le serveur qui l'empêche de répondre correctement à la requête.