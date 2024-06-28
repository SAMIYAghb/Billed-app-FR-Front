/**
 * @jest-environment jsdom
 */

import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";

import router from "../app/Router.js";
import NewBillUI from "../views/NewBillUI.js";
import Bills from "../containers/Bills.js";
import store from "../__mocks__/store.js";
import mockStore from "../__mocks__/store";


describe("Given I am connected as an employee", () => {
  // beforeEach: Configure l'environnement de test avant chaque test Il espionne l'objet store.bills, configure localStorage pour simuler un utilisateur connecté en tant qu'employé, et initialise l'interface utilisateur.
  beforeEach(() => {
    jest.spyOn(store, "bills");
//  // Ces lignes créent un mock de localStorage pour le test et y stockent un objet utilisateur avec le type "Employee".
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

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
      // Ces lignes créent un mock de localStorage pour le test et y stockent un objet utilisateur avec le type "Employee".
      // Object.defineProperty(window, "localStorage", {
      //   value: localStorageMock,
      // });
      // window.localStorage.setItem(
      //   "user",
      //   JSON.stringify({
      //     type: "Employee",
      //   })
      // );
      // Préparation du DOM: C'est souvent nécessaire pour simuler l'environnement dans lequel le code s'exécute.
      // const root = document.createElement("div");
      // root.setAttribute("id", "root");
      // document.body.append(root);
      // Navigation vers la Page des Factures:
      // Ces lignes initialisent le routeur de l'application et naviguent vers la route des factures.
      // router();
      window.onNavigate(ROUTES_PATH.Bills);
      // Attente de l'Icône de Facture:
      // La première ligne attend que l'élément avec l'attribut data-testid="icon-window" soit rendu dans le DOM. La deuxième ligne stocke cet élément dans la variable windowIcon.
      await waitFor(() => screen.getByTestId("icon-window"));
      const windowIcon = screen.getByTestId("icon-window");
      // console.log('Bills __test__');
      // console.log(windowIcon);
      //to-do write expect expression

      // Condition for pass the test
      // SB expect
      // vérifier que l'élément windowIcon contient la classe active-icon, indiquant qu'il est mis en surbrillance.
      // expect(windowIcon.classList.contains("active-icon")).toBe(true);
      const activeIcon = windowIcon.classList.contains("active-icon");
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
  // handleClickNewBill = () => {
  //   this.onNavigate(ROUTES_PATH["NewBill"]);
  // }; ligne 25


  
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
    })
  })
});


// SB test d'intégration
// ajouter un test d'intégration GET Bills.
describe("Given I am a user connected as Employee", () => {
  describe("When I navigate to Bills page", () => {
    
    // beforeEach: Configure l'environnement de test avant chaque test Il espionne l'objet store.bills, configure localStorage pour simuler un utilisateur connecté en tant qu'employé, et initialise l'interface utilisateur.
    beforeEach(() => {
        jest.spyOn(store, "bills");

        Object.defineProperty(window, "localStorage", {
          value: localStorageMock,
        });

        window.localStorage.setItem(
          "user",
          JSON.stringify({
            type: "Employee",
            email: "a@a.fr",
          })
        );

        //
        const root = document.createElement("div");
        root.setAttribute("id", "root");
        document.body.appendChild(root);
        router();
        //
    });

    test("fetch bills GET", () => {
      const bills = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage,
      });
      bills.getBills().then((data) => {
        root.innerHTML = BillsUI({ data });
        expect(document.querySelector("tbody").rows.length).toBeGreaterThan(0);
      });
    });

    test("fetches bills from an API and fails with 404 message error", async () => {
      const html = BillsUI({ error: "Erreur 404" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Erreur 404/);
      expect(message).toBeTruthy();
    });

    test("fetches messages from an API and fails with 500 message error", async () => {
      const html = BillsUI({ error: "Erreur 500" });
      document.body.innerHTML = html;
      const message = screen.getByText(/Erreur 500/);
      expect(message).toBeTruthy();
    });

  });
});