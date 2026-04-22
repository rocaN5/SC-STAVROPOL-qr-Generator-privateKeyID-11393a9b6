const version = "1.17.1"
const versionLots = "1.4.1"
const versionPoly = "1.1.2"
const versionCarts = "1.0"
let spanHistoryItemCounter = 0;

document.getElementById('qr-text').addEventListener('submit', function(e) {
  e.preventDefault();
}, false);

document.getElementById("qr-text").addEventListener("input", function() {
  generateCodes();

  makeSoundText()
  
  const getQrImgContainer = document.querySelector(".qrImgContainer");
  const getQrLoader = document.querySelector(".qrLoader");

  if (getQrImgContainer) {
      getQrLoader.style.display = 'flex';
  } else {
      getQrLoader.style.display = 'none';
  }

  clearSpaces();
});
document.getElementById("qr-text").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
      event.preventDefault();
  }
});

document.querySelector(".print__code").addEventListener("click", function() {
    const qrCodeCreated = document.querySelector(".qrCodeCreated")
    if(qrCodeCreated){
      convertToImageAndOpenInNewTab();
    }else{
      console.log("da")
      return
    }
});

const anomaly_description = document.getElementById("anomaly-description")
anomaly_description.addEventListener("input", ()=>{
  generateCodes();
  makeSoundText();
})

const anomaly_description_clearData = document.querySelector("#anomalyDesccription .deleteInput")
anomaly_description_clearData.addEventListener("click", ()=>{
    anomaly_description.value = ""
})

function generateAnomalyCodes() {
  document.getElementById("qr-code").setAttribute("qr-generate-mode", "anomaly")
  var qrText = document.getElementById("qr-text").value;
  var qrCodeDiv = document.getElementById("qr-code");
  qrCodeDiv.innerHTML = "";

  // Добавляем текст "Аномалия"
  let anomalyTest = document.createElement("h1");
  anomalyTest.classList.add('anomlyText');
  anomalyTest.textContent = "Аномалия";
  qrCodeDiv.appendChild(anomalyTest);

  var qrTextElement = document.createElement("p");
  var mainText = qrText.slice(0, -4); 
  var lastFourChars = qrText.slice(-4);
  qrTextElement.appendChild(document.createTextNode(mainText));

  var anomalySpan = document.createElement("span");
  anomalySpan.classList.add("anomalyTextLastLetters");
  anomalySpan.textContent = lastFourChars;
  qrTextElement.appendChild(anomalySpan);
  qrCodeDiv.appendChild(qrTextElement);
  
  // Создание и добавление h1 "СЦ Ставрополь"
  var companyName = document.createElement("h1");
  companyName.textContent = "СЦ Ставрополь";
  companyName.classList.add("anomalyCompanyName");
  qrCodeDiv.appendChild(companyName);
  
  // Создаем контейнер для QR-кода
  var qrImgContainer = document.createElement("div");
  qrImgContainer.classList.add('qrImgContainer');
  qrCodeDiv.appendChild(qrImgContainer);

  // Генерация QR-кода в зависимости от режима
  if (alternateQR_mode === true) {
    // Локальная генерация с помощью QRCode.js
    try {
      new QRCode(qrImgContainer, {
        text: qrText,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
      });
      
      const checkImg = setInterval(() => {
        const img = qrImgContainer.querySelector('img');
        if (img) {
          img.classList.add('qrCodeCreated');
          clearInterval(checkImg);
        }
      }, 10);
    } catch (e) {
      console.error("Ошибка генерации QR-кода:", e);
      var errorMessage = document.createElement("p");
      errorMessage.textContent = "Ошибка генерации QR-кода";
      qrImgContainer.appendChild(errorMessage);
    }
  } else {
    // Генерация через API
    var qrCode = document.createElement("img");
    qrCode.classList.add("qrCodeCreated");
    qrCode.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(qrText) + "&size=200x200";
    qrCode.alt = "QR Code";
    qrImgContainer.appendChild(qrCode);
  }

  // Добавляем дату и время
  var companyInfoDiv = document.createElement("div");
  companyInfoDiv.id = "company-info";
  var dateTime = document.createElement("span");
  dateTime.id = "datetime";
  dateTime.innerHTML = getCurrentDateTime();
  if(alternateQR_mode === true){
    let alternateInfoBlock = document.createElement("p")
    alternateInfoBlock.className = "alternateInfo"
    alternateInfoBlock.innerText = "Alternate"
  companyInfoDiv.appendChild(alternateInfoBlock);
  }
  
  companyInfoDiv.appendChild(dateTime);
  qrCodeDiv.appendChild(companyInfoDiv);

  // Добавляем описание аномалии (если есть)
  if (anomaly_description.value !== "") {
    let anomalyDesccriptionWrapper = document.createElement("div");
    anomalyDesccriptionWrapper.classList.add("anomalyDesccriptionWrapper");
  
    let anomalyDesccriptionWrapper_title = document.createElement("p");
    anomalyDesccriptionWrapper_title.classList.add("anomalyDesccriptionWrapper-title");
    anomalyDesccriptionWrapper_title.innerText = "Описание";
  
    let anomalyDesccription_item = document.createElement("div");
    anomalyDesccription_item.classList.add("anomalyDesccription-item");
  
    let anomalyDesccription_item_data = document.createElement("h4");
    anomalyDesccription_item_data.classList.add("anomalyDesccription-item-data");
  
    anomalyDesccription_item.appendChild(anomalyDesccription_item_data);
    anomalyDesccriptionWrapper.appendChild(anomalyDesccriptionWrapper_title);
    anomalyDesccriptionWrapper.appendChild(anomalyDesccription_item);
    qrCodeDiv.appendChild(anomalyDesccriptionWrapper);
  
    const anomDesriptionLabelText = document.querySelector(".anomalyDesccription-item-data");
    let anomData = anomaly_description.value;
    if (anomDesriptionLabelText) {
      anomDesriptionLabelText.innerText = anomData;
    }
  }
}

const damageVisible = document.getElementById("damageVisible")
const anomalyDesccription = document.getElementById("anomalyDesccription")
const alternateQR = document.getElementById("toggleAlternate")

function anomalyDescription__active(){
  alternateQR.setAttribute("isVisible", false)
  damageVisible.setAttribute("isVisible", false)
  damageVisible.setAttribute("inert", true)
  anomalyDesccription.setAttribute("isVisible", true)
  anomalyDesccription.removeAttribute("inert")
}

function anomalyDescription__disabled(){
  alternateQR.setAttribute("isVisible", true)
  damageVisible.setAttribute("isVisible", true)
  damageVisible.removeAttribute("inert")
  anomalyDesccription.setAttribute("isVisible", false)
  anomalyDesccription.setAttribute("inert", true)
  anomaly_description.value = ""
}

