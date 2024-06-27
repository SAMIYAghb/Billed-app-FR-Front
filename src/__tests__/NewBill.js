/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { screen, fireEvent, waitFor } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import store from "../__mocks__/store.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import {expect, jest, test} from '@jest/globals';


describe("Given I am connected as an employee", () => {
  // SB
  // la meme chose que le test dans test/Bills.js
  let newBill;
  beforeEach(()=>{
    const html = NewBillUI();
    document.body.innerHTML = html;

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

    const newBill = new NewBill({
      document,
      onNavigate: jest.fn(),
      store,
      localStorage: window.localStorage,
    });


  })
  describe("When I am on NewBill Page", () => {
    // test("Then bill icon in vertical layout should be highlighted", async () => {
    //   // const html = NewBillUI();
    //   // document.body.innerHTML = html;
    //   // //to-do write assertion
    //   // / Ces lignes créent un mock de localStorage pour le test et y stockent un objet utilisateur avec le type "Employee".
    //   Object.defineProperty(window, "localStorage", {
    //     value: localStorageMock,
    //   });
    //   window.localStorage.setItem(
    //     "user",
    //     JSON.stringify({
    //       type: "Employee",
    //       email: "a@a.fr",
    //     })
    //   );
    //   // Préparation du DOM: C'est souvent nécessaire pour simuler l'environnement dans lequel le code s'exécute.
    //   const root = document.createElement("div");
    //   root.setAttribute("id", "root");
    //   document.body.append(root);
    //   // Navigation vers la Page des Factures:
    //   // Ces lignes initialisent le routeur de l'application et naviguent vers la route des factures.
    //   router();
    //   window.onNavigate(ROUTES_PATH.NewBill);
    //   // Attente de l'Icône de Facture:
    //   // La première ligne attend que l'élément avec l'attribut data-testid="icon-window" soit rendu dans le DOM. La deuxième ligne stocke cet élément dans la variable windowIcon.
    //   // await waitFor(() => screen.getByTestId("icon-window"));
    //   // const windowIcon = screen.getByTestId("icon-window");
    //   // console.log('Bills __test__');
    //   // console.log(windowIcon);
    //   // Condition for pass the test
    //   // expect(windowIcon.classList.contains("active-icon")).toBe(true);
    // });
  });

  // SB test image format
  describe("When I select an image in a correct format", () => {
    test("Then the input file should display the file name", () => {
      // Initialisation de l'interface utilisateur (UI)
      // const html = NewBillUI();
      // Ajout du HTML à la page de test
      // document.body.innerHTML = html;
      // Définition de la fonction de navigation
      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname });
      // };
      // On initialise la classe NewBill avec les paramètres nécessaires.
      // const newBill = new NewBill({
      //   document,
      //   onNavigate,
      //   store,
      //   localStorage: window.localStorage,
      // });
      // handleChangeFile est un mock de la méthode
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      // On récupère l'élément input pour les fichiers via getByTestId.
      const input = screen.getByTestId("file");
      input.addEventListener("change", handleChangeFile);
      // Simulation d'un événement de changement de fichier
      fireEvent.change(input, {
        target: {
          files: [
            new File(["image.png"], "image.png", {
              type: "image/png",
            }),
          ],
        },
      });
      // On vérifie que handleChangeFile a bien été appelée lors du changement de fichier.
      expect(handleChangeFile).toHaveBeenCalled();
      // On vérifie que le nom du fichier dans l'input correspond bien à "image.png".
      expect(input.files[0].name).toBe("image.png");
    });

    test("Then a bill is created", () => {
      // Simuler les données utilisateur dans localStorage
      // localStorage.setItem("user", JSON.stringify({ email: "test@employee.com" }));

      // Initialisation de l'interface utilisateur (UI)
      const html = NewBillUI();
      // Ajout du HTML à la page de test
      document.body.innerHTML = html;
      // Définition de la fonction de navigation
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };
      // On initialise la classe NewBill avec les paramètres nécessaires.
      const newBill = new NewBill({
        document,
        onNavigate,
        store,
        localStorage: window.localStorage,
      });
      // Mock de la méthode handleSubmit
      // jest.fn(...) : Jest fournit une fonction mock (factice) pour surveiller les appels à handleSubmit.
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      // jest.fn(...) : Jest fournit une fonction mock (factice) pour surveiller les appels à handleSubmit.
      const submit = screen.getByTestId("form-new-bill");
      submit.addEventListener("submit", handleSubmit);
      // Simulation de la soumission du formulaire
      // fireEvent.submit(submit) : Cette méthode simule un événement de soumission du formulaire. C'est comme si un utilisateur cliquait sur le bouton de soumission du formulaire.
      fireEvent.submit(submit);
      // Assertions pour vérifier que handleSubmit a été appelée
      expect(handleSubmit).toHaveBeenCalled();
    });
  });

  describe("When I select an image in an incorrect extension ", () => {
    test("Then the bill form is not valid ", () => {
      // Initialisation de l'interface utilisateur (UI)
      // const html = NewBillUI();
      // Ajout du HTML à la page de test
      document.body.innerHTML = html;
      // Définition de la fonction de navigation
      // const onNavigate = (pathname) => {
      //   document.body.innerHTML = ROUTES({ pathname });
      // };
      // On initialise la classe NewBill avec les paramètres nécessaires.
      // const newBill = new NewBill({
      //   document,
      //   onNavigate,
      //   store,
      //   localStorage: window.localStorage,
      // });
      // handleChangeFile est un mock de la méthode
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      // On récupère l'élément input pour les fichiers via getByTestId.
      const input = screen.getByTestId("file");
      input.addEventListener("change", handleChangeFile);
      // Simulation d'un événement de changement de fichier
      fireEvent.change(input, {
        target: {
          files: [
            new File(["image.svg"], "image.svg", {
              type: "image/svg",
            }),
          ],
        },
      });
      // On vérifie que handleChangeFile a bien été appelée lors du changement de fichier.
      expect(handleChangeFile).toHaveBeenCalled();
      // On vérifie que le nom du fichier dans l'input correspond bien à "image.svg".
      expect(input.files[0].name).toBe("image.svg");
    });
  });

// SB
  // tester un bloc .catch dans une promesse avec un test unitaire

  // SB
  // ajouter un test d'intégration POST new bill. 
});
