window.onload = () => {
  
  const array = [
    'iron man',
    'harry potter',
    'toy story',
    'mortal kombat',
    'avengers',
    'high and low'
  ];
  
  const content = document.querySelector('.content');
  
  async function loadData(param, value) {
    try {
      // ambil data 
      const data = await fetchData(param, value);
      /*
        jalankan fungsi updateUI() dengan mengirimkan
        sebuah argumen dari variabel data
      */
      updateUI(data.Search);
    } catch (error) {
      /*
        jika mengalami masalah saat mengambil data, 
        maka tampilkan pesan error dengan menjalankan fungsi 
        showError() dengan berisikan argumen "error.message"
      */
      content.innerHTML = showError(error.message);
    }
  }
  // dapatkan value secara acak "array" dari variabel array 
  const result = array[Math.floor(Math.random() * array.length)];
  /*
    jalankan fungsi loadData() dengan mengirimkan
    sebuah argumen 's' sebagai parameter dan variabel result
    sebagai value
  */
  loadData('s', result);
  
  function fetchData(param, value) {
    return fetch(`https://www.omdbapi.com/?apikey=feefac6f&${param}=${value}`)
      .then(response => response.json())
      .then(response => {
        // jika ada kesalahan di bagian paramter "param" atau "value"
        if (response.Response == 'False') throw new Error(response.Error);
        // jika tidak ada kesalahan
        return response;
      })
      .catch(error => {
        // jika mengalami kesalahan saat mengambil data
        throw new Error(error);
      });
  }
  
  function updateUI(param) {
    // bersihkan isi dari element content 
    content.innerHTML = '';
    // string kosong
    let result = '';
    /*
      looping parameter "param" dan jalankan fungsi showCard()
      dengan mengirimkan sebuah argumen dari hasil looping, yaitu data 
      dan masukkan hasilnya kedalam variabel result
    */
    param.forEach(data => result += showCard(data));
    // masukkan isi variabel result kedalam element content
    content.insertAdjacentHTML('beforeend', result);
  }
  
  function showCard(param) {
    return `
    <div class="col-md-4">
      <div class="card my-2">
        <img src="${param.Poster}" alt="image" class="card-img-top rounded">
        <div class="card-body">
          <h3 class="fw-normal">${param.Title}</h3>
          <div class="d-flex justify-content-between align-items-center my-3">
            <div class="d-inline-block">
              <span class="fw-normal me-1">year :</span>
              <span class="fw-light">(${param.Year})</span>
            </div>
            <div class="d-inline-block">
              <span class="fw-normal me-1">type :</span>
              <span class="fw-light">${param.Type}</span>
            </div>
          </div>
          <button class="btn btn-outline-primary rounded-1 btn-detail" data-id="${param.imdbID}" data-bs-toggle="modal" data-bs-target="#modalBox">
            see detail movie
          </button>
        </div>
      </div>
    </div>
    `;
  }
  
  function showError(message) {
    return `
    <div class="col-md-6 mx-auto">
      <div class="alert alert-danger my-auto" role="alert">
        <h1 class="fw-normal">Error!</h1>
        <p class="fw-light my-auto">${message}</p>
      </div>
    </div>
    `;
  }
  
  // pencarian data 
  const input = document.querySelector('.input');
  const submitButton = document.querySelector('.btn-submit');
  submitButton.addEventListener('click', () => {
    // value input
    const value = input.value.trim();
    // jika input kosong 
    if (!value) return alerts('error', 'Alert', 'field is empty!');
    /*
      jalankan fungsi loadData() dengan mengirimkan
      sebuah argumen 's' sebagai parameter dan variabel "value"
      sebagai value
    */
    loadData('s', value);
    // bersihkan value input
    input.value = '';
  });
  
  // detail data
  const modalContainer = document.querySelector('.modal-container');
  window.addEventListener('click', async event => {
    // jika element yang ditekan memiliki class "btn-detail"
    if (event.target.classList.contains('btn-detail')) {
      try {
        // dapatkan isi value dari atribut "data-id"
        const id = event.target.dataset.id;
        // ambil data berdasarkan id 
        const data = await fetchData('i', id);
        // jalankan fungsi updateDetailUI()
        updateDetailUI(data);
      } catch (error) {
        // jika mengalami masalah saat mengambil data 
        modalContainer.innerHTML = showError(error.message);
      }
    }
  });
  
  function updateDetailUI(param) {
    // kosongkan isi element modal container
    modalContainer.innerHTML = '';
    /*
      jalankan fungsi showDetail() dengan mengirimkan
      berupa sebuah argumen dari parameter "param"
    */
    const result = showDetail(param);
    // masukkan isi variabel result kedalam element modal container
    modalContainer.insertAdjacentHTML('beforeend', result);
  }
  
  function alerts(icon, title, text, position = 'center') {
    // plugin sweetalert2
    swal.fire ({
      position: position,
      icon: icon,
      title: title,
      text: text 
    });
  }
  
  function showDetail(param) {
    return `
    <img src="${param.Poster}" alt="image" class="img-fluid mb-3">
    <ul class="list-group">
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center">
          <span class="fw-normal me-1">title :</span>
          <span class="fw-light">${param.Title} (${param.Year})</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center">
          <span class="fw-normal me-1">released :</span>
          <span class="fw-light">${param.Released}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center">
          <span class="fw-normal me-1">runtime :</span>
          <span class="fw-light">${param.Runtime}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center flex-wrap">
          <span class="fw-normal me-1">genre :</span>
          <span class="fw-light">${param.Genre}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center flex-wrap">
          <span class="fw-normal me-1">director :</span>
          <span class="fw-light">${param.Director}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center flex-wrap">
          <span class="fw-normal me-1">writer :</span>
          <span class="fw-light">${param.Writer}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center flex-wrap">
          <span class="fw-normal me-1">actor :</span>
          <span class="fw-light">${param.Actors}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex flex-column">
          <span class="fw-normal mb-2">plot :</span>
          <span class="fw-light">${param.Plot}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex flex-column">
          <span class="fw-normal mb-2">awards :</span>
          <span class="fw-light">${param.Awards}</span>
        </div>
      </li>
      <li class="list-group-item p-3">
        <div class="d-flex align-items-center">
          <span class="fw-normal me-2">ratings :</span>
          <span class="fw-light">${param.imdbRating}</span>
        </div>
      </li>
    </ul>
    `;
  }
  
}