function generateCodes() {
  const inputText = document.getElementById('qr-text').value.trim();
  document.getElementById("qr-code").classList.remove("notAlowedPolybox")
  document.getElementById("qr-code").setAttribute("qr-generate-mode", "default")
  
  if(alternateQR_mode === true){
    
    if (inputText.startsWith("FA254") && inputText.length === 20) {
      generateAnomalyCodes();
      anomalyDescription__active();
      return;
    }
  
    // Проверка на полибоксы (F3, F4, F5)
    // if (inputText.startsWith("F3") || inputText.startsWith("F4") || inputText.startsWith("F5")) {
    //   let qrCodeDiv = document.getElementById("qr-code");
    //   qrCodeDiv.innerHTML = "";
    //   qrCodeDiv.classList.add("notAlowedPolybox");
    //   qrCodeDiv.innerHTML = `<h1 class="notAlowedPolybox-text">Генерация этикеток полибоксов запрещена!</h1>`;
    //   return;
    // }
  
    // Основной случай
    const qrText = inputText;
    const qrCodeDiv = document.getElementById("qr-code");
    qrCodeDiv.innerHTML = "";
    anomalyDescription__disabled();
  
    // Если поле пустое
    if (!qrText) {
      const messageElement = document.createElement("p");
      messageElement.classList.add("qrCodeDefaultText");
      messageElement.textContent = "Введите текст в поле ввода, чтобы сгенерировать QR-код.";
      qrCodeDiv.appendChild(messageElement);
  
      const randomNumber = Math.floor(Math.random() * 50) + 1;
      const style = document.createElement('style');
      style.innerHTML = `.qrCodeDefaultText::after { background-image: url("./img/goma and peach/catID_${randomNumber}.gif"); }`;
      document.head.appendChild(style);
      return;
    }
  
    // Добавляем блок с названием и датой
    const companyInfoDiv = document.createElement("div");
    companyInfoDiv.id = "company-info";
    companyInfoDiv.innerHTML = `
      <h1>СЦ Ставрополь</h1>
      <span id="datetime">${getCurrentDateTime()}</span>
      ${alternateQR_mode === true ? '<p class="alternateInfo">Alternate</p>' : ''}
    `;
    qrCodeDiv.appendChild(companyInfoDiv);
  
    // Генерация QR-кода (используем QRCode.js)
    const qrImgContainer = document.createElement("div");
    qrImgContainer.classList.add('qrImgContainer');
    qrCodeDiv.appendChild(qrImgContainer);
  
    // Создаем новый QRCode
    new QRCode(qrImgContainer, {
      text: qrText,
      width: 200,
      height: 200,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.M
    });

    const checkImg = setInterval(() => {
      const img = qrImgContainer.querySelector('img');
      if (img) {
        img.classList.add('qrCodeCreated');
        clearInterval(checkImg);
      }
    }, 10);
  
    // Добавляем текст под QR-кодом
    const qrTextElement = document.createElement("p");
    qrTextElement.textContent = qrText;
    qrTextElement.classList.add("mainText");
    qrCodeDiv.appendChild(qrTextElement);
  
    // Добавляем дополнительные текстовые блоки (если нужны)
    const maxLength = 20;
    const formatText = (text) => text.length > maxLength ? "..." + text.slice(-(maxLength - 3)) : text;
  
    ["Left", "Right", "Top", "Bottom"].forEach(pos => {
      const element = document.createElement("p");
      element.textContent = formatText(qrText);
      element.classList.add(`mainExtraText${pos}`);
      qrCodeDiv.appendChild(element);
    });
  
    // Добавляем пометку "Повреждённый заказ" (если включено)
    if (inputDamagedChecked) {
      const qrTextDamaged = document.createElement("p");
      qrTextDamaged.classList.add("orderDamaged");
      qrTextDamaged.innerHTML = `<i></i>Повреждённый заказ<i></i>`;
      qrCodeDiv.appendChild(qrTextDamaged);
    } else {
      const orderDamaged = document.querySelector('.orderDamaged');
      if (orderDamaged) orderDamaged.remove();
    }
  }else{
    // Проверка на начало текста с "FA254" и минимальную длину в 19 символов
    if (inputText.startsWith("FA254") && inputText.length == 20 ) {
        generateAnomalyCodes();
        anomalyDescription__active()
    } 
    // else if(inputText.startsWith("F3") || inputText.startsWith("F4") || inputText.startsWith("F5")){
      
    //   let qrCodeDiv = document.getElementById("qr-code");
    //   qrCodeDiv.innerHTML = "";
    //   qrCodeDiv.classList.add("notAlowedPolybox")
    //   qrCodeDiv.innerHTML = `
    //     <h1 class="notAlowedPolybox-text">Генерация этикеток полибоксов запрещена !</h1>
    //   `
    // }
    else {
      var qrText = document.getElementById("qr-text").value;
      var qrCodeDiv = document.getElementById("qr-code");
      qrCodeDiv.innerHTML = "";
      anomalyDescription__disabled()

      if (qrText.trim() === "") {
        var messageElement = document.createElement("p");
        messageElement.classList.add("qrCodeDefaultText");
        messageElement.textContent = "Введите текст в поле ввода, чтобы сгенерировать QR-код.";
        qrCodeDiv.appendChild(messageElement);

        // Генерация случайного числа от 1 до 5
        var randomNumber = Math.floor(Math.random() * 50) + 1;

        // Добавление стиля через JavaScript
        var style = document.createElement('style');
        style.innerHTML = `
          .qrCodeDefaultText::after {
            background-image: url("./img/goma and peach/catID_${randomNumber}.gif");
          }
        `;
        document.head.appendChild(style);

        return;
      }

      // Создание и добавление h1 "СЦ Ставрополь" и span с датой и временем в один div
      var companyInfoDiv = document.createElement("div");
      companyInfoDiv.id = "company-info";
      var companyName = document.createElement("h1");
      companyName.textContent = "СЦ Ставрополь";
      var dateTime = document.createElement("span");
      dateTime.id = "datetime";
      dateTime.innerHTML = getCurrentDateTime();
      if(alternateQR_mode === true){
        let alternateInfoBlock = document.createElement("p")
        alternateInfoBlock.className = "alternateInfo"
        alternateInfoBlock.innerText = "Alternate"
      companyInfoDiv.appendChild(alternateInfoBlock);
      }
      
      companyInfoDiv.appendChild(companyName);
      companyInfoDiv.appendChild(dateTime);
      qrCodeDiv.appendChild(companyInfoDiv);

      // Генерация QR-кода
      var qrCode = document.createElement("img");
      qrCode.classList.add("qrCodeCreated")
      qrCode.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(qrText) + "&size=200x200";
      qrCode.alt = "QR Code";

      // var qrLoader = document.createElement("div");
      // qrLoader.classList.add('qrLoader');
      // qrCodeDiv.appendChild(qrLoader);

      var qrImgContainer = document.createElement("div");
      qrImgContainer.classList.add('qrImgContainer');
      qrCodeDiv.appendChild(qrImgContainer);
      qrImgContainer.appendChild(qrCode);


      var qrTextElement = document.createElement("p");
      qrTextElement.textContent = qrText;
      qrTextElement.classList.add("mainText")
      qrCodeDiv.appendChild(qrTextElement);

      var maxLength = 20;

      var qrTextElementExtraLeft = document.createElement("p");
      qrTextElementExtraLeft.textContent = formatText(`${qrText}`);
      qrTextElementExtraLeft.classList.add("mainExtraTextLeft");
      qrCodeDiv.appendChild(qrTextElementExtraLeft);
      
      var qrTextElementExtraRight = document.createElement("p");
      qrTextElementExtraRight.textContent = formatText(`${qrText}`);
      qrTextElementExtraRight.classList.add("mainExtraTextRight");
      qrCodeDiv.appendChild(qrTextElementExtraRight);

      var qrTextElementExtraTop = document.createElement("p");
      qrTextElementExtraTop.textContent = formatText(`${qrText}`);
      qrTextElementExtraTop.classList.add("mainExtraTextTop");
      qrCodeDiv.appendChild(qrTextElementExtraTop);
      
      var qrTextElementExtraBottom = document.createElement("p");
      qrTextElementExtraBottom.textContent = formatText(`${qrText}`);
      qrTextElementExtraBottom.classList.add("mainExtraTextBottom");
      qrCodeDiv.appendChild(qrTextElementExtraBottom);
      
      function formatText(text) {
          // Обрезаем текст до 14 символов (с учетом "•" по краям)
          var extraSymbols = 2; // По одному символу "•" слева и справа
          var adjustedMaxLength = maxLength - extraSymbols;
      
          // Если текст длиннее, обрезаем и добавляем многоточие
          if (text.length > maxLength) {
              return "..." + text.slice(-adjustedMaxLength);
          }
          return text;
      }
      

      if(inputDamagedChecked == true){
        var qrTextDamaged = document.createElement("p");
        qrTextDamaged.classList.add("orderDamaged")

        qrTextDamaged.innerHTML = `<i></i>Повреждённый заказ<i></i>`;
        qrCodeDiv.appendChild(qrTextDamaged);
      }else{
        const orderDamaged = document.querySelector('.orderDamaged')
        if(orderDamaged){
          orderDamaged.remove()
        }
      }
    }
  }
}

function getCurrentDateTime() {
  var currentDate = new Date();
  var day = currentDate.getDate();
  var month = currentDate.getMonth() + 1;
  var year = currentDate.getFullYear();
  var hours = currentDate.getHours();
  var minutes = currentDate.getMinutes();
  var seconds = currentDate.getSeconds();
  let clockIcon = `<i class="dateTImeIcon dateTimeClock"></i>`;
  let dateIcon = `<i class="dateTImeIcon dateTimeCalendar"></i>`;
  return dateIcon + ' ' +
         (day < 10 ? '0' : '') + day + '.' + 
         (month < 10 ? '0' : '') + month + '.' + year + ' ' + 
         clockIcon + ' ' +
         (hours < 10 ? '0' : '') + hours + ':' + 
         (minutes < 10 ? '0' : '') + minutes + ':' + 
         (seconds < 10 ? '0' : '') + seconds;
}




