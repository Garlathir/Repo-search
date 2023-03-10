const findRepository = document.querySelector(".search-repository__input");
const foundRepository = document.querySelector(".search-repository__results");
const selectedRepository = document.querySelector(
  ".search-repository__selected"
);
const notExist = document.querySelector(".not-exist");

async function searchRepos() {
  let inputValue = findRepository.value;
  if (inputValue === "") {
    clearInput();
    return;
  }

  const url = new URL("https://api.github.com/search/repositories?q=Q");
  url.searchParams.append("q", inputValue);
  url.searchParams.append("per_page", 5);
  try {
    const res = await fetch(url);
    if (res.ok) {
      const repos = await res.json();
      if (repos.total_count === 0) {
        notExist.innerHTML = `*Репозитория не существует`;
      }
      console.log(repos);
      showResult(repos.items);
    } else {
      return null;
    }
  } catch {
    return null;
  }
}

function clearInput() {
  foundRepository.innerHTML = "";
}

function showResult(repositories, first = 5) {
  clearInput();

  for (let i = 0; i < first; i++) {
    let name = repositories[i].name;
    let owner = repositories[i].owner.login;
    let stars = repositories[i].stargazers_count;

    let appContent = `<div class='result' data-owner='${owner}' data-stars='${stars}'>${name}</div>`;
    foundRepository.innerHTML += appContent;
  }
}

function selectRepo(target) {
  let name = target.textContent;
  let owner = target.dataset.owner;
  let stars = target.dataset.stars;
  selectedRepository.innerHTML += `<div class='selected'>Name: ${name}</br>Owner: ${owner}</br>Stars: ${stars}<button class='btn-close'></button></div>`;
}

function debounce(fn, debounceTime) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, debounceTime);
  };
}

findRepository.addEventListener("input", debounce(searchRepos, 400));

foundRepository.addEventListener("click", (event) => {
  clearInput();
  notExist.innerHTML = "";
  findRepository.value = "";
  const target = event.target;
  if (!target.classList.contains("result")) {
    return;
  }
  selectRepo(target);
});

selectedRepository.addEventListener("click", (event) => {
  const target = event.target;
  if (!target.classList.contains("btn-close")) {
    return;
  }
  target.parentElement.remove();
});
