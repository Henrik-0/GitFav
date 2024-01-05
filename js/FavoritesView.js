import { GithubApi } from "./GithubApi.js";

export class Favorites {
  constructor(page) {
    this.page = document.querySelector(page);
    this.load();
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem("@gitFav:" )) || [];
  }

  save() {
    localStorage.setItem("@gitFav:", JSON.stringify(this.entries));
  }

  async add(username) {
    try{
      const userExist = this.entries.find(entry => entry.login === username);

      if (userExist) {
        throw new Error("Usuário já adicionado!");
      };

      const user = await GithubApi.search(username);

      if(user.login === undefined) {
        throw new Error("Usuário não encontrado!");
      }

      this.entries = [user, ...this.entries] || [];
  
      this.save();
      this.update();
    }catch(error) {
      alert(error.message);
    };
  };

  delete(user) {
    const filteredEntries = this.entries.filter((entry) => entry.login !== user.login);
    this.entries = filteredEntries;
    this.save();
    this.update();
  }
};

export class FavoritesView extends Favorites{
  constructor(page) {
    super(page);
    this.tbody = this.page.querySelector("table tbody");
    this.update();
    this.onAdd();
  }
  update() {

    this.removeAllTr();

    this.entries.forEach((user) => {
      const row = this.createRowContent();

      row.querySelector(".imgLink").href = `https://github.com/${user.login}`;
      row.querySelector(".imgLink img").src = `https://github.com/${user.login}.png`;
      row.querySelector(".linkName").href = `https://github.com/${user.login}`;
      row.querySelector(".name").textContent = `${user.name}`;
      row.querySelector(".username").textContent = `${user.login}`;
      row.querySelector(".repositories").textContent = `${user.public_repos}`;
      row.querySelector(".followers").textContent = `${user.followers}`;

      row.querySelector(".remove").addEventListener("click", () => {
        confirm(`Tem certeza que deseja deletar ${user.name} da lista?`);

        if(confirm) {
          this.delete(user);
        };
      });

      this.tbody.append(row);
    });

    if(this.entries.length === 0) {
      const emptyPage = this.createEmptyRow();
      
      emptyPage.classList.add("empty");
      this.page.querySelector("main").classList.add("empty");
      this.page.querySelector("table").classList.add("empty");
      this.tbody.classList.add("empty");
      
      this.tbody.append(emptyPage);
    } else {
      this.page.querySelector("main").classList.remove("empty");
      this.page.querySelector("table").classList.remove("empty");
      this.tbody.classList.remove("empty");
    };
  };

  removeAllTr() {
    this.tbody.querySelectorAll("tr").forEach((tr) => {
      tr.remove();
    })
  }

  onAdd() {
    const btnAdd = this.page.querySelector(".addFav");
    btnAdd.addEventListener("click", () => {
      const { value } = this.page.querySelector("input");
      this.add(value);
    });
  };

  createRowContent() {
    this.tr = document.createElement("tr");
    this.tr.innerHTML = `
      <td class="user">
        <a class="imgLink" href="https://github.com/Henrik-0" target="_blank">
          <img src="https://github.com/Henrik-0.png" alt="Imagem de Henrik">
        </a>
      <a class="linkName" href="https://github.com/Henrik-0" target="_blank">
        <p class="name" >Henrik</p>
        <span class="username" >Henrik-0</span>
      </a>
      </td>

      <td class="repositories">
        123
      </td>

      <td class="followers">
        123
      </td>

      <td>
        <button class="remove">Remover</button>
      </td>
    `;
    return this.tr;
  }

  createEmptyRow() {
    this.emptyPage = document.createElement("tr");
    this.emptyPage.innerHTML = `
    <td colspan="4">
      <div>
        <img src="./assets/starFace.svg" alt="Estrela sorrindo">
        Nenhum favorito ainda
      </div>
    </td>
    `;
    return this.emptyPage;
  };
};  