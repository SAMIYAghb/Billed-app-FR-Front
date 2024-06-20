/**
 * @jest-environment jsdom
 */

import {screen, waitFor} from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import { ROUTES_PATH} from "../constants/routes.js";
import {localStorageMock} from "../__mocks__/localStorage.js";

import router from "../app/Router.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
// Ces lignes créent un mock de localStorage pour le test et y stockent un objet utilisateur avec le type "Employee".
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      // Préparation du DOM: C'est souvent nécessaire pour simuler l'environnement dans lequel le code s'exécute.
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root);
      // Navigation vers la Page des Factures:
      // Ces lignes initialisent le routeur de l'application et naviguent vers la route des factures.
      router()
      window.onNavigate(ROUTES_PATH.Bills);
      // Attente de l'Icône de Facture:
      // La première ligne attend que l'élément avec l'attribut data-testid="icon-window" soit rendu dans le DOM. La deuxième ligne stocke cet élément dans la variable windowIcon.
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      console.log('Bills __test__');
      console.log(windowIcon);
      //to-do write expect expression

      // Condition for pass the test
      // SB expect
      // vérifier que l'élément windowIcon contient la classe active-icon, indiquant qu'il est mis en surbrillance.
      expect(windowIcon.classList.contains("active-icon")).toBe(true);
    })
    
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
    })

  })

  // describe("When I am on Bills Page and I click on the icon eye", () => {
  //   test("Then it should open the modal", () => {

  //   })
  // })

  // describe("When I click on 'Send a new bill' page", () => {
  //   test("Then I should be sent to 'New bill page'", () => {

  //   })
  // })

  


  
})
