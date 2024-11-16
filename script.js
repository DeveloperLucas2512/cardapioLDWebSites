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

  const parentButton = event.target.closest(".add-to-cart-btn");
  //console.log(parentButton);
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");

    //converte o preço em number
    const price = parseFloat(parentButton.getAttribute("data-price"));
    //console.log(name);
    //console.log(price);

    //adicionar no carrinho
    addToCart(name, price);
  }
});

//Função para adicionar no carrinho
function addToCart(name, price) {
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
  let inputValue = event.target.value;

  if (addressInput.value.trim() !== "") {
    addressWarn.classList.add("hidden"); // Oculta o aviso se o campo estiver preenchido
  } else {
    addressWarn.classList.remove("hidden"); // Mostra o aviso se o campo estiver vazio
  }

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

// verificar horario de funcionamento e manipular o card do horario
function checkRestauranteOpen() {
  const data = new Date(); // Pega data atual
  const hora = data.getHours(); // Devolve a hora atual
  return hora >= 18 && hora < 22; // true = restaurante estará aberto
}

const spanItem = document.getElementById("date-span");
const isOpen = checkRestauranteOpen();

// Atualiza a cor de fundo e exibe o horário de funcionamento com o status
if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
  spanItem.innerHTML = `
    <span class="text-white font-medium block ">Seg á Dom - 8:00 às 22:00</span><br>
    <span class="text-white font-bold justify-center flex">(ABERTO)</span>
  `;
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
  spanItem.innerHTML = `
    <span class="text-white font-medium block ">Seg á Dom - 8:00 às 22:00</span><br>
    <span class="text-white font-bold justify-center flex">(FECHADO)</span>
  `;
}

// Evento de clique para finalizar o pedido
// Função para verificar o horário de funcionamento do restaurante
function checkRestauranteOpen() {
  const data = new Date(); // Data atual
  const hora = data.getHours(); // Hora atual
  return hora >= 8 && hora < 22; // Restaurante aberto entre 18:00 e 22:00
}

// Evento de clique para finalizar o pedido
checkoutBtn.addEventListener("click", function () {
  // Ocultar avisos iniciais de carrinho e endereço
  document.getElementById("cart-warn").classList.add("hidden");
  addressWarn.classList.add("hidden");

  // Verificar se o restaurante está aberto
  const isOpen = checkRestauranteOpen();
  if (!isOpen) {
    alert("RESTAURANTE FECHADO");
    return; // Parar a função se o restaurante está fechado
  }

  // Verificar se o carrinho está vazio
  if (cart.length === 0) {
    document.getElementById("cart-warn").classList.remove("hidden");
    return; // Parar a função se o carrinho está vazio
  }

  // Verificar se o endereço está preenchido
  if (addressInput.value.trim() === "") {
    addressWarn.classList.remove("hidden"); // Mostrar aviso se o endereço está vazio
    addressInput.classList.add("border-red-500");
    return; // Parar a função se o endereço está vazio
  }

  // Limpar campo de endereço e resetar o carrinho após finalizar pedido e enviar para o WhatsApp
  const pedidoItens = cart
    .map(
      (item) =>
        `*${item.name}*\nQtd: \`${
          item.quantity
        }\`\t\tPreço: \`R$ ${item.price.toFixed(2)}\`\n`
    )
    .join("\n");

  // Gerar informações do pedido
  const randomNumber = Math.floor(Math.random() * 10000);
  const currentDate = new Date();
  const currentTime = currentDate.toLocaleTimeString("pt-BR");
  const formattedDate = currentDate.toLocaleDateString("pt-BR");

  // Atualizar o modal com o número do pedido, data e hora
  modalMessage.innerHTML = `
    <strong>N. Pedido:</strong> <span style="color: red;">${randomNumber}</span><br>
    <strong>Hora:</strong> ${currentTime}<br>
    <strong>Data:</strong> ${formattedDate}
  `;

  // Exibir o modal de sucesso e limpar o carrinho
  successModal.classList.remove("hidden"); // Mostrar modal de sucesso
  cart = []; // Esvaziar o carrinho

  // Formatar mensagem para o WhatsApp
  const mensagemWhatsApp = `*N. Pedido:* *${randomNumber}*\n*Data:* ${formattedDate}\n*Hora:* ${currentTime}\n\n*Itens do Pedido:*\n${pedidoItens}\n\n*Endereço de Entrega:* ${addressInput.value}`;

  // Abrir WhatsApp com a mensagem formatada
  const phone = "16993102055";
  window.open(
    `https://wa.me/${phone}?text=${encodeURIComponent(mensagemWhatsApp)}`,
    "_blank"
  );

  // Limpar o campo de endereço e atualizar o carrinho visualmente
  addressInput.value = "";
  updateCartModal();
});