function convertToImageAndOpenInNewTab() {
  const qrCodeDiv = document.getElementById("qr-code");
  const imageContainer = document.getElementById("image-container");
  const historyList = document.querySelector(".historyList");
  // Удаляем все дочерние элементы из контейнера
  while (imageContainer.firstChild) {
      imageContainer.removeChild(imageContainer.firstChild);
  }
  // Генерируем изображение и добавляем его в контейнер
  domtoimage.toPng(qrCodeDiv)
  .then(function (dataUrl) {
    var img = new Image();
  img.src = dataUrl;
  img.classList.add('test-img');
  imageContainer.appendChild(img);
  // Клонируем изображение для истории
  var imgHistory = img.cloneNode();
  imgHistory.classList.remove('test-img');
  imgHistory.classList.add('imgHistory');
  // Создаем новый элемент historyItemHolder
  const historyItemHolder = document.createElement('div');
  historyItemHolder.classList.add('historyItemHolder');
  historyList.appendChild(historyItemHolder);
  // Увеличиваем счетчик и используем его для historyItemCounter
  spanHistoryItemCounter += 1;
  // Создаем span для порядкового номера и добавляем его в historyItemHolder
  const historyItemCounter = document.createElement('span');
  historyItemCounter.classList.add('historyItemCounter');
  historyItemCounter.textContent = spanHistoryItemCounter;
  historyItemHolder.appendChild(historyItemCounter);
  // Создаем кнопку historyItem и добавляем в неё imgHistory
  const historyItem = document.createElement('button');
  historyItem.classList.add('historyItem');
  historyItemHolder.appendChild(historyItem);
  historyItem.appendChild(imgHistory);
      // Открываем изображение в новой вкладке
      var newTab = window.open();
      if (newTab) {
          newTab.document.write(`
            <html>
            <head>
              <title>QR Печать — Diman ${version}</title>
              <link rel="shortcut icon" href="img/iconPrint.png">
              <link rel="shortcut icon" href="img/iconPrint.ico" type="image/x-icon">
              <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
              <style>
              body, html{
              font-family: "Roboto", sans-serif;
              }
                ::selection {
                    background: #a1fb01;
                    color: #fff;
                }
                body {
                  margin: 0;
                  padding: 0;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  height: 100vh;
                  background-color: #000000;
                  position: relative;
                  flex-flow: column;
                  gap: 30px;
                }
                img {
                  max-width: 120%;
                  max-height: 120%;
                  z-index: 9999;
                  user-select: none;
                }
                canvas {
                  width: 100%;
                  height: 100%;
                  display: block;
                  position: fixed;
                  background-size: 100%;
                  background-repeat: no-repeat;
                  background: linear-gradient(0deg, #a1fb011f, #00ff951f);
                }
                .closingInSec {
                  position: relative;
                  color: white;
                  width: 30%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border: 7px double;
                  border-radius: 20px;
                  text-align: center;
                  gap: 10px;
                  height: 80px;
                  background: #44444412;
                  z-index: 9;
                  backdrop-filter: blur(4px);
                }
                .closingInSec svg {
                  display: flex;
                  transform: rotate(-90deg);
                }
                .closingInSec p {
                  font-size: 1.2rem;
                  font-family: Roboto;
                  font-weight: 500;
                  color: #fff;
                  margin: 0;
                }
                .closingInSec circle {
                  transition: stroke-dashoffset 0.1s linear, stroke 0.1s linear;
                }
                @media print {
                  body * {
                    display: none !important;
                    width: 100% !important;
                    height: 100% !important;
                    padding: unset !important;
                    margin: unset !important;
                  }
                  img{
                    display: unset !important;
                    max-width: 100% !important;
                    max-height: 100% !important;
                    z-index: 9999 !important;
                    width: unset !important;
                    height: unset !important;
                    overflow: hidden !important;
                  }
                }
              </style>
            </head>
            <body>
              <div class="closingInSec">
                <p>Страница закроется через <span id="countdown">3.0</span> секунд</p>
                <svg width="30" height="30">
                  <circle cx="15" cy="15" r="12" stroke-linecap="round" stroke="#a1fb01" stroke-width="4" fill="transparent" stroke-dasharray="75.36" stroke-dashoffset="0"></circle>
                </svg>
              </div>
              <canvas id="particle-canvas"></canvas>
              <img src="${dataUrl}">
              <script>
                let countdown = 2.0;
                const span = document.getElementById('countdown');
                const circle = document.querySelector('.closingInSec circle');
                const totalLength = 2 * Math.PI * 12; // 2 * Pi * r
                circle.style.strokeDasharray = totalLength;
            
                const endColor = { r: 161, g: 251, b: 1 };
                const startColor = { r: 88, g: 255, b: 158 };
            
                const interpolateColor = (start, end, factor) => {
                  const result = [start.r + factor * (end.r - start.r), start.g + factor * (end.g - start.g), start.b + factor * (end.b - start.b)];
                  return \`rgb(\${Math.round(result[0])}, \${Math.round(result[1])}, \${Math.round(result[2])})\`;
                };
            
                const interval = setInterval(() => {
                  countdown -= 0.1;
                  if (countdown <= 0) {
                    clearInterval(interval);
                    setTimeout(() => {
                      window.close();
                    }, 200);
                  } else {
                    span.textContent = countdown.toFixed(1);
                    circle.style.strokeDashoffset = totalLength * (1 - countdown / 2);
                    const factor = countdown / 2;
                    const currentColor = interpolateColor(startColor, endColor, factor);
                    circle.style.stroke = currentColor;
                  }
                }, 100);
              </script>
              <script src="print.js"></script>
            </body>
            </html>
            `);
            newTab.document.close();
            newTab.onload = function() {
                newTab.print();
            };
            sendImageToTelegram()
        } else {
            console.error('Не удалось открыть новое окно. Возможно, оно было заблокировано.');
        }
    })
    .catch(function (error) {
        console.error('Произошла ошибка:', error);
    });
}

// Функция для отправки изображения в Telegram
function sendImageToTelegram() {
  const token = '7443539159:AAFCfKgl8YN9cSxSjR_YLw02CA3ZXPBv-qQ';
  const chatId = '-1003941460554';
  const imgElement = document.querySelector('img.test-img');
  const captionInputText = document.getElementById('qr-text')?.value || ''; // Получаем значение из инпута
  const currentDate = new Date().toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(',', ''); // Форматируем текущую дату
  const currentTime = new Date().toLocaleString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).replace(',', ''); // Форматируем текущее время
  const generatedDateTime = document.querySelector('span.datetime')?.textContent || 'Неизвестно'; // Получаем дату генерации из спана

  // // Проверяем, является ли captionInputText числом из девяти цифр или начинается с 'LO-'
  // const isNineDigits = /^\d{9}$/.test(captionInputText);
  // const startsWithLO = /^LO-/.test(captionInputText);

  // // Формируем ссылку в зависимости от значения в captionInputText
  // let piLink = 'https://logistics.market.yandex.ru/sorting-center/21972131/sortables?sortableTypes=all&sortableStatuses=&sortableStatusesLeafs=&orderExternalId=';
  // if (startsWithLO) {
  //   // Если значение начинается с 'LO-'
  //   piLink += `${captionInputText}&inboundIdTitle=&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=&sortableBarcode=`;
  // } else if (isNineDigits) {
  //   // Если значение состоит из девяти цифр
  //   piLink += `${captionInputText}&inboundIdTitle=&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=&sortableBarcode=`;
  // } else {
  //   // Если значение не соответствует ни одному из условий выше
  //   piLink += `&inboundIdTitle=&outboundIdTitle=&groupingDirectionId=&groupingDirectionName=&sortableBarcode=${captionInputText}`;
  // }

  // Формируем подпись в HTML формате, используя ваше форматирование
  
  let captionHTML = "ooops"

  const inputText = document.getElementById('qr-text').value.trim();
  if (inputText.startsWith("FA254") && inputText.length == 20 ) {

    captionHTML = `
<b>🅰 Номер Аномалии:</b> <code>${captionInputText}</code>
<b>💬 Описание:</b> <i>${anomaly_description.value == "" ? "❌ Нет" : anomaly_description.value}</i>
<b>📅 Дата:</b> <i>${currentDate}</i>
<b>🕑 Время:</b> <i>${currentTime}</i>
<b>👨‍💻 Версия:</b> <i>${version}</i> ${alternateQR_mode == true ? "\n \n<b>⚙ Альтернативная генерация:</b> #alternateTrue" : ""}

    
  `;
  }else{
    captionHTML = `
<b>🔢 Номер заказа:</b> <code>${captionInputText}</code>
<b>📅 Дата:</b> <i>${currentDate}</i>
<b>🕑 Время:</b> <i>${currentTime}</i>
<b>👨‍💻 Версия:</b> <i>${version}</i> ${alternateQR_mode == true ? "\n \n<b>⚙ Альтернативная генерация:</b> #alternateTrue" : ""}

    
  `;
  }

  if (!imgElement) {
    console.error('Изображение с классом "test-img" не найдено.');
    return;
  }

  fetch(imgElement.src)
    .then(res => res.blob()) // Загружаем изображение и конвертируем его в Blob
    .then(blob => {
      const formData = new FormData();
      formData.append('chat_id', chatId);
      formData.append('photo', blob, 'image.png'); // Отправляем изображение
      formData.append('caption', captionHTML); // Добавляем подпись в HTML формате
      formData.append('parse_mode', 'HTML'); // Указываем, что подпись содержит HTML разметку

      fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: 'POST',
        body: formData
      })
        .then(response => response.json())
        .then(data => {
          if (data.ok) {
            console.log('Изображение успешно отправлено в Telegram с подписью');
          } else {
            console.error('Ошибка отправки изображения в Telegram:', data);
            console.error('Описание ошибки:', data.description); // Отобразите описание ошибки для диагностики
          }
        })
        .catch(error => {
          console.error('Произошла ошибка при отправке:', error);
        });
    })
    .catch(error => {
      console.error('Не удалось загрузить изображение:', error);
    });
}

const settings = document.querySelector('section.settings');
const sectionbodyDOM = document.querySelector('section.bodyDOM');
const callSettings = document.querySelector('.callSettings');
const backToWeb = document.querySelector('.backToWeb');
const contacts = document.querySelector('nav.contacts');

callSettings.addEventListener('click', () => {
  settings.style.display = "flex";
  contacts.style.opacity = "0";
  sectionbodyDOM.style.left = "-30%";
  settings.removeAttribute('active'); // Убираем атрибут active
  makeSoundClick();
  setTimeout(() => {
    contacts.style.display = 'none';
  }, 1000);
});

backToWeb.addEventListener('click', () => {
  makeSoundClick();
  contacts.style.display = 'flex';
  contacts.style.opacity = "1";
  sectionbodyDOM.style.left = "0";
  settings.setAttribute('active', ''); // Добавляем атрибут active
  setTimeout(() => {
    settings.style.display = "none";
  }, 1000);
});

let particleColorOnEnter = "#01c3fc";
let particleColorOnLeave = "#9158ff";

function createParticleCanvas(canvasId, sizeRange) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let mouse = { x: -100, y: -100 };
  let particlesEnabled = true;
  let lastTime = 0;
  let fps = 0;

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouse.x = -100;
    mouse.y = -100;
  });

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });


