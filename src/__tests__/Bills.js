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

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      console.log(windowIcon);
      // const activeIcon = windowIcon.classList.contains("active-icon");
      //to-do write expect expression

      // Condition for pass the test
      // SB expect
      // L'assertion expect(activeIcon).toBeTruthy() est généralement utilisée pour vérifier que activeIcon existe et n'est pas une valeur "falsy". Cela signifie que activeIcon pourrait être n'importe quelle valeur qui n'est pas false, 0, "", null, undefined, ou NaN.
      // expect(activeIcon).toBeTruthy();
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