// Evento de clique para fechar o modal de sucesso
closeModal.addEventListener("click", function () {
  successModal.classList.add("hidden"); // Ocultar modal de sucesso
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

/////////////////////////////////////////////////////////////////////////////////////////
// Seleciona o botão '+' que expande o menu
const expandButton = document.querySelector(".expandable");

// Seleciona o elemento da lista que será expandida
const extraMenu = document.querySelector(".extra-menu");

// Adiciona o evento de clique para expandir ou contrair a lista
expandButton.addEventListener("click", function (event) {
  event.stopPropagation(); // Impede que o clique se propague
  extraMenu.style.display =
    extraMenu.style.display === "block" ? "none" : "block";
});

// Adiciona o evento de clique ao documento para fechar a lista ao clicar fora
document.addEventListener("click", function () {
  extraMenu.style.display = "none";
});

// Impede que o menu feche ao clicar dentro de .extra-menu
extraMenu.addEventListener("click", function (event) {
  event.stopPropagation();
});

////////////////////======> carregar conteudo dos links clicados <===========///////////////////////
const contentContainer = document.getElementById("content-container");
let activeElementId = null; // Armazena o ID do conteúdo atualmente visível

// Função genérica para carregar e exibir conteúdo
async function loadPageContent(pageUrl, elementId) {
  // Verifica se há um conteúdo visível e o oculta
  if (activeElementId && activeElementId !== elementId) {
    const activeElement = document.getElementById(activeElementId);
    if (activeElement) activeElement.style.display = "none";
  }

  // Verifica se o contêiner para o novo conteúdo já existe
  let contentElement = document.getElementById(elementId);
  if (!contentElement) {
    contentElement = document.createElement("div");
    contentElement.id = elementId;
    contentContainer.appendChild(contentElement);
  }

  // Exibe o novo conteúdo
  try {
    const response = await fetch(pageUrl);
    if (!response.ok) throw new Error("Erro ao carregar o conteúdo.");
    const content = await response.text();
    contentElement.innerHTML = content;
    contentElement.style.display = "block"; // Exibe o conteúdo

    // Atualiza o ID do conteúdo visível
    activeElementId = elementId;
  } catch (error) {
    console.error("Erro ao carregar o conteúdo:", error);
    contentElement.innerHTML = "<p>O conteúdo não pôde ser carregado.</p>";
  }
}

// Adiciona o evento de clique para cada link na lista (inclui <p> e <li>)
const linkElements = document.querySelectorAll(
  ".container-links p, .extra-menu li"
);

linkElements.forEach((element) => {
  element.addEventListener("click", function () {
    // Obtém a URL e o ID do contêiner a partir dos atributos data
    const pageUrl = element.getAttribute("data-url");
    const elementId = element.getAttribute("data-id");

    // Carrega o conteúdo dinamicamente para o contêiner correspondente
    loadPageContent(pageUrl, elementId);
  });
});

function toggleSection(sectionId) {
  const content = document.getElementById(sectionId);
  const parent = content.parentElement;
  const icon = parent.querySelector(".toggle-icon");

  // Alterna a exibição do conteúdo
  if (content.style.display === "none" || content.style.display === "") {
    content.style.display = "block";
    parent.classList.add("open");
  } else {
    content.style.display = "none";
    parent.classList.remove("open");
  }
}

function loadContent(sectionId, url) {
  const content = document.getElementById(`${sectionId}-content`);
  const parent = content.parentElement;
  const icon = parent.querySelector(".toggle-icon");

  if (content.style.display === "none" || content.style.display === "") {
    fetch(url) // Use o caminho relativo "cervejas.html" aqui
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `Erro ao carregar o conteúdo: ${response.statusText}`
          );
        }
        return response.text();
      })
      .then((data) => {
        content.innerHTML = data;
        content.style.display = "block";
        parent.classList.add("open");
      })
      .catch((error) => {
        content.innerHTML = `<p style="color: red;">Erro ao carregar conteúdo.</p>`;
        console.error(error);
      });
  } else {
    content.style.display = "none";
    parent.classList.remove("open");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll('a[href^="#"]'); // Seleciona todos os links com href começando com #

  links.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault(); // Evita o comportamento padrão do link

      const targetID = this.getAttribute("href"); // Obtém o ID do destino
      const targetElement = document.querySelector(targetID); // Encontra o elemento correspondente

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth", // Habilita rolagem suave
          block: "start", // Alinha no topo
        });
      }
    });
  });
});