const canvasLowButton = document.querySelector('.canvasLow');
const canvasHighButton = document.querySelector('.canvasHigh');
const canvasFps = document.querySelector('.canvasFps');
const canvasParticleCount = document.querySelector('.canvasParticleCount');
const particleCountScaleUp = document.querySelector('.particleCountScaleUp');
const particleCountScaleDown = document.querySelector('.particleCountScaleDown');


//TODO Функция для управления кнопками canvas
const toggleCanvasButtons = (enableParticles) => {
  canvasLowButton.disabled = !enableParticles;
  canvasHighButton.disabled = enableParticles;
  canvasLowButton.style.display = enableParticles ? 'flex' : 'none';
  canvasHighButton.style.display = enableParticles ? 'none' : 'flex';
  particlesEnabled = enableParticles;
  makeSoundClick();

  if (enableParticles) {
    resetParticles();
  } else {
    particles = [];
  }

  updateParticleCount();

  const filterValue = enableParticles ? 'grayscale(0) opacity(1)' : 'grayscale(1) opacity(0.6)';
  particleCountScaleUp.style.filter = filterValue;
  particleCountScaleDown.style.filter = filterValue;

  particleCountScaleUp.disabled = !enableParticles;
  particleCountScaleDown.disabled = !enableParticles;
  particleCountScaleUp.style.cursor = enableParticles ? 'pointer' : 'not-allowed';
  particleCountScaleDown.style.cursor = enableParticles ? 'pointer' : 'not-allowed';
};

canvasLowButton.addEventListener('click', () => toggleCanvasButtons(false));
canvasHighButton.addEventListener('click', () => toggleCanvasButtons(true));

  particleCountScaleUp.addEventListener('click', () => {
    if (particlesEnabled) {
      for (let i = 0; i < 10; i++) {
        particles.push(new Particle(true));
      }
      updateParticleCount();
    }
    makeSoundClick();
  });

  particleCountScaleDown.addEventListener('click', () => {
    if (particlesEnabled && particles.length >= 10) {
      particles.splice(-10, 10);
      updateParticleCount();
    } else if (particlesEnabled && particles.length > 0) {
      particles = [];
      updateParticleCount();
    }
    makeSoundClick();
  });

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  class Particle {
    constructor(initial = false) {
      this.size = random(sizeRange.min, sizeRange.max);
      this.x = random(0, canvas.width);
      this.y = initial ? random(0, canvas.height) : -this.size;
      this.opacity = random(0.3, 1);
      this.speedY = random(1, 3);
      this.speedX = random(-1, 1);
      this.color = particleColorOnEnter;
      this.colorChange = particleColorOnLeave;
      this.avoidRadius = 100;
      this.glowRadius = 15;
      this.glowIntensity = 0.5;
      this.lightningRadius = this.avoidRadius / 1.8;
    }

    update() {
      const progress = Math.min(this.y / canvas.height, 1);
      this.color = this.interpolateColor(particleColorOnEnter, particleColorOnLeave, progress);

      this.y += this.speedY;
      this.x += this.speedX;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.avoidRadius) {
        this.x += dx / distance * 2;
      }

      if (distance < this.lightningRadius) {
        this.glowIntensity = (1 - distance / this.lightningRadius) / 2;
      } else {
        this.glowIntensity = 0;
      }

      if (this.y > canvas.height + this.size) {
        this.y = -this.size;
        this.x = random(0, canvas.width);
      }
    }

    draw() {
      if (this.glowIntensity > 0) {
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.glowRadius
        );

        const glowColor = `${particleColorOnEnter}`;
        gradient.addColorStop(0, `${glowColor}45`);
        gradient.addColorStop(1, `${particleColorOnLeave}05`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.fillStyle = this.color;
      ctx.globalAlpha = this.opacity;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    interpolateColor(color1, color2, factor) {
      const c1 = this.hexToRgb(color1);
      const c2 = this.hexToRgb(color2);
      const r = Math.round(c1.r + factor * (c2.r - c1.r));
      const g = Math.round(c1.g + factor * (c2.g - c1.g));
      const b = Math.round(c1.b + factor * (c2.b - c1.b));
      return `rgb(${r},${g},${b})`;
    }

    hexToRgb(hex) {
      const bigint = parseInt(hex.slice(1), 16);
      const r = (bigint >> 16) & 255;
      const g = (bigint >> 8) & 255;
      const b = (bigint & 255);
      return { r, g, b };
    }
  }

  let particles = [];

  function resetParticles() {
    particles = [];
    for (let i = 0; i < 200; i++) {
      particles.push(new Particle(true));
    }
    updateParticleCount();
  }

  function updateParticleCount() {
    if (!settings.hasAttribute('active')) { // Проверяем, есть ли атрибут active
      const visibleParticles = particles.filter(particle => {
        return particle.y >= 0 && particle.y <= canvas.height;
      });
      canvasParticleCount.textContent = visibleParticles.length;
    }
  }

  function drawLightning(x1, y1, x2, y2, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x1, y1);

    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2;
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;

    ctx.quadraticCurveTo(midX + offsetX, midY + offsetY, x2, y2);
    ctx.stroke();
  }

  function animate(time) {
    const deltaTime = time - lastTime;
    lastTime = time;
    fps = Math.round(1000 / deltaTime);

    if (!settings.hasAttribute('active')) { // Проверяем, есть ли атрибут active
      canvasFps.textContent = fps;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (particlesEnabled) {
      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();

        if (particle.y > canvas.height + particle.size) {
          particles.splice(i, 1);
          updateParticleCount();
        }
      }

      for (let i = 0; i < particles.length; i++) {
        const particle1 = particles[i];
        const dx = mouse.x - particle1.x;
        const dy = mouse.y - particle1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < particle1.lightningRadius) {
          for (let j = i + 1; j < particles.length; j++) {
            const particle2 = particles[j];
            const dx2 = particle1.x - particle2.x;
            const dy2 = particle1.y - particle2.y;
            const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

            if (distance2 < particle1.lightningRadius) {
              const color = particle1.color;
              drawLightning(particle1.x, particle1.y, particle2.x, particle2.y, color);
            }
          }
        }
      }
    }

    updateParticleCount();
    requestAnimationFrame(animate);
  }

  resetParticles();
  animate(0);
}

// Инициализация
createParticleCanvas('particle-canvas', { min: 2, max: 6 });


// TODO случайайная гифка котяры :D ✅
document.addEventListener("DOMContentLoaded", function() {
  // Генерация случайного числа от 1 до 5
  var randomNumber = Math.floor(Math.random() * 50) + 1;

  // Добавление стиля через JavaScript
  var style = document.createElement('style');
  style.innerHTML = `
    .qrCodeDefaultText::after {
      background-image: url("./img/goma and peach/catID_${randomNumber}.gif");
    }
  `;
  document.head.appendChild(style);
});

// TODO Кнопка очищения input ✅

      
function resetInput() {
  var qrCodeDiv = document.getElementById("qr-code");
  var messageElement = document.createElement("p");
  qrCodeDiv.innerHTML = '';
  messageElement.classList.add("qrCodeDefaultText");
  messageElement.textContent = "Введите текст в поле ввода, чтобы сгенерировать QR-код.";
  qrCodeDiv.appendChild(messageElement);

  const getQrLoader = document.querySelector('.qrLoader');
  getQrLoader.style.display = 'none';

  // Генерация случайного числа от 1 до 7
  var randomNumber = Math.floor(Math.random() * 50) + 1;

  // Добавление стиля через JavaScript
  var style = document.createElement('style');
  style.innerHTML = `
    .qrCodeDefaultText::after {
      background-image: url("./img/goma and peach/catID_${randomNumber}.gif");
    }
  `;
  document.head.appendChild(style);
}


document.addEventListener('DOMContentLoaded', function() {
  const containers = document.querySelectorAll('.inputContainer');

  containers.forEach(container => {
      const deleteDiv = container.querySelector('.deleteInput');
      const inputField = container.querySelector('.dataInput');

      function deleteFromImage(){
          document.getElementById("qr-code").classList.remove("notAlowedPolybox")
          if(inputField.classList.contains('orderNumber')){
              resetInput()
          } else if(inputField.classList.contains('orderExtraNumber')){
              resetInput()
          } else{
              console.log("eror ❌")
          }
      }
      
      deleteDiv.addEventListener('click', () => {
        
          makeSoundClean()
          anomalyDescription__disabled()
          inputField.value = '';
          document.getElementById("qr-code").setAttribute("qr-generate-mode", "unset")
          deleteFromImage();
      });
  });
});

// TODO Кнопка очщения Input от лишних пробелов ✅

const checkboxes = document.querySelectorAll(".toggleAutoTrim");
let inputChecked = true;

// Функция для переключения состояния всех чекбоксов
function toggleCheckboxes() {
  inputChecked = !inputChecked;

  checkboxes.forEach(checkbox => {
    checkbox.checked = inputChecked;
    
    makeSoundClick()
  });

  // Если все чекбоксы становятся checked, очищаем пробелы сразу
  if (inputChecked) {
    clearSpaces();
  }
}

// Функция для удаления пробелов из текстовых input полей
function clearSpaces() {
  if (inputChecked) {
    const qrInputs = document.querySelectorAll(".dataInput");
    qrInputs.forEach(input => {
      input.value = input.value.replace(/\s+/g, '');
      generateCodes();
    });
  }
}

