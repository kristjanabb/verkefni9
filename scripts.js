
const API_URL = 'https://apis.is/isnic?domain=';
const domains = document.querySelector('.domains');

const program = (() => {
  const results = domains.querySelector('.results');

  function emptyResults() {
    while (results.firstChild) {
      results.removeChild(results.firstChild);
    }
  }

  function displayErrorMessage(message) {
    emptyResults();
    const span = document.createElement('span');
    span.appendChild(document.createTextNode(message));
    results.appendChild(span);
  }

  function loading() {
    emptyResults();
    const div = document.createElement('div');
    div.classList.add('loading');
    const img = document.createElement('img');
    img.setAttribute('src', 'loading.gif');
    div.appendChild(img);

    const text = document.createElement('span');
    text.appendChild(document.createTextNode('Leita að léni...'));
    div.appendChild(text);
    results.appendChild(div);
  }


  function addToList(listparent, title, data) {
    if (data !== '') {
      const datatitle = document.createElement('dt');
      datatitle.appendChild(document.createTextNode(title));
      const datatext = document.createElement('dd');
      datatext.appendChild(document.createTextNode(data));
      listparent.appendChild(datatitle);
      listparent.appendChild(datatext);
    }
  }

  function displayResults(domainDisp) {
    emptyResults();
    if (domainDisp.length === 0) {
      displayErrorMessage('Lén er ekki skráð.');
      return;
    }
    const [{ domain, registered, lastChange, expires, registrantname, email, address, country }] = domainDisp; 
    const dl = document.createElement('dl');
    results.appendChild(dl);
    addToList(dl, 'Lén', domain);
    addToList(dl, 'Skráð', new Date(registered).toISOString().split('T')[0]);
    addToList(dl, 'Síðast breytt', new Date(lastChange).toISOString().split('T')[0]);
    addToList(dl, 'Rennur út', new Date(expires).toISOString().split('T')[0]);
    addToList(dl, 'Skráningaraðili', registrantname);
    addToList(dl, 'Netfang', email);
    addToList(dl, 'Heimilisfang', address);
    addToList(dl, 'Land', country);
  }
  function fetcher(dom) {
    loading();
    fetch(`${API_URL}${dom}`)
      .then((result) => {
        if (!result.ok) {
          return displayErrorMessage('Villa í tengingu.');
        }
        return result.json();
      })
      .then((data) => {
        displayResults(data.results);
      })
      .catch((error) => {
        displayErrorMessage('Villa við að sækja gögn.');
      });
  }

  function formHandler(e) {
    e.preventDefault();
    const domain = document.querySelector('input').value;
    if (domain.trim() === '') {
      displayErrorMessage('Lén verður að vera strengur.');
      document.querySelector('input').value = '';
      return;
    }
    fetcher(domain);
  }

  function init(_form) {
    _form.addEventListener('submit', formHandler);
  }

  return {
    init,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  program.init(domains);
});
