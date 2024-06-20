/**
 * @jest-environment jsdom
 */

import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"


describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      //to-do write assertion
    })
  })

  // SB
  describe("When I select an image in a correct format", () => {
    test("Then the input file should display the file name", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
    })
  
    })


})