const dataInputs = document.querySelectorAll(".dataInput");
dataInputs.forEach(input => {
  input.addEventListener("input", function() {
    clearSpaces();
  });
});

// Добавляем обработчик события на каждый чекбокс для переключения состояния
checkboxes.forEach(checkbox => {
  checkbox.addEventListener("click", toggleCheckboxes);
});

// TODO Кнопка Повреждённый заказ ✅

const checkboxesDamaged = document.querySelectorAll(".toggleDamageTitile");
let inputDamagedChecked = false;

// Функция для переключения состояния всех чекбоксов
function toggleCheckboxesDamaged() {
  inputDamagedChecked = !inputDamagedChecked;
  generateCodes()
  checkboxesDamaged.forEach(checkbox => {
    checkbox.checked = inputDamagedChecked;
    makeSoundClick()
  });
}
// Добавляем обработчик события на каждый чекбокс для переключения состояния
checkboxesDamaged.forEach(checkbox => {
  checkbox.addEventListener("click", toggleCheckboxesDamaged);
});

// TODO Кнопка альтернативной генерации ✅

const alternateQRInput = document.querySelectorAll(".toggleAltenrativeQR")
const alternateQRInputIcon = document.querySelector("label#toggleAlternate i")
let alternateQR_mode = false

function toggleAlternateQR(){
  if(alternateQR_mode === false){
    document.querySelector(".qrContainer").setAttribute("alterante-mode", "true")
    alternateQRInputIcon.classList.remove("fa-wifi-slash")
    alternateQRInputIcon.classList.add("fa-wifi")
    alternateQR_mode = true
  }else{
    alternateQR_mode = false
    document.querySelector(".qrContainer").setAttribute("alterante-mode", "false")
    alternateQRInputIcon.classList.remove("fa-wifi")
    alternateQRInputIcon.classList.add("fa-wifi-slash")
  }
  generateCodes()
  console.log("alternateQR_mode === " + alternateQR_mode)
}

alternateQRInput.forEach(checkbox => {
  checkbox.addEventListener("click", toggleAlternateQR);
});

// * qrHistory
const qrHistory = document.querySelector(".qrHistory")
const changelogHistory = document.querySelector(".changelogHistory")
const historyToggleOpen = document.querySelector(".historyToggleOpen")
const historyToggleClose = document.querySelector(".historyToggleClose")
const changelogToggleOpen = document.querySelector(".changelogToggleOpen")
const changelogToggleClose = document.querySelector(".changelogToggleClose")
const menu = document.querySelector(".menu")
let changeLog__active = false;

function toggleMenu(){
  if(!menuOpen == true){
    menu.style.display = "flex"
  } else{
    menu.style.display = "none"
  }
}

function openQrHistory(){
  qrHistory.style.display = "block"
  toggleMenu()
  setTimeout(()=>{
      qrHistory.style.transform = "translateX(0)"
  },1)
}

function closeQrHistry(){
  qrHistory.style.transform = "translateX(-100%)"
  setTimeout(()=>{
      qrHistory.style.display = "none"
      toggleMenu()
  },300)
}

function openChangeLog(){
  changelogHistory.style.display = "block"
  toggleMenu()
   masterChecboxChangeStat()
  setTimeout(()=>{
      changelogHistory.style.transform = "translateX(0)"
  },1)
}

function closeChangeLog(){
  changelogHistory.style.transform = "translateX(-100%)"
  setTimeout(()=>{
      changelogHistory.style.display = "none"
      toggleMenu()
       masterChecboxChangeStat()
  },300)
}
historyToggleOpen.addEventListener("click", ()=>{
  menuOpen = true;
  openQrHistory()
  toggleMenu()
  makeSoundClick();
})

historyToggleClose.addEventListener("click",()=>{
  closeQrHistry();
  menuOpen = false;
  makeSoundClick();
})

changelogToggleOpen.addEventListener("click",()=>{
  menuOpen = true;
  changeLog__active = true
  openChangeLog();
  toggleMenu()
  makeSoundClick();
})
changelogToggleClose.addEventListener("click", ()=>{
  closeChangeLog();
  menuOpen = false;
  changeLog__active = false;
  makeSoundClick();
  setTimeout(() => {
    document.querySelectorAll('.changeLogItem').forEach(item => {
      item.classList.remove('open');
    });
  }, 300);
})

document.querySelectorAll('.itemTitle').forEach(item => {
  item.addEventListener('click', function() {
      this.closest('.changeLogItem').classList.toggle('open');
  });
});

// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
document.addEventListener('DOMContentLoaded', function() {
    // Функция для обновления счетчика в div с классом historyCounter
    function updateCounter() {
        var historyList = document.querySelector('.historyList');
        var historyCounter = document.querySelector('.historyCounter');

        // Получаем количество элементов в historyList
        var itemCount = historyList ? historyList.children.length : 0;

        // Если есть хотя бы один элемент, и его значение больше 1, показываем historyCounter
        if (itemCount > 0) {
            historyCounter.style.display = 'flex';
            historyCounter.textContent = itemCount;
        } else {
            historyCounter.style.display = 'none';
        }
    }

    // Вызываем функцию для обновления содержимого при загрузке страницы
    updateCounter();

    // Создаем новый экземпляр MutationObserver
    var observer = new MutationObserver(function(mutationsList) {
        // При каждой мутации вызываем функцию для обновления счетчика
        updateCounter();
    });

    // Наблюдаем за изменениями в списке
    var historyList = document.querySelector('.historyList');
    if (historyList) {
        observer.observe(historyList, { childList: true });
    }

    // Обработчик события для кнопки с классом print__code
    var printCodeButton = document.querySelector('.print__code');
    if (printCodeButton) {
        printCodeButton.addEventListener('click', function() {
            // Вызываем функцию для обновления содержимого при клике на кнопку
            updateCounter();
        });
    }
});
// TODO 
document.addEventListener('DOMContentLoaded', function() {
  // Находим родительский элемент, куда будем добавлять .historyItem
  var historyList = document.querySelector('.historyList');
  
  // Определяем версию (если не определена)
  var version = version || '1.0';
  
  // Функция для открытия картинки в новой странице
  function openImageInNewPage(imageSrc) {
    // Открываем новую страницу
    var newWindow = window.open();
    // Записываем в новую страницу HTML с картинкой и стилями
    newWindow.document.write(`
      <html>
      <head>
        <title>QR История — Diman ${version}</title>
        <link rel="shortcut icon" href="img/iconTab.png">
        <link rel="shortcut icon" href="img/iconTab.ico" type="image/x-icon">
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap" rel="stylesheet">
        <style>
          body, html {
            font-family: "Roboto", sans-serif;
          }
          body {
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #000000;
          }
          img {
            max-width: 120%;
            max-height: 120%;
            z-index: 9999;
          }
          canvas {
            width: 100%;
            height: 100%;
            display: block;
            position: fixed;
            background-size: 100%;
            background-repeat: no-repeat;
            background: linear-gradient(0deg, #ff00c51f, #ffa04f1f);
          }
        </style>
      </head>
      <body>
        <canvas id="particle-canvas"></canvas>
        <img src="${imageSrc}">
        <script src="history.js"></script>
      </body>
      </html>
    `);
    // Закрываем запись в новой странице
    newWindow.document.close();
  }
  
  // Обработчик клика по элементу .historyItem
  function openImageHandler(event) {
    var imageSrc = this.querySelector('img').src;
    openImageInNewPage(imageSrc);
  }
  
  // Создаем новый экземпляр MutationObserver
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      // Проверяем, были ли добавлены новые элементы
      if (mutation.addedNodes.length > 0) {
        // Для каждого нового элемента проверяем, является ли он .historyItem
        mutation.addedNodes.forEach(function(node) {
          if (node.classList && node.classList.contains('historyItem')) {
            // Если да, добавляем к нему слушатель событий
            node.addEventListener('click', openImageHandler);
          }
        });
      }
    });
  });
  
  // Запуск наблюдения за изменениями в DOM-дереве
  var config = { childList: true, subtree: true };
  observer.observe(document.body, config);
  // Начинаем наблюдение за mutations
  observer.observe(historyList, { childList: true });
});

const generatorType = document.querySelectorAll(".typeSwitch");
const containers = document.querySelectorAll(".container");
let generatorTypeFirst = 0;

function switchGeneratorType(currentItem, allItems) {
  if (currentItem.getAttribute("generatorType") === "active") {
    return;
  }

  allItems.forEach(item => {
    item.setAttribute('generatorType', 'disabled');
    item.setAttribute('disabled', true);
    item.classList.remove('active');
    setTimeout(() => {
      item.removeAttribute('disabled');
    }, 1100);
  });

  currentItem.setAttribute('generatorType', 'active');
  currentItem.classList.add('active');

  const webTitle = document.querySelector('.webTitle')

  if (currentItem.classList.contains("generatorTypeSwitchQR")) {
    generatorTypeFirst = 0;
    transitionContainers("QR");
  } else if (currentItem.classList.contains("generatorTypeSwitchLots")) {
    generatorTypeFirst = 1;
    transitionContainers("Lots");
  } else if (currentItem.classList.contains("generatorTypeSwitchPolybox")) {
    generatorTypeFirst = 2;
    transitionContainers("Polybox");
  } else if (currentItem.classList.contains("generatorCart")) {
    generatorTypeFirst = 4;
    transitionContainers("Carts");
  } else {
    return
  }
}

