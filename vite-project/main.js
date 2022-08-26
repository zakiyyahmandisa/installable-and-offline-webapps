import "./style.css";
import { database } from "./database";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then((reg) => console.log("Service Worker: Registered"))
      .catch((err) => console.log(`Service Worker: Error: ${err}`));
  });
}
// import { registerSW } from "virtual:pwa-register";

// const updateSW = registerSW({
//   //notify the user that there was an error registering the service worker.
//   onRegisterError(error) {
//     console.log("There was an error:" + " " + error)
//   },
//   onNeedRefresh() {
    
//         //show a prompt to the user with refresh and cancel buttons inside onNeedRefresh method.
//     //When the user clicks the "refresh" button when onNeedRefresh called, then call updateSW() function; the page will reload and the up-to-date content will be served.
//   },
//   onOfflineReady() {
//     //show a ready to work offline message to the user with an OK button inside onOfflineReady method.
//     //In any case, when the user clicks the Cancel or OK buttons in case onNeedRefresh or onOfflineReady respectively, close the corresponding showed prompt
//   },
// });
class Store {
  constructor(init) {
    const self = this;
    this.subscribers = [];
    database.then(async (db) => {
      this.db = db;
      const check = await db.get("comment", "comment");
      if (check) {
        this.set("comment", check);
      }
    });

    this.state = new Proxy(init, {
      async set(state, key, value) {
        state[key] = value;
        if (self.db) {
          await self.db.put("comment", value[value.length - 1]);
        }

        self.subscribers.forEach((subscriber) => subscriber(state));
      },
    });
  }

  subscribed(cb) {
    if (typeof cb !== "function") {
      throw new Error("You must subscribe with a function");
    }
    this.subscribers.push(cb);
  }

  comment(state, val) {
    let newState = state.comments.push(val);
    this.state = Object.assign(this.state, state);
  }

  getComment() {
    return this.state.comments;
  }
}

const store = new Store({ comments: [] });

store.subscribed((state) => {
  let commentState = state.comments;
  commentState.forEach((stateComments) =>
    document.body.appendChild(stateComments)
  );
});

class Comment extends HTMLElement {
  constructor() {
    super();
    this.name = "";
    this.email = "";
    this.comment = "";
    this.date = Date.now();
  }

  static get observedAttributes() {
    return ["name", "email", "comment"];
  }

  // invoked when one of the custom element's attributes is added, removed, or changed
  attributeChangedCallback(attributeName, oldVal, newVal) {
    if (oldVal === newVal) {
      return;
    }
    // bracket b/c we dont know exactly what attributename is name, email, comment
    this[attributeName] = newVal;
  }

  // connects to hmtl template
  connectedCallback() {
    this.innerHTML = `
    <p>Name: ${this.name} </p>
   <p> Email: ${this.email}</p>
  <p>  Comment: ${this.comment}</p>
  <p> ${new Date(this.date)} <button type="button">Delete</button></p>
  <p>------------------------------------------------</p>
  
    `;
    console.log(this.name);
  }
}
window.customElements.define("comment-component", Comment);

const button = document
  .getElementById("button")
  .addEventListener("click", (e) => {
    e.preventDefault();
    // creating new comment each time(new instance of the component)
    const element = document.createElement("comment-component");

    let name = document.getElementById("name").value;
    console.log(name);
    let email = document.getElementById("email").value;
    let comment = document.getElementById("comment").value;
    let commentObject = {
      name: `${name}`,
      email: `${email}`,
      comment: `${comment}`,
    };
    element.setAttribute("name", commentObject.name);
    element.setAttribute("email", commentObject.email);
    element.setAttribute("comment", commentObject.comment);
    document.body.appendChild(element);
    store.comment(store.state, commentObject);
  });

// import { registerSW } from 'virtual:pwa-register'
// const refresh = document.getElementById("refresh");

// const updateSW = registerSW({
//   onNeedRefresh() {
//     Toastify({
//       text: `<h4 style='display: inline'>An update is available!</h4>
//              <br><br>
//              <a class='do-sw-update'>Click to update and reload</a>  `,
//       escapeMarkup: false,
//       gravity: "bottom",
//       onClick() {
//         updateSW(true);
//       }
//     }).showToast();
//   },
//   onOfflineReady() {},
// })
