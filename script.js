const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartTotalFooter = document.getElementById("cart-total-footer");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const localizacaoAtual = document.getElementById("get-location");
const successModal = document.getElementById("success-modal");
const modalMessage = document.getElementById("modal-message");
const closeModal = document.getElementById("close-modal");

let cart = [];

//abrir modal do carrinho
cartBtn.addEventListener("click", function () {
  cartModal.style.display = "flex";

  updateCartModal();
});

// fechar o modal quando clicar fora
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
  updateCartModal();
});

menu.addEventListener("click", function (event) {
  //console.log(event.target);

  let parentButton = event.target.closest(".add-to-cart-btn");
  //console.log(parentButton);
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");

    //converte o preço em number
    const price = parseFloat(parentButton.getAttribute("data-price"));
    //console.log(name);
    //console.log(price);

    //adicionar no carrinho
    addToCar(name, price);
  }
});

//Função para adicionar no carrinho
function addToCar(name, price) {
  //alert("O item é " + name + " e seu valor é: " + price);

  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    // Se o item já existe, aumenta apenas a quantidade.
    existingItem.quantity += 1;
  } else {
    // Se nao, adiciona um novo
    cart.push({
      name,
      price: parseFloat(price), //certifica que o valor armazenado seja exibido corretamente
      quantity: 1,
    });
  }

  updateCartModal();
}

//Atualizar o carrinho de compras
function updateCartModal() {
  // Limpa o conteúdo anterior
  cartItemsContainer.innerHTML = "";
  let total = 0;
  let totalFooter = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");

    cartItemElement.classList.add(
      "flex",
      "justify-between",
      "mb-4",
      "flex-col"
    );

    // Define a variável aqui, dentro do loop
    let removeButtonHtml = ""; // Inicializa como uma string vazia

    // Verifica se a quantidade é maior que 1 para mostrar o botão de remoção
    if (item.quantity > 1) {
      removeButtonHtml = `
        <button class="remove-item text-lg py-2 px-4 text-black" data-name="${item.name}">
          <i class="fa-solid fa-square-minus text-black"></i>
        </button>
      `;
    }

    cartItemElement.innerHTML = `
    <div class="flex items-center justify-between">
     <div>
       <p class="font-bold">${item.name}</p>
       <p>Qtd: ${item.quantity}</p>
       <p class="font-bold mt-2">R$ ${item.price.toFixed(2)}</p>
     </div>

      <div class="gap-3">
        ${removeButtonHtml}
        <button class="excluir-item text-lg py-2 text-black " data-name="${
          item.name
        }">
          <i class="fa-solid fa-trash-can text-black"></i>
        </button>
      </div>
    </div>
     `;

    total += item.price * item.quantity;
    totalFooter += item.price * item.quantity;

    cartItemsContainer.appendChild(cartItemElement);
  });

  // Colocando o valor total dentro do campo formatado em moeda brasileira
  cartTotal.textContent = totalFooter.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  // Colocando o valor total dentro do campo formatado em moeda brasileira
  cartTotalFooter.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.innerText = cart.length;
}

// function para remover iten do carrinho
cartItemsContainer.addEventListener("click", function (event) {
  const removeButton = event.target.closest(".remove-item"); // Verifica se o clique foi no botão ou no ícone
  const deleteButton = event.target.closest(".excluir-item");

  if (removeButton) {
    const name = removeButton.getAttribute("data-name"); // Agora usa o botão como referência para obter o data-name
    //console.log("Nome do item:", name);
    removeItemCart(name);
  } else if (deleteButton) {
    const name = deleteButton.getAttribute("data-name");
    deleteItemCart(name);
  }
});

function removeItemCart(name) {
  // verifica a posicao do item na lista e verifica tambem se o nome  é igual o que esta passando
  const indexCart = cart.findIndex((item) => item.name === name);

  if (indexCart !== -1) {
    const item = cart[indexCart];
    //console.log(item);
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(indexCart, 1);
    }

    updateCartModal();
  }
}

function deleteItemCart(name) {
  // verifica a posicao do item na lista e verifica tambem se o nome  é igual o que esta passando
  const indexCartDelete = cart.findIndex((item) => item.name === name);

  if (indexCartDelete !== -1) {
    //console.log(item);
    cart.splice(indexCartDelete, 1);

    updateCartModal();
    return;
  }
}

// Evento de input para ocultar o aviso ao preencher o campo de endereço
addressInput.addEventListener("input", function () {
  if (addressInput.value.trim() !== "") {
    addressWarn.classList.add("hidden"); // Oculta o aviso se o campo estiver preenchido
  } else {
    addressWarn.classList.remove("hidden"); // Mostra o aviso se o campo estiver vazio
  }
});
// Evento de clique para finalizar o pedido
checkoutBtn.addEventListener("click", function () {
  // Limpa avisos anteriores
  document.getElementById("cart-warn").classList.add("hidden");
  document.getElementById("address-warn").classList.add("hidden");

  if (cart.length === 0) {
    document.getElementById("cart-warn").classList.remove("hidden"); // Exibe aviso de carrinho vazio
    return;
  }

  if (cart.length !== 0 && addressInput.value === "") {
    addressWarn.classList.remove("hidden"); // Exibe aviso de endereço vazio
    return; // Não prosseguir se o endereço estiver vazio
  }

  // Limpar campos
  addressInput.value = ""; // Limpa o campo de endereço
  cart.length = 0; // Limpa o carrinho (ou remova os itens conforme sua lógica)

  // Exibir a modal com mensagem de sucesso
  const randomNumber = Math.floor(Math.random() * 10000); // Gera um número aleatório
  const currentDate = new Date(); // Obtém a data atual
  const currentTime = currentDate.toLocaleTimeString(); // Obtém a hora atual formatada
  const formattedDate = currentDate.toLocaleDateString(); // Obtém a data formatada

  // Atualiza o conteúdo da mensagem da modal com títulos e informações em linhas separadas
  modalMessage.innerHTML = `
    <strong>Número do Pedido:</strong> ${randomNumber}<br>
    <strong>Hora:</strong> ${currentTime}<br>
    <strong>Data:</strong> ${formattedDate}
  `;

  successModal.classList.remove("hidden"); // Exibe a modal
});

// Evento de clique para fechar a modal
closeModal.addEventListener("click", function () {
  successModal.classList.add("hidden"); // Oculta a modal
});

localizacaoAtual.addEventListener("click", function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        // Aqui você deve usar um serviço de geocodificação para converter as coordenadas em um endereço
        fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        )
          .then((response) => response.json())
          .then((data) => {
            document.getElementById("address").value = data.display_name; // Preenche o campo de endereço com o endereço obtido
          })
          .catch((error) => {
            console.error("Erro ao obter o endereço:", error);
          });
      },
      function () {
        alert(
          "Erro ao acessar a localização. Verifique as permissões do navegador."
        );
      }
    );
  } else {
    alert("Geolocalização não é suportada neste navegador.");
  }
});