function transitionContainers(type) {
  containers.forEach(container => {
    if (container.getAttribute("swtichTypeMode") === "active") {
      container.classList.remove("visible");
      container.classList.add("hidden");
      container.setAttribute("swtichTypeMode", "disabled");
      setTimeout(() => {
        container.style.display = "none";
        updateContainers(type);
      }, 500);
    }
  });
}

function updateContainers(type) {
  const particleCanvas = document.querySelector("#particle-canvas")
  const webTitleBlur = document.querySelector(".webTitleBlur")
  const webTitle = document.querySelector("h1.webTitle")
  const versionName = document.querySelector(".versionName")
  const authourName = document.querySelector(".authourName")
  containers.forEach(container => {
    if (type === "QR" && container.classList.contains("containerQR")) {
      container.style.display = "flex";
      setTimeout(() => {
        document.querySelector(".forOtherSc").style.filter = "hue-rotate(0deg)"
        container.classList.remove("hidden");
        container.classList.add("visible");
        container.setAttribute("swtichTypeMode", "active");
        particleColorOnEnter = "#01c3fc"
        particleColorOnLeave = "#9158ff"
        webTitle.classList.remove("webTitleTransition")
        authourName.classList.remove("webTitle-extra-Transition")
        versionName.classList.remove("webTitle-extra-Transition")
        
        webTitle.innerHTML = `QR-Код Генератор
                        <div class="versionName webTitle-extra-Transition" style="color: #00e5ff; text-shadow: 0 0 10px #00e5ff;">${version}</div>
                        <div class="authourName webTitle-extra-Transition" style="color: #00e5ff; text-shadow: 0 0 10px #00e5ff;">от Димана</div>`
        particleCanvas.style.background = `linear-gradient(240deg, ${particleColorOnEnter + "1f"}, ${particleColorOnLeave + "1f"})`
        versionName.style.color = "#00e5ff"
        authourName.style.textShadow = "0 0 10px #00e5ff"
        webTitleBlur.style.background = `linear-gradient(0deg, ${particleColorOnEnter}, ${particleColorOnLeave})`
        webTitle.style.border = `1px solid ${particleColorOnEnter}`
        webTitle.style.boxShadow = `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px, 0px -6px 20px -10px ${particleColorOnEnter} inset, 0px -20px 40px -10px ${particleColorOnLeave} inset`
        webTitle.style.borderTop = `0`
        changeFavicons()
        const styleElement = document.querySelector(".mainStyle");
        styleElement.textContent = `
            ::selection {
                background: #6846bf;
                color: #fff;
            }
        `;
      }, 10);
      setTimeout(()=>{
        webTitle.classList.add("webTitleTransition")
        versionName.classList.add("webTitle-extra-Transition")
        authourName.classList.add("webTitle-extra-Transition")
      },200)
    } else if (type === "Lots" && container.classList.contains("containerLots")) {
      container.style.display = "flex";
      setTimeout(() => {
        document.querySelector(".forOtherSc").style.filter = "hue-rotate(230deg)"
        container.classList.remove("hidden");
        container.classList.add("visible");
        container.setAttribute("swtichTypeMode", "active");
        particleColorOnEnter = "#8fff00";
        particleColorOnLeave = "#ffe200";
        webTitle.classList.remove("webTitleTransition")
        authourName.classList.remove("webTitle-extra-Transition")
        versionName.classList.remove("webTitle-extra-Transition")
 
        webTitle.innerHTML = `Генератор обезличеных лотов
                        <div class="versionName webTitle-extra-Transition" style="color: #c2ff00; text-shadow: 0 0 10px #c2ff00;">${versionLots}</div>
                        <div class="authourName webTitle-extra-Transition" style="color: #c2ff00; text-shadow: 0 0 10px #c2ff00;">от Димана</div>`
        particleCanvas.style.background = `linear-gradient(240deg, ${particleColorOnEnter + "1f"}, ${particleColorOnLeave + "1f"})`
        authourName.style.color = `${particleColorOnEnter}`
        authourName.style.textShadow = `0 0 10px ${particleColorOnEnter}`
        webTitleBlur.style.background = `linear-gradient(0deg, ${particleColorOnEnter}, ${particleColorOnLeave})`
        webTitle.style.border = `1px solid ${particleColorOnLeave}`
        webTitle.style.boxShadow = `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px, 0px -6px 20px -10px ${particleColorOnEnter} inset, 0px -20px 40px -10px ${particleColorOnLeave} inset`
        webTitle.style.borderTop = `0`
        changeFavicons()
        const styleElement = document.querySelector(".mainStyle");
        styleElement.textContent = `
            ::selection {
                background: #7cb900;
                color: #fff;
            }
        `;
      }, 10);
      setTimeout(()=>{
        webTitle.classList.add("webTitleTransition")
        versionName.classList.add("webTitle-extra-Transition")
        authourName.classList.add("webTitle-extra-Transition")
      },200)
    } else if (type === "Polybox" && container.classList.contains("containerPolybox")) {
      container.style.display = "flex";
      setTimeout(() => {
        container.classList.remove("hidden");
        container.classList.add("visible");
        container.setAttribute("swtichTypeMode", "active");
        particleColorOnEnter = "#ff5858";
        particleColorOnLeave = "#fcc801";
        webTitle.classList.remove("webTitleTransition")
        authourName.classList.remove("webTitle-extra-Transition")
        versionName.classList.remove("webTitle-extra-Transition")
        
        webTitle.innerHTML = `Генератор лотов на полибоксы
                              <div class="versionName webTitle-extra-Transition" style="color: ${particleColorOnEnter}; text-shadow: 0 0 10px ${particleColorOnEnter};">${versionPoly}</div>
                              <div class="authourName webTitle-extra-Transition" style="color: ${particleColorOnEnter}; text-shadow: 0 0 10px ${particleColorOnEnter};">от Димана</div>`
        particleCanvas.style.background = `linear-gradient(240deg, ${particleColorOnEnter + "1f"}, ${particleColorOnLeave + "1f"})`
        versionName.style.color = `${particleColorOnEnter}`
        versionName.style.textShadow = `0 0 10px ${particleColorOnEnter}`
        authourName.style.color = `${particleColorOnEnter}`
        authourName.style.textShadow = `0 0 10px ${particleColorOnEnter}`
        webTitleBlur.style.background = `linear-gradient(0deg, ${particleColorOnEnter}, ${particleColorOnLeave})`
        webTitle.style.border = `1px solid ${particleColorOnLeave}`
        webTitle.style.boxShadow = `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px, 0px -6px 20px -10px ${particleColorOnLeave} inset, 0px -20px 40px -10px ${particleColorOnEnter} inset`
        webTitle.style.borderTop = `0`
        changeFavicons()
        const styleElement = document.querySelector(".mainStyle");
        styleElement.textContent = `
            ::selection {
                background: #ff5858;
                color: #fff;
            }
        `;
      }, 10);
      setTimeout(()=>{
        webTitle.classList.add("webTitleTransition")
        versionName.classList.add("webTitle-extra-Transition")
        authourName.classList.add("webTitle-extra-Transition")
      },200)
    } else if (type === "Carts" && container.classList.contains("containerCarts")) {
      container.style.display = "flex";
      setTimeout(() => {
        container.classList.remove("hidden");
        container.classList.add("visible");
        container.setAttribute("swtichTypeMode", "active");
        particleColorOnEnter = "#C800FF";
        particleColorOnLeave = "#7a00ff";
        webTitle.classList.remove("webTitleTransition")
        authourName.classList.remove("webTitle-extra-Transition")
        versionName.classList.remove("webTitle-extra-Transition")
        
        webTitle.innerHTML = `Генератор MK и Cart
                              <div class="versionName webTitle-extra-Transition" style="color: ${particleColorOnEnter}; text-shadow: 0 0 10px ${particleColorOnEnter};">${versionCarts}</div>
                              <div class="authourName webTitle-extra-Transition" style="color: ${particleColorOnEnter}; text-shadow: 0 0 10px ${particleColorOnEnter};">от Димана</div>`
        particleCanvas.style.background = `linear-gradient(240deg, ${particleColorOnEnter + "1f"}, ${particleColorOnLeave + "1f"})`
        versionName.style.color = `${particleColorOnLeave}`
        versionName.style.textShadow = `0 0 10px ${particleColorOnLeave}`
        authourName.style.color = `${particleColorOnLeave}`
        authourName.style.textShadow = `0 0 10px ${particleColorOnLeave}`
        webTitleBlur.style.background = `linear-gradient(0deg, ${particleColorOnEnter}, ${particleColorOnLeave})`
        webTitle.style.border = `1px solid ${particleColorOnEnter}`
        webTitle.style.boxShadow = `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px, 0px -16px 30px -10px ${particleColorOnLeave} inset, 0px -20px 40px -10px ${particleColorOnEnter} inset`
        webTitle.style.borderTop = `0`
        changeFavicons()
        const styleElement = document.querySelector(".mainStyle");
        styleElement.textContent = `
            ::selection {
                background: #F200FFFF;
                color: #fff;
            }
        `;
      }, 10);
      setTimeout(()=>{
        webTitle.classList.add("webTitleTransition")
        versionName.classList.add("webTitle-extra-Transition")
        authourName.classList.add("webTitle-extra-Transition")
      },200)
    }else if (type === "PEGASUS" && container.classList.contains("PEGASUS")) {
      container.style.display = "flex";
      setTimeout(() => {
        container.classList.remove("hidden");
        container.classList.add("visible");
        container.setAttribute("swtichTypeMode", "active");
        particleColorOnEnter = "#c000ff";
        particleColorOnLeave = "#00ff43";
        webTitle.classList.remove("webTitleTransition")
        authourName.classList.remove("webTitle-extra-Transition")
        versionName.classList.remove("webTitle-extra-Transition")
        
        webTitle.innerHTML = `Генератор Ручных Актов Приёма-передачи
                              <div class="versionName webTitle-extra-Transition" style="color: ${particleColorOnLeave}; text-shadow: 0 0 10px ${particleColorOnLeave};">${versionLabel}</div>
                              <div class="authourName webTitle-extra-Transition" style="color: ${particleColorOnLeave}; text-shadow: 0 0 10px ${particleColorOnLeave};">от Димана</div>`
        particleCanvas.style.background = `linear-gradient(240deg, ${particleColorOnEnter + "1f"}, ${particleColorOnLeave + "1f"})`
        versionName.style.color = `${particleColorOnLeave}`
        versionName.style.textShadow = `0 0 10px ${particleColorOnLeave}`
        authourName.style.color = `${particleColorOnLeave}`
        authourName.style.textShadow = `0 0 10px ${particleColorOnLeave}`
        webTitleBlur.style.background = `linear-gradient(0deg, ${particleColorOnEnter}, ${particleColorOnLeave})`
        webTitle.style.border = `1px solid ${particleColorOnLeave}`
        webTitle.style.boxShadow = `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px, 0px -16px 30px -10px ${particleColorOnLeave} inset, 0px -20px 40px -10px ${particleColorOnEnter} inset`
        webTitle.style.borderTop = `0`
        changeFavicons()
        const styleElement = document.querySelector(".mainStyle");
        styleElement.textContent = `
            ::selection {
                background: #319e6a;
                color: #fff;
            }
        `;
      }, 10);
      setTimeout(()=>{
        webTitle.classList.add("webTitleTransition")
        versionName.classList.add("webTitle-extra-Transition")
        authourName.classList.add("webTitle-extra-Transition")
      },200)
    }else if (type === "ARGUS" && container.classList.contains("ARGUS")) {
      container.style.display = "flex";
      setTimeout(() => {
        container.classList.remove("hidden");
        container.classList.add("visible");
        container.setAttribute("swtichTypeMode", "active");
        particleColorOnEnter = "#00ffc4";
        particleColorOnLeave = "#002bff";
        webTitle.classList.remove("webTitleTransition")
        authourName.classList.remove("webTitle-extra-Transition")
        versionName.classList.remove("webTitle-extra-Transition")
        
        webTitle.innerHTML = `Сканер Ручных Актов Приёма-передачи
                              <div class="versionName webTitle-extra-Transition" style="color: ${particleColorOnEnter}; text-shadow: 0 0 10px ${particleColorOnEnter};">${versionLabel}</div>
                              <div class="authourName webTitle-extra-Transition" style="color: ${particleColorOnEnter}; text-shadow: 0 0 10px ${particleColorOnEnter};">от Димана</div>`
        particleCanvas.style.background = `linear-gradient(240deg, ${particleColorOnEnter + "1f"}, ${particleColorOnLeave + "1f"})`
        versionName.style.color = `${particleColorOnLeave}`
        versionName.style.textShadow = `0 0 10px ${particleColorOnLeave}`
        authourName.style.color = `${particleColorOnLeave}`
        authourName.style.textShadow = `0 0 10px ${particleColorOnLeave}`
        webTitleBlur.style.background = `linear-gradient(0deg, ${particleColorOnEnter}, ${particleColorOnLeave})`
        webTitle.style.border = `1px solid ${particleColorOnEnter}`
        webTitle.style.boxShadow = `rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px, 0px -16px 30px -10px ${particleColorOnLeave} inset, 0px -20px 40px -10px ${particleColorOnEnter} inset`
        webTitle.style.borderTop = `0`
        changeFavicons()
        const styleElement = document.querySelector(".mainStyle");
        styleElement.textContent = `
            ::selection {
                background: #00ffc4;
                color: #fff;
            }
        `;
      }, 10);
      setTimeout(()=>{
        webTitle.classList.add("webTitleTransition")
        versionName.classList.add("webTitle-extra-Transition")
        authourName.classList.add("webTitle-extra-Transition")
      },200)
    }
  });
}

