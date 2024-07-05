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
import { expect, jest, test } from "@jest/globals";
import mockStore from "../__mocks__/store";
import userEvent from "@testing-library/user-event";

describe("Given I am connected as an employee", () => {
  // SB
  // // beforeEach: Configure l'environnement de test avant chaque test Il espionne l'objet store.bills, configure localStorage pour simuler un utilisateur connecté en tant qu'employé, et initialise l'interface utilisateur.
  let newBill;
  beforeEach(() => {
    // Initialisation de l'interface utilisateur (UI)
    let html = NewBillUI();
    // Ajout du HTML à la page de test
    document.body.innerHTML = html;
    // / Ces lignes créent un mock de localStorage pour le test et y stockent un objet utilisateur avec le type "Employee".
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
    // On initialise la classe NewBill avec les paramètres nécessaires.
    newBill = new NewBill({
      document,
      // Définition de la fonction de navigation
      onNavigate: jest.fn(),
      store,
      localStorage: window.localStorage,
    });
  });
  // SB test image format
  describe("When I select an image in a correct format", () => {
    test("Then the input file should display the file name", () => {
      // déclarer une constante nommée handleChangeFile
      // Créez un mock(simulée) pour handleChangeFile en utilisant jest.fn
      const handleChangeFile = jest.fn((e) => newBill.handleChangeFile(e));
      // On récupère l'élément input pour les fichiers via getByTestId.
      const input = screen.getByTestId("file");
      input.addEventListener("change", handleChangeFile);
      // **Simulation d'un événement de changement de fichier
      // L'objet passé à fireEvent.change contient une propriété target qui simule l'état de l'élément input après le changement.
      // files est une propriété de target qui contient une liste de fichiers sélectionnés par l'utilisateur.
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
      // Mock de la méthode handleSubmit
      // jest.fn(...) : Jest fournit une fonction mock (factice) pour surveiller les appels à handleSubmit.
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
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

});

// SB test d'intégration
// ajouter un test d'intégration POST new bill.
describe("Given I am connected as an employee", () => {
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
  });

  // afterEach: Restaure les mocks après chaque test pour éviter les interférences entre les tests.
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("When I add a new bill", () => {
    // Test de Création d'une Nouvelle Facture
    test("create a new bills POST", async () => {
      // Fonction de navigation simulée
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({
          pathname,
        });
      };
      // Simule la navigation vers la page de création de nouvelle facture
      window.onNavigate(ROUTES_PATH.NewBill);
      // 1-Configuration du Formulaire et de l'UI:
      // NewBill est initialisé avec les dépendances nécessaires.creer une instance
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });
      // Le formulaire est rendu dans le document.body.
      document.body.innerHTML = NewBillUI();
      // Sélection des éléments du formulaire par leurs identifiants de test
      const inputExpenseType = screen.getByTestId("expense-type");
      const inputExpenseName = screen.getByTestId("expense-name");
      const inputDatePicker = screen.getByTestId("datepicker");
      const inputAmount = screen.getByTestId("amount");
      const inputVAT = screen.getByTestId("vat");
      const inputPCT = screen.getByTestId("pct");
      const inputCommentary = screen.getByTestId("commentary");
      const inputFile = screen.getByTestId("file");
      // 2-Saisie des Données dans le Formulaire:
      // Création des Entrées du Formulaire: Le formulaire est initialisé et les champs de texte sont remplis avec les valeurs de test.donne moké
      userEvent.type(inputExpenseType, "Hôtel et logement");
      userEvent.type(inputExpenseName, "encore");
      userEvent.type(inputDatePicker, "2004-04-04");
      userEvent.type(inputAmount, "400");
      userEvent.type(inputVAT, "80");
      userEvent.type(inputPCT, "20");
      userEvent.type(inputCommentary, "séminaire billed");
      newBill.fileName = "testFile";
      newBill.fileUrl =
        "https://test.storage.tld/v0/b/billable-677b6.a…f-1.jpg?alt=media&token=c1640e12-a24b-4b11-ae52-529112e9602a";
      // 3-Mock de l'API:
      // Fonction mockée pour handleChangeFile
      const handleChangeFile = jest.fn(newBill.handleChangeFile);
      // Espionnage de la méthode handleSubmit de l'objet newBill
      const handleSubmit = jest.spyOn(newBill, "handleSubmit");
      // Sélection du formulaire par son identifiant
      const formNewBill = screen.getByTestId("form-new-bill");
      // mockStore.bills est mocké pour simuler les appels API.
      mockStore.bills.mockImplementation(() => {
        return {
          // La méthode create retourne une promesse résolue avec un objet contenant l'URL du fichier et une clé.Mock d'un service API
          create: () => {
            return Promise.resolve({
              fileUrl: `${newBill.fileUrl}`,
              key: "1234",
            });
          },
          update: () => {
            return Promise.resolve({
              id: "47qAXb6fIm2zOKkLzMro",
              vat: "80",
              fileUrl: `${newBill.fileUrl}`,
              status: "pending",
            });
          },
        };
      });
      // 4-Gestion des Événements:
      // handleChangeFile est mocké et attaché à l'événement change du fichier.
      inputFile.addEventListener("change", handleChangeFile);
      // handleSubmit est espionné et attaché à l'événement submit du formulaire.
      formNewBill.addEventListener("submit", handleSubmit);
      // Le fichier est téléchargé, et l'événement de soumission du formulaire est déclenché.
      // Simulation de l'upload d'un fichier
      const pngFile = new File(["image"], "is-an-image.png", {
        type: "image/png",
      });
      userEvent.upload(inputFile, pngFile);

      //  Simulation de la soumission du fichier: Le fichier est téléchargé et l'événement de changement de fichier est déclenché. //
      fireEvent.submit(formNewBill);
      // 5-Assertions:
      // Vérifie que handleChangeFile et handleSubmit sont appelés une fois.
      expect(handleChangeFile).toHaveBeenCalled();
      expect(handleChangeFile).toBeCalledTimes(1);
      // Vérifie que handleSubmit est appelé une fois.
      expect(handleSubmit).toHaveBeenCalled();
      expect(handleSubmit).toBeCalledTimes(1);
      // Vérifie que mockStore.bills est appelé une fois.
      expect(mockStore.bills).toHaveBeenCalled();
      expect(mockStore.bills).toHaveBeenCalledTimes(2);
      // Vérifie que l'interface utilisateur affiche "Mes notes de frais".
      expect(screen.getAllByText("Mes notes de frais")).toBeTruthy();
    });

    // Test pour vérifier la gestion des erreurs lorsque la récupération des factures échoue avec une erreur 500.
    test("fetches messages from an API and fails with 500 message error", async () => {
      // Empêche la méthode console.error d'afficher des erreurs dans la console pendant le test
      jest.spyOn(console, "error").mockImplementation(() => {});
      // Mock (simule) la méthode bills du store pour qu'elle renvoie une erreur 500 lors de la mise à jour
      mockStore.bills.mockImplementationOnce(() => {
        return {
          update: () => {
            // Simule une promesse rejetée avec une erreur 500
            return Promise.reject(new Error("Erreur 500"));
          },
        };
      });
      // Crée une nouvelle instance de NewBill en passant les paramètres nécessaires
      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage,
      });

      // Sélectionne le formulaire avec l'identifiant de test "form-new-bill"
      const form = screen.getByTestId("form-new-bill");
      // Crée une fonction mock pour handleSubmit et l'associe à l'événement submit du formulaire
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      form.addEventListener("submit", handleSubmit);
      // Simule la soumission du formulaire
      fireEvent.submit(form);
      // Attend que toutes les promesses en cours soient résolues
      await new Promise(process.nextTick);
      // Vérifie que console.error a été appelé, ce qui signifie qu'une erreur a été capturée
      expect(console.error).toBeCalled();
    });
  });
});

// La fonction describe permet de regrouper les tests liés à une fonctionnalité spécifique.

// jest.spyOn: Permet de surveiller les appels à une méthode spécifique.
// jest.fn: Crée une fonction mockée pour simuler le comportement de handleChangeFile.

// Un mock est une version simulée d'un objet, d'une fonction, ou d'un composant utilisé dans les tests pour imiter le comportement de ses homologues réels.

// Pourquoi utiliser des mocks ?
// Isolation : Permet de tester un composant sans dépendre des autres composants ou des services externes.
// Contrôle : Offre un contrôle complet sur les entrées et sorties des fonctions et objets simulés.
// Fiabilité : Évite les tests fragiles qui peuvent échouer en raison de problèmes avec des services externes ou d'autres parties non testées du code.
// Performance : Les tests utilisant des mocks sont souvent plus rapides car ils évitent les appels réseau, les accès aux bases de données, etc.

// Types de mocks
// Fonctions mockées : Fonctions simulées qui imitent le comportement de fonctions réelles.
// Objets mockés : Objets simulés avec des méthodes mockées pour imiter les objets réels.
// Services mockés : Simulations de services complets (comme des API ou des bases de données) pour éviter les dépendances externes.