// TODO: Изменение иконки сайта

function changeFavicons() {
  // Определяем путь к иконке в зависимости от значения generatorTypeFirst
  let newIconPath = '';
  switch (generatorTypeFirst) {
      case 0:
          newIconPath = 'img/icon.png';
          newTitle = `QR Генератор от Димана ${version}`;
          break;
      case 1:
          newIconPath = 'img/iconLots.png';
          newTitle = `Генератор обезличеных лотов ${versionLots}`;
          break;
      case 2:
          newIconPath = 'img/iconPolybox.png';
          newTitle = `Генератор лотов на полибоксы ${versionPoly}`;
          break;
      default:
          console.error('Invalid generatorTypeFirst value');
          return;
  }

  // Получаем все элементы с классом favIcon
  const favicons = document.querySelectorAll('link.favIcon');
  if (favicons.length === 0) {
      console.error('No favIcon links found.');
      return;
  }

  // Меняем путь для каждого найденного элемента
  favicons.forEach(favicon => {
      favicon.href = newIconPath;
  });
  document.title = newTitle;
}

generatorType.forEach(item => {
  item.addEventListener('click', () => {
    switchGeneratorType(item, generatorType);
    makeSoundClick()
  });
});

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  updateContainers("QR");
});

// TODO: CTRL+DEL очищает input'ы ✅
document.addEventListener('keydown', function(event) {
  const keyElements = document.querySelectorAll('[keyId]');

  if (event.ctrlKey && (event.key.toLowerCase() === 'z' || event.key.toLowerCase() === 'я')) {
      resetInput();
      const dataInputs = document.querySelectorAll(".dataInput");
      dataInputs.forEach(item => {
          item.value = "";
      });
  }

  keyElements.forEach(element => {
      const keyId = element.getAttribute('keyId');
      if (event.key === 'Control' && keyId === 'ctrl') {
          element.classList.add('keyPressed');
      }
      if ((event.key.toLowerCase() === 'z' || event.key.toLowerCase() === 'я') && keyId === 'z') {
          element.classList.add('keyPressed');
      }
      if ((event.key.toLowerCase() === 'p' || event.key.toLowerCase() === 'з') && keyId === 'p') {
          element.classList.add('keyPressed');
          const demoP = document.querySelector("[keyId=\"demo-p\"]")
          demoP.classList.add('keyPressed');
      }
  });
});

document.addEventListener('keyup', function(event) {
  const keyElements = document.querySelectorAll('[keyId]');

  keyElements.forEach(element => {
      const keyId = element.getAttribute('keyId');
      if (event.key === 'Control' && keyId === 'ctrl') {
          element.classList.remove('keyPressed');
      }
      if ((event.key.toLowerCase() === 'z' || event.key.toLowerCase() === 'я') && keyId === 'z') {
          element.classList.remove('keyPressed');
      }
      if ((event.key.toLowerCase() === 'p' || event.key.toLowerCase() === 'з') && keyId === 'p') {
          element.classList.remove('keyPressed');
          const demoP = document.querySelector("[keyId=\"demo-p\"]")
          demoP.classList.remove('keyPressed');
      }
  });
});


// TODO ctrl+p

window.onload = function() {
  // Запретить функцию печати
  window.print = function() {
      console.log("Печать отключена.");
  };

  // Запретить Ctrl+P
  document.addEventListener('keydown', function(event) {
      if (event.ctrlKey && event.key.toLowerCase() === 'p' || event.ctrlKey && event.key.toLowerCase() === 'з') {
          event.preventDefault();
          const qrCodeCreated = document.querySelector(".qrCodeCreated")
          if(qrCodeCreated){
            convertToImageAndOpenInNewTab();
          }else{
            return
          }
      }
  });
};

// TODO Кнопки переключения гифок ✅

const kittysDemoPlayerControl = document.querySelector('.kittysDemoPlayerControl');
const kittysDemoPlayerNext = document.querySelector('.kittysDemoPlayerNext');
const kittysDemoPlayerPrev = document.querySelector('.kittysDemoPlayerPrev');
const progressRing = document.getElementById('progress-ring');
let playerIsPaused = false;
const faPlay = `<i class="fa-solid fa-play" id="playerControlIcon"></i>`;
const faPause = `<i class="fa-solid fa-pause" id="playerControlIcon"></i>`;
let kittysInterval; // Идентификатор интервала
let progressInterval; // Интервал для прогресс-бара
let progressValue = 0;

const startColor = {r: 1, g: 195, b: 252};
const endColor = {r: 145, g: 88, b: 255};

kittysDemoPlayerControl.addEventListener('click', () => {
  makeSoundClick();
  if (playerIsPaused === false) {
    playerIsPaused = true;
    kittysDemoPlayerControl.classList.toggle('control-pause');
    kittysDemoPlayerControl.innerHTML = `${faPlay}`;
    clearInterval(progressInterval);
  } else if (playerIsPaused === true) {
    playerIsPaused = false;
    kittysDemoPlayerControl.classList.toggle('control-pause');
    kittysDemoPlayerControl.innerHTML = `${faPause}`;
    startProgress();
  }
});

kittysDemoPlayerNext.addEventListener('click', () => {
  changeKittyGif(true);
  makeSoundClick();
});

kittysDemoPlayerPrev.addEventListener('click', () => {
  changeKittyGif(false);
  makeSoundClick();
});

let kittysGifNumber = 0;
const kittys = document.querySelector(".kittysDemo");
const kittyCounter = document.querySelector(".kittysDemoCounter");
document.addEventListener('DOMContentLoaded', function() {
  kittysChange();
  startProgress();
});

function changeKittyGif(next) {
  if (next) {
    if (kittysGifNumber >= 50) {
      kittysGifNumber = 1;
    } else {
      kittysGifNumber++;
    }
  } else {
    if (kittysGifNumber <= 1) {
      kittysGifNumber = 50;
    } else {
      kittysGifNumber--;
    }
  }
  kittyCounter.innerText = kittysGifNumber;
  kittys.style.backgroundImage = `url("./img/goma and peach/catID_${kittysGifNumber}.gif")`;
  resetKittysChangeInterval();
}

function kittysChange() {
  kittysInterval = setInterval(() => {
    if (playerIsPaused === false) {
      kiitysSwitch();
    }
  }, 2000);
}

function kiitysSwitch() {
  if (kittysGifNumber !== 50) {
    kittysGifNumber++;
    kittyCounter.innerText = kittysGifNumber;
    kittys.style.backgroundImage = `url("./img/goma and peach/catID_${kittysGifNumber}.gif")`;
  } else {
    kittysGifNumber = 0;
  }
}

function resetKittysChangeInterval() {
  clearInterval(kittysInterval);
  clearInterval(progressInterval);
  progressValue = 0;
  updateProgressRing();
  kittysChange();
  if (!playerIsPaused) {
    startProgress();
  }
}

function startProgress() {
  progressValue = 0; // Сброс значения прогресса
  updateProgressRing();
  progressInterval = setInterval(() => {
    if (playerIsPaused === false) {
      progressValue += 1.67; // 100 / 60 = 1.67, так как 2000ms = 2s
      if (progressValue >= 100) {
        progressValue = 0;
      }
      updateProgressRing();
    }
  }, 33); // 2000ms / 60 = 33ms (60 кадров в 2 секунды)
}

function updateProgressRing() {
  progressRing.style.strokeDasharray = `${progressValue}, 100`;
  const color = interpolateColor(startColor, endColor, progressValue / 100);
  progressRing.style.stroke = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function interpolateColor(start, end, factor) {
  const result = {};
  result.r = Math.round(start.r + factor * (end.r - start.r));
  result.g = Math.round(start.g + factor * (end.g - start.g));
  result.b = Math.round(start.b + factor * (end.b - start.b));
  return result;
}

// TODO Кнопки открытия или закрытия всех changelog ✅
const changeLogItems = document.querySelectorAll('.changeLogItem')
const collapseChangelog = document.querySelector('.collapseChangelog')
const expandChangelog = document.querySelector('.expandChangelog')

collapseChangelog.addEventListener('click',()=>{
  changeLogItems.forEach(item => {
    item.classList.remove('open')
  });
})

expandChangelog.addEventListener('click',()=>{
  changeLogItems.forEach(item => {
    item.classList.add('open')
  });
})

// Объект для хранения всех звуковых опций
const soundOptions = {
  soundMain: true,
  textSound: true,
  attentionSound: true,
  keyboardSound: true,
  cleanSound: true,
};

const soundOptionElements = document.querySelectorAll('.soundOption');
const soundMainOn = document.querySelector('.soundMain-ON');
const soundMainOff = document.querySelector('.soundMain-OFF');

const textSoundOn = document.querySelector('.textSound-ON');
const textSoundOff = document.querySelector('.textSound-OFF');
const textSoundTest = document.querySelector('.textSound-TEST');
const attentionSoundOn = document.querySelector('.attentionSound-ON');
const attentionSoundOff = document.querySelector('.attentionSound-OFF');
const attentionSoundTest = document.querySelector('.attentionSound-TEST');
const keyboardSoundOn = document.querySelector('.keyboardSound-ON');
const keyboardSoundOff = document.querySelector('.keyboardSound-OFF');
const keyboardSoundTest = document.querySelector('.keyboardSound-TEST');
const cleanSoundOn = document.querySelector('.cleanSound-ON');
const cleanSoundOff = document.querySelector('.cleanSound-OFF');
const cleanSoundTest = document.querySelector('.cleanSound-TEST');
const soundOption = document.querySelectorAll('.soundOption > button')

// Функция для переключения звуковых опций
const toggleSoundOption = (soundKey, enable, onButton, offButton) => {
  soundOptions[soundKey] = enable; // Изменяем значение в объекте soundOptions
  onButton.style.display = enable ? 'flex' : 'none';
  offButton.style.display = enable ? 'none' : 'flex';
  onButton.disabled = !enable;
  offButton.disabled = enable;
  makeSoundClick();
};

// Функция для управления главным звуком
const toggleSoundMain = (enable) => {
  soundOptions.soundMain = enable;
  soundMainOn.style.display = enable ? 'flex' : 'none';
  soundMainOff.style.display = enable ? 'none' : 'flex';
  soundMainOn.disabled = !enable;
  soundMainOff.disabled = enable;
  soundOptionElements.forEach(item => item.setAttribute('soundAllowed', enable));
  if (enable === false) {
    soundOption.forEach(options => {
      options.setAttribute("disabled", "disabled");
    });
  }
  // Если звук включен (enable === true), удаляем атрибут disabled
  else if (enable === true) {
    soundOption.forEach(options => {
      options.removeAttribute("disabled");
    });
  }
};

// Добавляем обработчики событий для всех кнопок
soundMainOn.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('soundMain', false, soundMainOn, soundMainOff);
  }
});
soundMainOff.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('soundMain', true, soundMainOn, soundMainOff);
  }
});

textSoundOn.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('textSound', false, textSoundOn, textSoundOff);
  }
});
textSoundOff.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('textSound', true, textSoundOn, textSoundOff);
  }
});

attentionSoundOn.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('attentionSound', false, attentionSoundOn, attentionSoundOff);
  }
});
attentionSoundOff.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('attentionSound', true, attentionSoundOn, attentionSoundOff);
  }
});

keyboardSoundOn.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('keyboardSound', false, keyboardSoundOn, keyboardSoundOff);
  }
});
keyboardSoundOff.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('keyboardSound', true, keyboardSoundOn, keyboardSoundOff);
  }
});

cleanSoundOn.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('cleanSound', false, cleanSoundOn, cleanSoundOff);
  }
});
cleanSoundOff.addEventListener('click', () => {
  if (soundOptions.soundMain !== false) { // Проверяем, что soundMain не отключен
    toggleSoundOption('cleanSound', true, cleanSoundOn, cleanSoundOff);
  }
});

textSoundTest.addEventListener('click', ()=>{
  const audio = new Audio("audio/input.mp3");
  audio.play().catch(error => console.error("Error playing audio:", error));
})
attentionSoundTest.addEventListener('click', ()=>{
  const audio = new Audio("audio/attention.wav");
  audio.play().catch(error => console.error("Error playing audio:", error));
})
keyboardSoundTest.addEventListener('click', ()=>{
  const audio = new Audio("audio/click.mp3");
  audio.play().catch(error => console.error("Error playing audio:", error));
})
cleanSoundTest.addEventListener('click', ()=>{
  const audio = new Audio("audio/clear.mp3");
  audio.play().catch(error => console.error("Error playing audio:", error));
})

soundMainOn.addEventListener('click', () => toggleSoundMain(false));
soundMainOff.addEventListener('click', () => toggleSoundMain(true));

//TODO Функция для проигрывания звука
function makeSoundClick() {
  if (soundOptions.soundMain === true && soundOptions.keyboardSound === true) {
    const audio = new Audio("audio/click.mp3");
    audio.play().catch(error => console.error("Error playing audio:", error));
  } else {
    return;
  }
}
function makeSoundClean() {
  if (soundOptions.soundMain === true && soundOptions.cleanSound === true) {
    const audio = new Audio("audio/clear.mp3");
    audio.play().catch(error => console.error("Error playing audio:", error));
  } else {
    return;
  }
}
function makeSoundText() {
  if (soundOptions.soundMain === true && soundOptions.textSound === true) {
    const audio = new Audio("audio/input.mp3");
    audio.play().catch(error => console.error("Error playing audio:", error));
  } else {
    return;
  }
}
function makeSoundAttention() {
  if (soundOptions.soundMain === true && soundOptions.attentionSound === true) {
    const audio = new Audio("audio/attention.wav");
    audio.play().catch(error => console.error("Error playing audio:", error));
  } else {
    return;
  }
}

let masterCheckbox__interval = null; 
function masterChecboxChangeStat() {
  const toggleMasterCheckbox = document.querySelector("input#toggleMasterCheckbox");
  
  if (masterCheckbox__interval) {
    clearInterval(masterCheckbox__interval);
    masterCheckbox__interval = null;
  }

  if (changeLog__active === true && toggleMasterCheckbox) {
    masterCheckbox__interval = setInterval(() => {
      if(toggleMasterCheckbox.checked){
        toggleMasterCheckbox.checked = false;
      }else{
        toggleMasterCheckbox.checked = true
      }
    }, 1000);
  }
}